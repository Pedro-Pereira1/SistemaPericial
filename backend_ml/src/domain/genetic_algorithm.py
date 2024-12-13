from src.domain.alert import Alert
from src.domain.user import User
from typing import List, Tuple

import random
# Genetic Algorithm Functions
def generate_initial_population(alerts: List[Alert], users: List[User], population_size: int) -> List[List[Tuple[str, str]]]:
    population = []
    for _ in range(population_size):
        individual = [(alert.id, random.choice(users).id) for alert in alerts]
        population.append(individual)
    return population

def fitness(individual: List[Tuple[str, str]], alerts: List[Alert], users: List[User]) -> float:
    # Fitness calculation (simplified)
    score = 0
    for alert_id, user_id in individual:
        alert = next(alert for alert in alerts if alert.id == alert_id)
        user = next(user for user in users if user.id == user_id)
        score += alert.priority * user.experience_score
    return score

def select_parents(population: List[List[Tuple[str, str]]], fitnesses: List[float]) -> List[List[Tuple[str, str]]]:
    total_fitness = sum(fitnesses)
    probabilities = [f / total_fitness for f in fitnesses]
    return random.choices(population, probabilities, k=2)

def crossover(parent1: List[Tuple[str, str]], parent2: List[Tuple[str, str]]) -> List[Tuple[str, str]]:
    point = random.randint(0, len(parent1) - 1)
    return parent1[:point] + parent2[point:]

def mutate(individual: List[Tuple[str, str]], users: List[User], mutation_rate: float = 0.1) -> List[Tuple[str, str]]:
    if random.random() < mutation_rate:
        idx = random.randint(0, len(individual) - 1)
        alert_id, _ = individual[idx]
        new_user_id = random.choice(users).id
        individual[idx] = (alert_id, new_user_id)
    return individual

# Main Genetic Algorithm
def genetic_algorithm(alerts: List[Alert], users: List[User], generations: int, population_size: int):
    population = generate_initial_population(alerts, users, population_size)
    for generation in range(generations):
        fitnesses = [fitness(ind, alerts, users) for ind in population]
        new_population = []
        for _ in range(len(population) // 2):
            parent1, parent2 = select_parents(population, fitnesses)
            child1 = crossover(parent1, parent2)
            child2 = crossover(parent2, parent1)
            new_population.extend([mutate(child1, users), mutate(child2, users)])
        population = new_population
    # Return the best individual
    fitnesses = [fitness(ind, alerts, users) for ind in population]
    best_individual = population[fitnesses.index(max(fitnesses))]
    return best_individual
