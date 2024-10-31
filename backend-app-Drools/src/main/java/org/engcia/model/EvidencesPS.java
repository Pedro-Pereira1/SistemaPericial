package org.engcia.model;

public class EvidencesPS extends Evidences {
    private String alertId;
    private String highRequests;
    private String maliciousIP;
    private String permitedRequest;
    private String nationalIP;
    private String geoPolicy;

    public EvidencesPS() {
    }

    public EvidencesPS(String alertId, String highRequests, String maliciousIP, String permitedRequest, String nationalIP, String geoPolicy) {
        this.alertId = alertId;
        this.highRequests = highRequests;
        this.maliciousIP = maliciousIP;
        this.permitedRequest = permitedRequest;
        this.nationalIP = nationalIP;
        this.geoPolicy = geoPolicy;
    }

    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    public String getHighRequests() {
        return highRequests;
    }

    public void setHighRequests(String highRequests) {
        this.highRequests = highRequests;
    }

    public String getMaliciousIP() {
        return maliciousIP;
    }

    public void setMaliciousIP(String maliciousIP) {
        this.maliciousIP = maliciousIP;
    }

    public String getPermitedRequest() {
        return permitedRequest;
    }

    public void setPermitedRequest(String permitedRequest) {
        this.permitedRequest = permitedRequest;
    }

    public String getNationalIP() {
        return nationalIP;
    }

    public void setNationalIP(String nationalIP) {
        this.nationalIP = nationalIP;
    }

    public String getGeoPolicy() {
        return geoPolicy;
    }

    public void setGeoPolicy(String geoPolicy) {
        this.geoPolicy = geoPolicy;
    }
}
