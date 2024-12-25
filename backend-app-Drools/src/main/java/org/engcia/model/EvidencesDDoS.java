package org.engcia.model;

public class EvidencesDDoS extends Evidences{

    private String alertId;

    private String trafficSpike;

    private String legitimateSource;

    private String abnormalPattern;

    private String mitigationEnabled;

    private String contactISP;

    public EvidencesDDoS() {
    }

    public EvidencesDDoS(String alertId, String trafficSpike, String legitimateSource, String abnormalPattern, String mitigationEnabled, String contactISP) {
        this.alertId = alertId;
        this.trafficSpike = trafficSpike;
        this.legitimateSource = legitimateSource;
        this.abnormalPattern = abnormalPattern;
        this.mitigationEnabled = mitigationEnabled;
        this.contactISP = contactISP;
    }

    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    public String getTrafficSpike() {
        return trafficSpike;
    }

    public void setTrafficSpike(String trafficSpike) {
        this.trafficSpike = trafficSpike;
    }

    public String getLegitimateSource() {
        return legitimateSource;
    }

    public void setLegitimateSource(String legitimateSource) {
        this.legitimateSource = legitimateSource;
    }

    public String getAbnormalPattern() {
        return abnormalPattern;
    }

    public void setAbnormalPattern(String abnormalPattern) {
        this.abnormalPattern = abnormalPattern;
    }

    public String getMitigationEnabled() {
        return mitigationEnabled;
    }

    public void setMitigationEnabled(String mitigationEnabled) {
        this.mitigationEnabled = mitigationEnabled;
    }

    public String getContactISP() {
        return contactISP;
    }

    public void setContactISP(String contactISP) {
        this.contactISP = contactISP;
    }
}
