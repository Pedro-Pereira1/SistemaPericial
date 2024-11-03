# Shield AI - CyberMentor

## 🔨 How to run

Install Python dependencies

    pip install -r requirements.txt

Run Python backend

    python -m uvicorn start:app --reload --port 7000
 
.env Python backend structure

Location: /backend/.env
 
    DB_CONNECTION_STRING=''
    ABUSEIPDB_API_KEY=''
 
Prolog commands
 
    swipl (executar o prolog)
    [router]. (Consult do ficheiro router.pl)
    startServer(5000). (Abrir o servidor no porto 5000)
 
Drools
 
Open the project in intelliJ
Add the jFuzzyLogic.jar to the project structure
Run the file DemoApplication

Frontend

Install dependencies

    npm install

Run the frontend

    npm run dev