package org.engcia;

import org.engcia.Utils.Question;
import org.engcia.model.AlertResponse;
import org.engcia.model.Conclusion;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class AlertService {

    public AlertResponse getNextStep(String userResponse, int step) {
        return handleExpertSystem1(userResponse, step);
    }

    private AlertResponse handleExpertSystem1(String userResponse, int step) {
        // Logic for the first expert system
        switch (step) {
            case 0:
                return new AlertResponse(
                        "question",
                        new Question("multiple-choice", "Is the creator known?", Arrays.asList("Yes", "No")),
                        null,
                        step + 1
                );

            case 1:
                if ("yes".equalsIgnoreCase(userResponse)) {
                    return new AlertResponse(
                            "question",
                            new Question("multiple-choice", "Has the creator responded?", Arrays.asList("Yes", "No")),
                            null,
                            step + 1
                    );
                } else {
                    return new AlertResponse(
                            "conclusion",
                            null,
                            new Conclusion(Conclusion.REVOKE_ACCESS),
                            step + 1
                    );
                }

            case 2:
                if ("yes".equalsIgnoreCase(userResponse)) {
                    return new AlertResponse(
                            "conclusion",
                            null,
                            new Conclusion(Conclusion.CLASSIFY_FP),
                            step + 1
                    );
                } else {
                    return new AlertResponse(
                            "conclusion",
                            null,
                            new Conclusion(Conclusion.DISABLE_ACCOUNT),
                            step + 1
                    );
                }

            default:
                return new AlertResponse(
                        "conclusion",
                        null,
                        new Conclusion(Conclusion.UNKNOWN),
                        step + 1
                );
        }
    }
}
