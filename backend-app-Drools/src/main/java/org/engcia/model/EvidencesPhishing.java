package org.engcia.model;

public class EvidencesPhishing extends Evidences{
    private String alertId;              // The alert ID for phishing
    private String emailQuarantined;     // Indicates if the email is quarantined
    private String suspiciousContent;    // Indicates if the email contains suspicious content (malicious links, attachments, etc.)
    private String emailLegit;           // Indicates if the email is legitimate
    private String userClicked;          // Indicates if a user interacted with the email (clicked link, opened attachment, etc.)
    private String responseRequired;     // Indicates if response actions (reset password, revoke tokens) are required

    public EvidencesPhishing() {
    }

    public EvidencesPhishing(String alertId, String emailQuarantined, String suspiciousContent, String emailLegit, String userClicked, String responseRequired) {
        this.alertId = alertId;
        this.emailQuarantined = emailQuarantined;
        this.suspiciousContent = suspiciousContent;
        this.emailLegit = emailLegit;
        this.userClicked = userClicked;
        this.responseRequired = responseRequired;
    }

    // Getter and setter methods
    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    public String getEmailQuarantined() {
        return emailQuarantined;
    }

    public void setEmailQuarantined(String emailQuarantined) {
        this.emailQuarantined = emailQuarantined;
    }

    public String getSuspiciousContent() {
        return suspiciousContent;
    }

    public void setSuspiciousContent(String suspiciousContent) {
        this.suspiciousContent = suspiciousContent;
    }

    public String getEmailLegit() {
        return emailLegit;
    }

    public void setEmailLegit(String emailLegit) {
        this.emailLegit = emailLegit;
    }

    public String getUserClicked() {
        return userClicked;
    }

    public void setUserClicked(String userClicked) {
        this.userClicked = userClicked;
    }

    public String getResponseRequired() {
        return responseRequired;
    }

    public void setResponseRequired(String responseRequired) {
        this.responseRequired = responseRequired;
    }

    @Override
    public String toString() {
        return "PhishingAlert{" +
                "alertId='" + alertId + '\'' +
                ", emailQuarantined='" + emailQuarantined + '\'' +
                ", suspiciousContent='" + suspiciousContent + '\'' +
                ", emailLegit='" + emailLegit + '\'' +
                ", userClicked='" + userClicked + '\'' +
                ", responseRequired='" + responseRequired + '\'' +
                '}';
    }
}
