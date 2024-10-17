package org.engcia.model;

import org.engcia.Utils.Question;

import java.util.LinkedList;
import java.util.Objects;

public class AlertResponse {
    private String currentStep; // "question" or "conclusion"
    private Question question;
    private Conclusion conclusion;
    private EvidencesSAC EvidencesSAC;
    private String parameterNumber;


    public AlertResponse() {
    }

    public AlertResponse(String currentStep, Question question, Conclusion conclusion, EvidencesSAC evidencesSAC, String parameterNumber) {
        this.currentStep = currentStep;
        this.question = question;
        this.conclusion = conclusion;
        this.EvidencesSAC = evidencesSAC;
        this.parameterNumber = parameterNumber;
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

    public org.engcia.model.EvidencesSAC getEvidencesSAC() {
        return EvidencesSAC;
    }

    public void setEvidencesSAC(org.engcia.model.EvidencesSAC evidencesSAC) {
        EvidencesSAC = evidencesSAC;
    }

    public String getParameterNumber() {
        return parameterNumber;
    }

    public void setParameterNumber(String parameterNumber) {
        this.parameterNumber = parameterNumber;
    }

    @Override
    public String toString() {
        return "AlertResponse{" +
                "currentStep='" + currentStep + '\'' +
                ", question=" + question +
                ", conclusion=" + conclusion +
                ", EvidencesSAC=" + EvidencesSAC +
                ", parameterNumber=" + parameterNumber +
                '}';
    }
}
