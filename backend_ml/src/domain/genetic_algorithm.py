from src.domain.alert import Alert
from src.domain.user import User
from typing import List, Tuple

import random
# Genetic Algorithm Functions
def generate_initial_population(alerts: List[Alert], users: List[User], population_size: int) -> List[dict[str, List[str]]]:
    population = []
    for _ in range(population_size):
        individual = {user.id: [] for user in users}
        alerts_copy = alerts[:]
        random.shuffle(alerts_copy)  # Shuffle alerts for randomness

        for alert in alerts_copy:
            assigned_user = random.choice(users).id
            individual[assigned_user].append(alert.id)

        population.append(individual)
    return population



def fitness(individual: dict[str, List[str]], alerts: List[Alert], users: List[User]) -> float:
    score = 0
    user_workload = {user.id: 0 for user in users}  # Track workload per user

    base_time_unit = 60  # Base time unit in minutes (1 hour)

    # Calculate individual scores for each user's assignments
    for user_id, alert_ids in individual.items():
        user = next(user for user in users if user.id == user_id)
        previous_priority = 0  # Track the last processed priority for ordering

        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)

            # Calculate estimated resolution time
            estimated_time = ((1/(0.5*alert.priority)) * base_time_unit) / (1 + (user.experience_score / 100))

            # Add to user's workload
            user_workload[user_id] += estimated_time

            # Define time limit based on priority
            time_limit = alert.priority * base_time_unit
            # Reward for staying within the time limit
            if estimated_time <= time_limit:
                score += (time_limit - estimated_time) / time_limit * 50  # Reward proportional to saved time
            else:
                # Penalize for exceeding time limit
                score -= (estimated_time - time_limit) * 2  # Penalty for time overrun

            # Penalize alerts being processed out of order
            if alert.priority < previous_priority:  # A higher-priority alert is scheduled after a lower-priority one
                score -= 50 * (previous_priority - alert.priority)  # Penalty based on priority difference

            # Reward for matching user preferences
            if alert.category in user.preferences:
                score += 10

            previous_priority = alert.priority  # Update the last processed priority

    # Penalize workloads exceeding 8 hours (480 minutes)
    for user_id, workload in user_workload.items():
        if workload > 480:
            print("Someone overworked")
            score -= (workload - 480) * 5  # Severe penalty for overwork

    # Calculate average workload for balancing
    total_workload = sum(user_workload.values())
    avg_workload = total_workload / len(users)

    # Penalize for workload imbalance
    for user_id, workload in user_workload.items():
        deviation = abs(workload - avg_workload)
        score -= deviation * 2  # Penalty proportional to deviation from average

    return score

def select_parents(population: List[List[Tuple[str, str]]], fitnesses: List[float]) -> List[List[Tuple[str, str]]]:
    total_fitness = sum(fitnesses)
    probabilities = [f / total_fitness for f in fitnesses]
    return random.choices(population, probabilities, k=2)

def crossover(parent1: dict[str, List[str]], parent2: dict[str, List[str]]) -> dict[str, List[str]]:
    child = {user_id: [] for user_id in parent1.keys()}
    alerts_in_child = set()

    # Assign alerts from parent1
    for user_id, alerts in parent1.items():
        for alert_id in alerts:
            if alert_id not in alerts_in_child:
                child[user_id].append(alert_id)
                alerts_in_child.add(alert_id)

    # Assign remaining alerts from parent2
    for user_id, alerts in parent2.items():
        for alert_id in alerts:
            if alert_id not in alerts_in_child:
                child[user_id].append(alert_id)
                alerts_in_child.add(alert_id)

    return child


def mutate(individual: dict[str, List[str]], alerts: List[Alert], users: List[User], mutation_rate: float = 0.1) -> dict[str, List[str]]:
    if random.random() < mutation_rate:
        # Select a random alert and its current user
        user_id = random.choice(list(individual.keys()))
        if not individual[user_id]:
            return individual  # Skip if user has no alerts

        alert_id = random.choice(individual[user_id])
        individual[user_id].remove(alert_id)  # Remove alert from the current user

        # Reassign to a new user with available workload
        eligible_users = [
            u for u in users
            if sum((1/(0.5*next(a for a in alerts if a.id == alert_id).priority) * 60) /
                   (1 + (u.experience_score / 100)) for alert_id in individual[u.id]) < 480
        ]

        if eligible_users:
            new_user = random.choice(eligible_users)
            individual[new_user.id].append(alert_id)
        else:
            # If no eligible user is found, revert to the original user
            individual[user_id].append(alert_id)
    return individual


def redistribute_workload(individual: dict[str, List[str]], alerts: List[Alert], users: List[User]) -> dict[str, List[str]]:
    user_workload = {user.id: 0 for user in users}
    redistributed_individual = {user.id: [] for user in users}

    # Calculate workloads
    for user_id, alert_ids in individual.items():
        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)
            user = next(user for user in users if user.id == user_id)
            estimated_time = ((1/(0.5*alert.priority) * 60) / (1  + (user.experience_score / 100)))
            user_workload[user_id] += estimated_time

    # Redistribute alerts
    for user_id, alert_ids in individual.items():
        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)
            estimated_time = (1/(0.5*alert.priority) * 60) / (1  + (next(user for user in users if user.id == user_id).experience_score / 100))

            # Find an eligible user
            eligible_users = [
                u for u in users if user_workload[u.id] + estimated_time <= 480
            ]

            if eligible_users:
                selected_user = random.choice(eligible_users)
                redistributed_individual[selected_user.id].append(alert_id)
                user_workload[selected_user.id] += estimated_time
            else:
                # Fallback: Keep the alert with the original user
                redistributed_individual[user_id].append(alert_id)

    return redistributed_individual


def genetic_algorithm(alerts: List[Alert], users: List[User], generations: int, population_size: int):
    population = generate_initial_population(alerts, users, population_size)
    
    best_population = None
    best_fitness_score = -float('inf')  # Initialize to negative infinity

    for generation in range(generations):
        fitnesses = [fitness(ind, alerts, users) for ind in population]
        print(f"Generation {generation}:")
        
        # Track the best individual in the current generation
        best_individual_in_generation = max(fitnesses)
        best_individual_in_generation_idx = fitnesses.index(best_individual_in_generation)
        
        print(f"Best individual in generation {generation} with fitness score: {best_individual_in_generation}")
        
        # Update best population if current generation's best individual is better than the previous best
        if best_individual_in_generation > best_fitness_score:
            best_fitness_score = best_individual_in_generation
            best_population = population[best_individual_in_generation_idx]

        # Print fitness scores for all individuals in the population
        for i, fit in enumerate(fitnesses):
            print(f"Individual {i} fitness score: {fit}")
        
        new_population = []
        for _ in range(len(population) // 2):
            parent1, parent2 = select_parents(population, fitnesses)
            child1 = crossover(parent1, parent2)
            child2 = crossover(parent2, parent1)

            # Mutation
            child1 = mutate(child1, alerts, users)
            child2 = mutate(child2, alerts, users)

            # Redistribute workloads
            #child1 = redistribute_workload(child1, alerts, users)
            #child2 = redistribute_workload(child2, alerts, users)
            new_population.extend([child1, child2])
        
        population = new_population

    # Final evaluation
    fitnesses = [fitness(ind, alerts, users) for ind in population]
    best_individual = population[fitnesses.index(max(fitnesses))]

    # Compute workloads for output
    user_workload = {user_id: 0 for user_id in best_individual.keys()}
    for user_id, alert_ids in best_individual.items():
        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)
            user = next(user for user in users if user.id == user_id)
            estimated_time = (1/(0.5*alert.priority) * 60) / (1 + (user.experience_score / 100))
            user_workload[user_id] += estimated_time

    print("Best individual after all generations:")
    print(f"Fitness score: {best_fitness_score}")
    print("Workloads:", user_workload)

    return {
        "assignments": best_population,
        "workloads": user_workload
    }


