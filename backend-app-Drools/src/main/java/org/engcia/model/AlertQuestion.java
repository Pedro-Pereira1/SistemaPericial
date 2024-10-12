package org.engcia.model;

import org.engcia.Utils.Question;

import java.util.Objects;

public class AlertQuestion {
    private String alertId;
    private String currentStep; // "question" or "conclusion"
    private Question question;
    private Conclusion conclusion;
    private int step; // To keep track of the question step in the flow
    private String userResponse;

    public AlertQuestion(String alertId, String currentStep, Question question, Conclusion conclusion, int step, String userResponse) {
        this.alertId = alertId;
        this.currentStep = currentStep;
        this.question = question;
        this.conclusion = conclusion;
        this.step = step;
        this.userResponse = userResponse;
    }




    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
    }

    public String getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(String currentStep) {
        this.currentStep = currentStep;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Conclusion getConclusion() {
        return conclusion;
    }

    public void setConclusion(Conclusion conclusion) {
        this.conclusion = conclusion;
    }

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public String getUserResponse() {
        return userResponse;
    }

    public void setUserResponse(String userResponse) {
        this.userResponse = userResponse;
    }

    @Override
    public String toString() {
        return "AlertResponse{" +
                "alertId='" + alertId + '\'' +
                ", currentStep='" + currentStep + '\'' +
                ", question=" + question +
                ", conclusion=" + conclusion +
                ", step=" + step +
                ", userResponse='" + userResponse + '\'' +
                '}';
    }

}
