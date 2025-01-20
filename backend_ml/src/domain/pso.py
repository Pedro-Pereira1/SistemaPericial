import random
from typing import List, Tuple
from src.domain.genetic_algorithm import fitness as fit
from src.domain.alert import Alert
from src.domain.user import User

# PSO Parameters
c1 = 1.5
c2 = 1.5
w = 0.7

def particle_swarm_optimization(alerts: List[Alert], users: List[User], swarm_size: int, generations: int):
    num_alerts = len(alerts)
    num_users = len(users)
    
    particles = [
        {
            "position": [random.choice(range(num_users)) for _ in range(num_alerts)],
            "velocity": [0 for _ in range(num_alerts)],
            "best_position": None,
            "best_fitness": float("-inf")
        }
        for _ in range(swarm_size)
    ]
    
    # Initialize global best
    global_best_position = None
    global_best_fitness = float("-inf")

    def evaluate_fitness(position: List[int]) -> float:
        """Evaluate the fitness of a particle based on its position."""
        individual = {user.id: [] for user in users}
        for alert_idx, user_idx in enumerate(position):
            individual[users[user_idx].id].append(alerts[alert_idx].id)
        return fit(individual, alerts, users)

    for particle in particles:
        particle["best_position"] = particle["position"][:]
        particle["best_fitness"] = evaluate_fitness(particle["position"])
        if particle["best_fitness"] > global_best_fitness:
            global_best_position = particle["position"][:]
            global_best_fitness = particle["best_fitness"]

    # Main loop
    for generation in range(generations):
        for particle in particles:
            # Update velocity
            for i in range(num_alerts):
                inertia = w * particle["velocity"][i]
                cognitive = c1 * random.random() * (particle["best_position"][i] - particle["position"][i])
                social = c2 * random.random() * (global_best_position[i] - particle["position"][i])
                particle["velocity"][i] = inertia + cognitive + social

            # Update position
            particle["position"] = [
                int((particle["position"][i] + particle["velocity"][i]) % num_users)
                for i in range(num_alerts)
            ]

            # Ensure no duplicate assignments
            alert_to_user = {alert_idx: particle["position"][alert_idx] for alert_idx in range(num_alerts)}
            unique_alerts = set(alert_to_user.keys())
            particle["position"] = [alert_to_user[alert] for alert in sorted(unique_alerts)]

            fitness_score = evaluate_fitness(particle["position"])

            if fitness_score > particle["best_fitness"]:
                particle["best_position"] = particle["position"][:]
                particle["best_fitness"] = fitness_score

            if fitness_score > global_best_fitness:
                global_best_position = particle["position"][:]
                global_best_fitness = fitness_score

        print(f"Generation {generation}: Best Fitness = {global_best_fitness}")

    best_population = {users[user_idx].id: [] for user_idx in range(num_users)}
    for alert_idx, user_idx in enumerate(global_best_position):
        best_population[users[user_idx].id].append(alerts[alert_idx].id)

    user_workload = {user.id: 0 for user in users}
    for user_id, alert_ids in best_population.items():
        for alert_id in alert_ids:
            alert = next(alert for alert in alerts if alert.id == alert_id)
            user = next(user for user in users if user.id == user_id)
            estimated_time = (1 / (0.5 * alert.priority) * 60) / (1 + (user.experience_score / 100))
            user_workload[user_id] += estimated_time

    print("\nFinal workloads per user:")
    for user_id, workload in user_workload.items():
        print(f"User {user_id}: {workload:.2f} minutes")

    return {
        "best_position": global_best_position,
        "best_fitness": global_best_fitness,
        "assignments": best_population,
        "workloads": user_workload
    }
