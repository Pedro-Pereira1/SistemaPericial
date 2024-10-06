package org.engcia.model;

import org.engcia.Utils.Question;

public class AlertResponse {
    private String currentStep; // "question" or "conclusion"
    private Question question;
    private Conclusion conclusion;
    private int step; // To keep track of the question step in the flow

    public AlertResponse(String currentStep, Question question, Conclusion conclusion, int step) {
        this.currentStep = currentStep;
        this.question = question;
        this.conclusion = conclusion;
        this.step = step;
    }

    // Getters and Setters
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
}
