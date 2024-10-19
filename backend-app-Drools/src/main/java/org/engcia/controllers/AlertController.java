package org.engcia.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.engcia.AlertProcessor;
import org.engcia.model.*;
import org.engcia.services.AlertServicePhishing;
import org.engcia.services.AlertServiceSAC;
import org.engcia.services.AlertServiceSLA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertServiceSAC alertServiceSAC;
    @Autowired
    private AlertServiceSLA alertServiceSLA;
    @Autowired
    private AlertServicePhishing alertServicePhishing;

    // POST endpoint to fetch the next question
    @PostMapping("/process-alert")
    public ResponseEntity<AlertResponse> processAlert(@RequestBody Map<String, Object> alertContext) {
        ObjectMapper mapper = new ObjectMapper();
        //System.out.println("Received data :) : " + alertContext);
        String alertId = (String) alertContext.get("alertId");

        AlertResponse response = null;

        switch (alertId){
            case "SAC":

                break;
            case "SLA":
                EvidencesSLA input = mapper.convertValue(alertContext.get("input"), EvidencesSLA.class);
                response = alertServiceSLA.runEngine(input);
                break;
            case "Phishing":
                EvidencesPhishing inputPhishing = mapper.convertValue(alertContext.get("input"), EvidencesPhishing.class);
                response = alertServicePhishing.runEngine(inputPhishing);
                break;

        }

        // Get next step based on user input

        return ResponseEntity.ok(response);
    }

    @PostMapping("/process-alert-why")
    public ResponseEntity<String> processAlertWhy(@RequestBody Map<String, Object> alertContext) {
        System.out.println("process-alert-why");
        String alertId = (String) alertContext.get("alertId");
        String why = null;

        switch (alertId){
            case "SAC":
                //response = alertService.runEngine(input);
                break;
            case "SLA":
                why = alertServiceSLA.why();
                break;
            case "Phishing":
                why = alertServicePhishing.why();
                break;
        }

        // Get next step based on user input

        return ResponseEntity.ok(why);
    }
}