package org.engcia.model;

public class EvidencesNUA extends Evidences{
    private String alertId;              // The alert ID for phishing
    private String permittedUser;
    private String userContacted;
    private String accordingPolicy;
    private String userResponse;
    private String userProblemResolved;

    public EvidencesNUA() {
    }

    public EvidencesNUA(String alertId, String permittedUser, String userContacted, String accordingPolicy, String userResponse, String userProblemResolved) {
        this.alertId = alertId;
        this.permittedUser = permittedUser;
        this.userContacted = userContacted;
        this.accordingPolicy = accordingPolicy;
        this.userResponse = userResponse;
        this.userProblemResolved = userProblemResolved;
    }

    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    public String getPermittedUser() {
        return permittedUser;
    }

    public void setPermittedUser(String permittedUser) {
        this.permittedUser = permittedUser;
    }

    public String getUserContacted() {
        return userContacted;
    }

    public void setUserContacted(String userContacted) {
        this.userContacted = userContacted;
    }

    public String getAccordingPolicy() {
        return accordingPolicy;
    }

    public void setAccordingPolicy(String accordingPolicy) {
        this.accordingPolicy = accordingPolicy;
    }

    public String getUserResponse() {
        return userResponse;
    }

    public void setUserResponse(String userResponse) {
        this.userResponse = userResponse;
    }

    public String getUserProblemResolved() {
        return userProblemResolved;
    }

    public void setUserProblemResolved(String userProblemResolved) {
        this.userProblemResolved = userProblemResolved;
    }

    @Override
    public String toString() {
        return "EvidencesNUA{" +
                "alertId='" + alertId + '\'' +
                ", permittedUser='" + permittedUser + '\'' +
                ", userContacted='" + userContacted + '\'' +
                ", accordingPolicy='" + accordingPolicy + '\'' +
                ", userResponse='" + userResponse + '\'' +
                ", userProblemResolved='" + userProblemResolved + '\'' +
                '}';
    }
}


