package org.engcia.model;

public class Conclusion {
    public static final String UNKNOWN = "Look for the the doctor!";

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
