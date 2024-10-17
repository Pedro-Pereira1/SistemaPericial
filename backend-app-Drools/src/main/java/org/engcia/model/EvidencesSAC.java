package org.engcia.model;

public class EvidencesSAC {
    private String alertId;            // The alert ID
    private String multipleLocations;  // Indicates if there are multiple login locations
    private String legitimateBehavior; // Indicates if the login can be explained by legitimate behavior (VPN, travel, etc.)
    private String abnormalPattern;    // Indicates if another abnormal pattern exists
    private String mfaEnabled;         // Indicates if the user has MFA activated
    private String userContacted;      // Indicates if the user has been contacted to validate the login

    public EvidencesSAC() {
    }

    public EvidencesSAC(String alertId, String multipleLocations, String legitimateBehavior, String abnormalPattern, String mfaEnabled, String userContacted) {
        this.alertId = alertId;
        this.multipleLocations = multipleLocations;
        this.legitimateBehavior = legitimateBehavior;
        this.abnormalPattern = abnormalPattern;
        this.mfaEnabled = mfaEnabled;
        this.userContacted = userContacted;
    }

    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    public String getMultipleLocations() {
        return multipleLocations;
    }

    public void setMultipleLocations(String multipleLocations) {
        this.multipleLocations = multipleLocations;
    }

    public String getLegitimateBehavior() {
        return legitimateBehavior;
    }

    public void setLegitimateBehavior(String legitimateBehavior) {
        this.legitimateBehavior = legitimateBehavior;
    }

    public String getAbnormalPattern() {
        return abnormalPattern;
    }

    public void setAbnormalPattern(String abnormalPattern) {
        this.abnormalPattern = abnormalPattern;
    }

    public String getMfaEnabled() {
        return mfaEnabled;
    }

    public void setMfaEnabled(String mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public String getUserContacted() {
        return userContacted;
    }

    public void setUserContacted(String userContacted) {
        this.userContacted = userContacted;
    }

    @Override
    public String toString() {
        return "EvidencesSAC{" +
                "alertId='" + alertId + '\'' +
                ", multipleLocations='" + multipleLocations + '\'' +
                ", legitimateBehavior='" + legitimateBehavior + '\'' +
                ", abnormalPattern='" + abnormalPattern + '\'' +
                ", mfaEnabled='" + mfaEnabled + '\'' +
                ", userContacted='" + userContacted + '\'' +
                '}';
    }
}
