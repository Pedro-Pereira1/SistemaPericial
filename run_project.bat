@echo off
echo Starting Frontend...
start cmd /k "cd frontend-app && npm start"

echo Starting Backend...
start cmd /k "cd backend && python -m uvicorn start:app --reload --port 7000"

echo Starting Backend ML...
start cmd /k "cd backend_ml && python -m uvicorn start:app --reload --port 6500"

echo All services started!
