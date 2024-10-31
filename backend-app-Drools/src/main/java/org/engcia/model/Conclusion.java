package org.engcia.model;

public class Conclusion {
    public static final String UNKNOWN = "Unknown";
    public static final String CLASSIFY_FP = "Classify the alert as a False Positive and mark it as resolved.";
    public static final String RESET_PASSWORD_REVOKE_TOKENS = "Reset the user's password, revoke access tokens, and educate the user on preventing future incidents.";
    public static final String REVERSE_TRANSACTION = "Classify the alert as a False Positive and reverse any account suspension or access restriction.";
    public static final String NOTIFY_SUPPORT_TEAM = "Escalate the alert to the support team for further investigation and remediation.";
    public static final String BLOCK_SENDER_MONITOR = "Block the sender's email address and monitor for any further suspicious activity.";
    public static final String EDUCATE_USER = "Inform the user about phishing threats and provide guidelines to avoid similar attacks in the future.";
    public static final String RESOLVE_ALERT = "Mark the alert as resolved and take the necessary steps to ensure no further actions are required.";
    public static final String ALTERATION_NOT_DETECTED = "Altering actions have not been detected";
    public static final String LEGIT_ALTERATION = "Legitimate action";
    public static final String PREVENTIVE_MEASURES ="Implement preventive measures, such as regularly auditing and monitoring firewall actions";
    public static final String MITIGATE_VULNERABILITY = "Mitigate the vulnerability exploited by the suspicious activity\n";
    public static final String REVERT_SETTINGS = "Revert the changes made to the firewall.\n";
    public static final String APPLY_RECOMMENDATIONS = "Apply security recommendations.\n";
    public static final String CONTACT_SUPPORT = "Contact support team for further investigation.\n";
    public static final String VERIFY_POLICIES = "Verify and adjust account creation policies to prevent recurrence.\n";
    public static final String ELIMINATE_ACCOUNT = "Eliminate the account and all associated data. Verify and modify account creation policies.\n";

    public static final String BLOCK_ACCOUNT="Block the account definitely.";
    public static final String BLOCK_TEMP="Temporarily lock the account\nReset the password\nReview controls and permissions\nImplement stronger authentication mechanisms.";
    public static final String BLOCK_IP="Open Case\nBlock the IP.";

    public static final String MALICIOUS_IP = "The IP address is malicious. Contain the IP address and investigate further.";

    public static final String DOS_ATTACK = "The high number of requests indicates a possible Denial of Service (DoS) attack. Block the IP address and investigate further.";
    public static final String CREATE_GEO_POLICY = "Create a geo-blocking policy to block traffic from the identified country.";




    private String description;

    public Conclusion(String description) {
        super();
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String toString() {
        return "Diagnosis: " + description;
    }
}
