package org.engcia.model;
//Change made to the firewall
public class EvidencesCMF extends Evidences{
    private String alertId;
    private String changesFirewall;
    private String suspActivity;
    private String activityType;
    private String vulnerabExploited;


    public EvidencesCMF(){

    }

    public EvidencesCMF(String alertId,String changesFirewall, String suspActivity, String activityType, String vulnerabExploited) {
        this.alertId = alertId;
        this.changesFirewall = changesFirewall;
        this.suspActivity = suspActivity;
        this.activityType = activityType;
        this.vulnerabExploited = vulnerabExploited;
    }
    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alert_id) {
        this.alertId = alert_id;
    }

    public String getChangesFirewall() {
        return changesFirewall;
    }

    public void setChangesFirewall(String changesFirewall) {
        this.changesFirewall = changesFirewall;
    }

    public String getSuspActivity() {
        return suspActivity;
    }

    public void setSuspActivity(String suspActivity) {
        this.suspActivity = suspActivity;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getVulnerabExploited() {
        return vulnerabExploited;
    }

    public void setVulnerabExploited(String vulnerabExploited) {
        this.vulnerabExploited = vulnerabExploited;
    }

    @Override
    public String toString() {
        return "EvidencesCMF{" +
                "changesFirewall='" + changesFirewall + '\'' +
                ", suspActivity='" + suspActivity + '\'' +
                ", activityType='" + activityType + '\'' +
                ", vulnerabExploited='" + vulnerabExploited + '\'' +
                '}';
    }
}
