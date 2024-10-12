package org.engcia.controllers;


import org.engcia.AlertProcessor;
import org.engcia.model.AlertQuestion;
import org.engcia.model.AlertResponse;
import org.engcia.model.Evidences;
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

    @PostMapping("/process")
    public ResponseEntity<String> processAlert(@RequestBody Evidences evidences) {
        System.out.println("Received data :) : " + evidences);
        String conclusion = AlertProcessor.run(evidences);
        return new ResponseEntity<>(conclusion, HttpStatus.OK);
    }


    @Autowired
    private AlertServiceSAC alertService;
    @Autowired
    private AlertServiceSLA alertServiceSLA;

    // POST endpoint to fetch the next question
    @PostMapping("/process-alert")
    public ResponseEntity<AlertResponse> processAlert(@RequestBody Map<String, Object> alertContext) {
        String alertId = (String) alertContext.get("alertId");
        String expertSystem = (String) alertContext.get("expertSystem");
        String userResponse = (String) alertContext.get("userResponse");
        Integer step = (Integer) alertContext.get("questionState");
        AlertQuestion input = new AlertQuestion(alertId, expertSystem, null, null, step, userResponse);
        AlertResponse response = null;

        switch (alertId){
            case "SAC":
                response = alertService.runEngine(input);
                break;
            case "SLA":
                response = alertServiceSLA.runEngine(input);
                break;

        }

        // Get next step based on user input

        return ResponseEntity.ok(response);
    }
}
