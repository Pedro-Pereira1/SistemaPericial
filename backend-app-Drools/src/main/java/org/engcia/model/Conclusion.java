package org.engcia.model;

public class Conclusion {
    public static final String UNKNOWN = "Unknown";
    public static final String CLASSIFY_FP = "Classify as False Positive";
    public static final String DISABLE_ACCOUNT = "Disable account created";
    public static final String REVOKE_ACCESS = "Revoke creator's access";

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
