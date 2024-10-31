package org.engcia.Utils;

import net.sourceforge.jFuzzyLogic.FIS;

public class FuzzyHighRequests {

    public static String evaluateHighRequests(double requestsPerMinute) {
        // Load the FCL file
        String fileName = "src/main/java/org/engcia/fcl/highRequests.fcl";
        FIS fis = FIS.load(fileName, true);

        if (fis == null) {
            System.err.println("Can't load file: " + fileName);
            return "unknown";
        }

        // Set inputs
        fis.setVariable("numberOfRequestsPerMinute", requestsPerMinute);

        // Evaluate
        fis.evaluate();

        // Get the output
        double result = fis.getVariable("highRequests").getValue();

        System.out.println("Result: " + result);
        // Determine if highRequests is high or low based on the output value
        return (result > 0.5) ? "yes" : "no";
    }
}

