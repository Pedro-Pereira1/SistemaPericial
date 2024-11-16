import React from 'react';
import './CyberMentor.css';

function CyberMentor() {
  return (
    <div className="cybermentor-container">
      <header className="cybermentor-header">
        <h1>CyberMentor: Your Intelligent Security Operations Center Assistant</h1>
        <p className="cybermentor-intro">
          CyberMentor is an AI-driven assistant for Security Operations Centers, optimizing threat detection, incident 
          response, and security analytics. With real-time monitoring and automated response capabilities, CyberMentor helps 
          you stay ahead of emerging threats, protecting your organization around the clock.
        </p>
      </header>

      <section className="cybermentor-image-section">
        <img
          src="src/components/pages/CyberMentor/CyberMentor.png"
          alt="CyberMentor"
          className="cybermentor-image"
        />
      </section>

      <section className="cybermentor-features">
        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Real-time Threat Detection:</strong> Constantly monitors for vulnerabilities and anomalies across networks and systems.
          </li>
          <li>
            <strong>Automated Incident Response:</strong> Automates routine tasks like patch management to speed up response times.
          </li>
          <li>
            <strong>Advanced Security Analytics:</strong> Leverages analytics to reveal hidden threats and patterns, supporting proactive security.
          </li>
          <li>
            <strong>User Behavior Analytics:</strong> Identifies abnormal user behaviors, helping to mitigate insider threats.
          </li>
        </ul>
      </section>

      <section className="cybermentor-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>
            <strong>Improved Security Posture:</strong> Advanced AI enables faster threat detection and response.
          </li>
          <li>
            <strong>Reduced Incident Response Time:</strong> Streamlined workflows accelerate security operations.
          </li>
          <li>
            <strong>Increased Efficiency:</strong> Enables security teams to focus on strategic priorities, not routine tasks.
          </li>
          <li>
            <strong>Data-Driven Insights:</strong> In-depth analytics aid in making informed security decisions.
          </li>
        </ul>
      </section>

      <footer className="cybermentor-footer">
        <p>
          With CyberMentor, elevate your cybersecurity operations and safeguard your digital assets with confidence.
        </p>
      </footer>
    </div>
  );
}

export default CyberMentor;
