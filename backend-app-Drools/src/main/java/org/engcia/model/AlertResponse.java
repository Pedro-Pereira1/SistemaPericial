package org.engcia.model;

import org.engcia.Utils.Question;

public class AlertResponse {
    private String currentStep; // "question" or "conclusion"
    private Question question;
    private Conclusion conclusion;
    private Evidences evidences;
    private String parameterNumber;
    private String relevance;

    public AlertResponse(String currentStep, Question question, Conclusion conclusion, Evidences evidences, String parameterNumber, String relevance) {
        this.currentStep = currentStep;
        this.question = question;
        this.conclusion = conclusion;
        this.evidences = evidences;
        this.parameterNumber = parameterNumber;
        this.relevance = relevance;
    }

    public AlertResponse() {
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

    public Evidences getEvidences() {
        return evidences;
    }

    public void setEvidences(Evidences evidences) {
        evidences = evidences;
    }

    public String getParameterNumber() {
        return parameterNumber;
    }

    public void setParameterNumber(String parameterNumber) {
        this.parameterNumber = parameterNumber;
    }

    public String getRelevance() {
        return relevance;
    }

    public void setRelevance(String relevance) {
        this.relevance = relevance;
    }

    @Override
    public String toString() {
        return "AlertResponse{" +
                "currentStep='" + currentStep + '\'' +
                ", question=" + question +
                ", conclusion=" + conclusion +
                ", EvidencesSAC=" + evidences +
                ", parameterNumber=" + parameterNumber +
                ", relevance='" + relevance +
                '}';
    }
}
