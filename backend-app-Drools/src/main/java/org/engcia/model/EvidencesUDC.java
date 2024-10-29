package org.engcia.model;

public class EvidencesUDC extends Evidences {
    private String alertId; // Indica se a recuperação é necessária
    private String userKnown; // ID do alerta
    private String legitimateAction; // Indica se a conta foi alterada
    private String ipCollected; // Indica se a contenção é necessária
    private String helpdeskVerified; // Indica se a investigação é necessária
    private String reversalPossible; // Indica se a erradicação é necessária

    public EvidencesUDC() {
    }

    public EvidencesUDC(String alertId, String userKnown, String legitimateAction, String ipCollected, String helpdeskVerified, String reversalPossible) {
        this.alertId = alertId;
        this.userKnown = userKnown;
        this.legitimateAction = legitimateAction;
        this.ipCollected = ipCollected;
        this.helpdeskVerified = helpdeskVerified;
        this.reversalPossible = reversalPossible;
    }

    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    public String getUserKnown() {
        return userKnown;
    }

    public void setUserKnown(String userKnown) {
        this.userKnown = userKnown;
    }

    public String getLegitimateAction() {
        return legitimateAction;
    }

    public void setLegitimateAction(String legitimateAction) {
        this.legitimateAction = legitimateAction;
    }



    public String getIpCollected() {
        return ipCollected;
    }

    public void setIpCollected(String ipCollected) {
        this.ipCollected = ipCollected;
    }

    public String getHelpdeskVerified() {
        return helpdeskVerified;
    }

    public void setHelpdeskVerified(String helpdeskVerified) {
        this.helpdeskVerified = helpdeskVerified;
    }

    public String getReversalPossible() {
        return reversalPossible;
    }

    public void setReversalPossible(String reversalPossible) {
        this.reversalPossible = reversalPossible;
    }
}
