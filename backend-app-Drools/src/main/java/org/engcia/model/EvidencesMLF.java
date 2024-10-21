package org.engcia.model;

public class EvidencesMLF extends Evidences {
    private String alertId;
    private String user_known_1;
    private String was_the_user_1;
    private String are_there_multiple_ips;
    private String does_the_number_of_ips_make_sense;
    private String is_the_reccurence_just;
    private String user_known_2;
    private String was_the_user_2;
    private String origins_just;
    private String national_ip;

    public EvidencesMLF() {
    }

    public EvidencesMLF(String alert_id, String user_known_1, String was_the_user_1,
                        String are_there_multiple_ips, String does_the_number_of_ips_make_sense,
                        String is_the_reccurence_just, String user_known_2,
                        String was_the_user_2, String origins_just, String national_ip) {
        this.alertId = alert_id;
        this.user_known_1 = user_known_1;
        this.was_the_user_1 = was_the_user_1;
        this.are_there_multiple_ips = are_there_multiple_ips;
        this.does_the_number_of_ips_make_sense = does_the_number_of_ips_make_sense;
        this.is_the_reccurence_just = is_the_reccurence_just;
        this.user_known_2 = user_known_2;
        this.was_the_user_2 = was_the_user_2;
        this.origins_just = origins_just;
        this.national_ip = national_ip;
    }

    // Getters e Setters para todas as propriedades
    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alert_id) {
        this.alertId = alert_id;
    }

    public String getUser_known_1() {
        return user_known_1;
    }

    public void setUser_known_1(String user_known_1) {
        this.user_known_1 = user_known_1;
    }

    public String getWas_the_user_1() {
        return was_the_user_1;
    }

    public void setWas_the_user_1(String was_the_user_1) {
        this.was_the_user_1 = was_the_user_1;
    }

    public String getAre_there_multiple_ips() {
        return are_there_multiple_ips;
    }

    public void setAre_there_multiple_ips(String are_there_multiple_ips) {
        this.are_there_multiple_ips = are_there_multiple_ips;
    }

    public String getDoes_the_number_of_ips_make_sense() {
        return does_the_number_of_ips_make_sense;
    }

    public void setDoes_the_number_of_ips_make_sense(String does_the_number_of_ips_make_sense) {
        this.does_the_number_of_ips_make_sense = does_the_number_of_ips_make_sense;
    }

    public String getIs_the_reccurence_just() {
        return is_the_reccurence_just;
    }

    public void setIs_the_reccurence_just(String is_the_reccurence_just) {
        this.is_the_reccurence_just = is_the_reccurence_just;
    }

    public String getUser_known_2() {
        return user_known_2;
    }

    public void setUser_known_2(String user_known_2) {
        this.user_known_2 = user_known_2;
    }

    public String getWas_the_user_2() {
        return was_the_user_2;
    }

    public void setWas_the_user_2(String was_the_user_2) {
        this.was_the_user_2 = was_the_user_2;
    }

    public String getOrigins_just() {
        return origins_just;
    }

    public void setOrigins_just(String origins_just) {
        this.origins_just = origins_just;
    }

    public String getNational_ip() {
        return national_ip;
    }

    public void setNational_ip(String national_ip) {
        this.national_ip = national_ip;
    }

    @Override
    public String toString() {
        return "EvidencesMLF{" +
                "alert_id='" + alertId + '\'' +
                ", user_known_1='" + user_known_1 + '\'' +
                ", was_the_user_1='" + was_the_user_1 + '\'' +
                ", are_there_multiple_ips='" + are_there_multiple_ips + '\'' +
                ", does_the_number_of_ips_make_sense='" + does_the_number_of_ips_make_sense + '\'' +
                ", is_the_reccurence_just='" + is_the_reccurence_just + '\'' +
                ", user_known_2='" + user_known_2 + '\'' +
                ", was_the_user_2='" + was_the_user_2 + '\'' +
                ", origins_just='" + origins_just + '\'' +
                ", national_ip='" + national_ip + '\'' +
                '}';
    }
}
