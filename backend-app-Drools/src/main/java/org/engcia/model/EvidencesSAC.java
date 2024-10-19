package org.engcia.model;

public class EvidencesSAC extends Evidences{
    private String alertId;            // The alert ID


    public EvidencesSAC() {
    }

    public EvidencesSAC(String alertId) {
        this.alertId = alertId;
    }

    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    @Override
    public String toString() {
        return "EvidencesSAC{" +
                "alertId='" + alertId + '\'' +
                '}';
    }
}
