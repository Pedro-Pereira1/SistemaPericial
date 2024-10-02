package org.engcia.model;

public class Evidences {
    // Additional fields
    private boolean creatorKnown;  // Indicates if the creator is known
    private boolean creatorResponded;  // Indicates if the creator responded

    public Evidences() {
    }

    public Evidences(boolean creatorKnown, boolean creatorResponded) {
        this.creatorKnown = creatorKnown;
        this.creatorResponded = creatorResponded;
    }

    public boolean isCreatorKnown() {
        return creatorKnown;
    }

    public void setCreatorKnown(boolean creatorKnown) {
        this.creatorKnown = creatorKnown;
    }

    public boolean isCreatorResponded() {
        return creatorResponded;
    }

    public void setCreatorResponded(boolean creatorResponded) {
        this.creatorResponded = creatorResponded;
    }

}
