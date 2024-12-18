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
    user_workload = {user.id: 0 for user in users}
    base_time_unit = 60  # Base time unit in minutes (1 hour)

    for user_id, alert_ids in individual.items():
        user = next(user for user in users if user.id == user_id)
        previous_priority = 0
        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)
            estimated_time = ((1/(0.5*alert.priority)) * base_time_unit) / (1 + (user.experience_score / 100))
            user_workload[user_id] += estimated_time

            time_limit = alert.priority * base_time_unit
            if estimated_time <= time_limit:
                score += (time_limit - estimated_time) / time_limit * 50
            else:
                score -= (estimated_time - time_limit) * 2

            if alert.priority < previous_priority:
                score -= 50 * (previous_priority - alert.priority)
            
            previous_priority = alert.priority
            score += 1/alert.priority * (user.experience_score/5)
    # Additional debugging of user workloads
    for user_id, workload in user_workload.items():
        if workload > 480:
            score -= (workload - 480) * 5  # Penalty for overwork

    total_workload = sum(user_workload.values())
    avg_workload = total_workload / len(users)
    for user_id, workload in user_workload.items():
        deviation = abs(workload - avg_workload)
        score -= deviation

    #print(f"Fitness score for individual: {score}")  # Debugging line
    return score

def select_parents(population: List[List[Tuple[str, str]]], fitnesses: List[float]) -> List[List[Tuple[str, str]]]:
    selected = random.sample(list(zip(population, fitnesses)), k=2)
    selected.sort(key=lambda x: x[1], reverse=True)
    return selected[0][0], selected[1][0]

def crossover(parent1: dict[str, List[str]], parent2: dict[str, List[str]], alerts: List[Alert], users: List[User]) -> dict[str, List[str]]:
    child = {user_id: [] for user_id in parent1.keys()}
    user_workload = {user_id: 0 for user_id in users}

    # Combine all alerts from both parents
    all_alerts = set(alert for alerts in parent1.values() for alert in alerts)
    all_alerts.update(alert for alerts in parent2.values() for alert in alerts)
    all_alerts = list(all_alerts)
    random.shuffle(all_alerts)

    # Assign alerts based on workload
    for alert_id in all_alerts:
        # Find the user with the lowest workload
        selected_user = min(users, key=lambda u: user_workload[u])
        child[selected_user.id].append(alert_id)
        alert = next(alert for alert in alerts if alert.id == alert_id)
        estimated_time = (1 / (0.5 * alert.priority) * 60) / (1 + (selected_user.experience_score / 100))
        user_workload[selected_user] += estimated_time

    return child




def mutate(individual: dict[str, List[str]], alerts: List[Alert], users: List[User], mutation_rate: float = 0.1) -> dict[str, List[str]]:
    if random.random() < mutation_rate:
        # Select a random alert and its current user
        user_id = random.choice(list(individual.keys()))
        if not individual[user_id]:
            return individual  # Skip if user has no alerts

        alert_id = random.choice(individual[user_id])
        individual[user_id].remove(alert_id)  # Remove alert from the current user

        eligible_users = [
            u for u in users
            if sum((1/(0.5*next(a for a in alerts if a.id == alert_id).priority) * 60) /
                   (1 + (u.experience_score / 100)) for alert_id in individual[u.id]) < 480
        ]

        if eligible_users:
            new_user = random.choice(eligible_users)
            individual[new_user.id].append(alert_id)
        else:
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
            estimated_time = (1 / (0.5 * alert.priority) * 60) / (1 + (user.experience_score / 100))
            user_workload[user_id] += estimated_time

    # Redistribute alerts based on workloads
    for user_id, alert_ids in individual.items():
        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)
            estimated_time = (1 / (0.5 * alert.priority) * 60) / (
                1 + (next(user for user in users if user.id == user_id).experience_score / 100)
            )

            # Find the user with the lowest workload who can handle the alert
            selected_user = min(users, key=lambda u: user_workload[u.id])
            redistributed_individual[selected_user.id].append(alert_id)
            user_workload[selected_user.id] += estimated_time

    return redistributed_individual

from typing import List, Tuple

def select_next_generation(
    population: List[dict[str, List[str]]], 
    fitnesses: List[float], 
    population_size: int, 
    elitism_count: int = 2
) -> List[dict[str, List[str]]]:
    """
    Select the next generation for the genetic algorithm.

    Args:
        population: List of individuals (assignments).
        fitnesses: List of fitness scores corresponding to each individual.
        population_size: The desired population size for the next generation.
        elitism_count: Number of top individuals to retain through elitism.

    Returns:
        The next generation of individuals.
    """
    # Sort population by fitness (descending) and retain the top individuals for elitism
    sorted_population = sorted(zip(population, fitnesses), key=lambda x: x[1], reverse=True)
    top_individuals = [ind for ind, _ in sorted_population[:elitism_count]]

    # Remove top individuals from selection pool
    remaining_population = [ind for ind, _ in sorted_population[elitism_count:]]
    remaining_fitnesses = fitnesses[elitism_count:]

    # Perform roulette-wheel selection for the rest of the population without repetition
    selected_parents = []
    total_fitness = sum(remaining_fitnesses)

    for _ in range(population_size - elitism_count):
        # Recalculate probabilities for the remaining population
        probabilities = [fit / total_fitness for fit in remaining_fitnesses]
        selected_index = random.choices(range(len(remaining_population)), weights=probabilities, k=1)[0]
        
        # Add selected individual and remove them from the pool
        selected_parents.append(remaining_population.pop(selected_index))
        removed_fitness = remaining_fitnesses.pop(selected_index)
        total_fitness -= removed_fitness

    # Combine top individuals and selected parents
    next_generation = top_individuals + selected_parents

    # Ensure population size remains consistent (should already be correct)
    return next_generation[:population_size]



def genetic_algorithm(alerts: List[Alert], users: List[User], generations: int, population_size: int):
    # Generate initial population
    population = generate_initial_population(alerts, users, population_size)

    for generation in range(generations):
        # Evaluate fitness for the current population
        fitnesses = [fitness(ind, alerts, users) for ind in population]

        # Log current generation
        #print(f"\nGeneration {generation}:")
        #print("Individual scores (current generation):")
        sorted_population = sorted(
            zip(population, fitnesses),
            key=lambda x: x[1],
            reverse=True
        )

        # Print only the best individual
        best_individual, best_fitness = sorted_population[0]
        print(f"  Best individual: Fitness = {best_fitness}")

        # Select the next generation
        population = select_next_generation(population, fitnesses, population_size)

        # Generate offspring for the new population
        new_population = []
        for _ in range(len(population) // 2):
            parent1, parent2 = random.sample(population, 2)
            child1 = crossover(parent1, parent2, alerts, users)
            child2 = crossover(parent2, parent1, alerts, users)

            # Mutation
            child1 = mutate(child1, alerts, users)
            child2 = mutate(child2, alerts, users)

            # Redistribute workloads
            child1 = redistribute_workload(child1, alerts, users)
            child2 = redistribute_workload(child2, alerts, users)

            new_population.extend([child1, child2])

        # Maintain population size
        population.extend(new_population)

    # Final evaluation on the last population
    final_fitnesses = [fitness(ind, alerts, users) for ind in population]
    sorted_population = sorted(
        zip(population, final_fitnesses),
        key=lambda x: x[1],
        reverse=True
    )

    best_population = sorted_population[0][0]
    best_fitness_score = sorted_population[0][1]

    # Calculate workloads for the best individual
    user_workload = {user_id: 0 for user_id in best_population.keys()}
    for user_id, alert_ids in best_population.items():
        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)
            user = next(user for user in users if user.id == user_id)
            estimated_time = (1 / (0.5 * alert.priority) * 60) / (1 + (user.experience_score / 100))
            user_workload[user_id] += estimated_time

    # Log final results
    print("\nFinal results:")
    print(f"Best individual after all generations with fitness: {best_fitness_score}")
    print("Workloads:", user_workload)

    return {
        "assignments": best_population,
        "workloads": user_workload
    }




