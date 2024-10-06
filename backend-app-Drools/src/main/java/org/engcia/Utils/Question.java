package org.engcia.Utils;

import java.util.List;

public class Question {
    private String type; // "multiple-choice" or "text"
    private String text;
    private List<String> possibleAnswers;

    public Question(String type, String text, List<String> possibleAnswers) {
        this.type = type;
        this.text = text;
        this.possibleAnswers = possibleAnswers;
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getPossibleAnswers() {
        return possibleAnswers;
    }

    public void setPossibleAnswers(List<String> possibleAnswers) {
        this.possibleAnswers = possibleAnswers;
    }
}

