package org.engcia.model;

public class Conclusion {
    public static final String UNKNOWN = "Unknown";
    public static final String CLASSIFY_FP = "Classify as False Positive";
    public static final String RESET_PASSWORD_REVOKE_TOKENS = "Reset password and revoke tokens\n Inform user and educated on preventing future incidents";
    public static final String REVERSE_TRANSACTION = "Classify as False Positive\n Reverse account suspension";
    public static final String NOTIFY_SUPPORT_TEAM = "Notify support team";


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
