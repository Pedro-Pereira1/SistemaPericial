# ShieldAI

**ShieldAI** is a cutting-edge cybersecurity company leveraging artificial intelligence to empower organizations against emerging threats. Our innovative solutions enhance security operations, automate responses, and provide unparalleled insights to safeguard your digital assets.

---

## 🌟 Our Solutions

### 1. [**CyberMentor**: The Intelligent SOC Assistant](#cybermentor-the-intelligent-soc-assistant)
   - **Overview**: CyberMentor is an AI-driven expert system designed to optimize Security Operations Centers (SOCs). It automates alert classification and response, reducing false positives and improving efficiency.
   - **Key Features**:
     - Real-time Threat Detection
     - Automated Incident Response
     - User Behavior Analytics
     - Transparent Security Insights
   - **Benefits**:
     - Faster response times
     - Reduced workload for analysts
     - Improved training tool for junior SOC members

---

### 2. **[Solution Name Placeholder 1]**
   - **Overview**: [Brief description of this solution, e.g., focusing on endpoint security or threat intelligence.]
   - **Key Features**:
     - [Key feature 1]
     - [Key feature 2]
     - [Key feature 3]
   - **Benefits**:
     - [How it benefits the user, e.g., proactive defense against zero-day vulnerabilities.]

---

## 🚀 Why Choose ShieldAI?

- **Innovative Technology**: Our AI-powered solutions provide cutting-edge protection against evolving threats.
- **Efficiency at Scale**: Automate complex processes to focus on what matters most.
- **Trusted Expertise**: Developed by cybersecurity professionals with a focus on transparency and reliability.
- **Customizable Solutions**: Tailored to meet the unique security needs of your organization.

---

## 🛠️ CyberMentor: The Intelligent SOC Assistant
### Overview  
CyberMentor is an AI-driven expert system designed to empower Security Operations Centers (SOCs). By automating alert classification and response, it helps reduce false positives, minimize response times, and streamline cybersecurity operations.

### Key Features  
- **Real-time Threat Detection**: Monitors vulnerabilities and anomalies across systems continuously.  
- **Automated Incident Response**: Simplifies routine alert management tasks, reducing human effort.  
- **Transparent Security Analytics**: Provides clear insights into decision-making processes and actions taken.  
- **User Behavior Analysis**: Detects and flags suspicious user behavior to mitigate potential insider threats.  

### Benefits  
- **Reduced Response Time**: Automates workflows to accelerate incident handling.  
- **Improved Accuracy**: Expert-defined rules reduce false positives and improve classification.  
- **Training Tool**: Helps junior analysts learn SOC protocols and decision-making processes.  
- **Enhanced Efficiency**: Frees up analysts to focus on strategic tasks.  

---

### CyberMentor: The Intelligent SOC Assistant

#### Backend  
1. **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2. **Run the Python backend**:
    ```bash
    python -m uvicorn start:app --reload --port 7000
    ```

3. **Setup `.env` file**:  
   Create a `.env` file in the `/backend/` directory with the following structure:
    ```bash
    DB_CONNECTION_STRING='[MONGODB CONNECTION STRING]'
    ABUSEIPDB_API_KEY='[AbuseIPDB API KEY]'
    ```

4. **Run Prolog Server**:  
Start the Prolog server with the following commands:  
    ```bash
    swipl
    [router].
    startServer(5000).
    ```

5. **Run Drools Server**:
    - Open the project in IntelliJ.
    - Add jFuzzyLogic.jar to the project structure.
    - Run the DemoApplication file.

#### Frontend 
1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Run the frontend**:
    ```bash
    npm run dev
    ```


---

## 🛠️ Get Started

Contact us at [info@shieldai.com](mailto:info@shieldai.com) to learn more about how ShieldAI can elevate your cybersecurity defenses.





