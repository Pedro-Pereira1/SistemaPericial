package org.engcia.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.engcia.model.*;
import org.engcia.services.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    @Autowired
    private AlertService alertService;

    // POST endpoint to fetch the next question
    @PostMapping("/process-alert")
    public ResponseEntity<AlertResponse> processAlert(@RequestBody Map<String, Object> alertContext) {
        ObjectMapper mapper = new ObjectMapper();
        String alertId = (String) alertContext.get("alertId");

        AlertResponse response = null;

        switch (alertId){
            case "SAC":

                break;
            case "SLA":
                EvidencesSLA input = mapper.convertValue(alertContext.get("input"), EvidencesSLA.class);
                response = alertService.runEngine(input);
                break;
            case "Phishing":
                EvidencesPhishing inputPhishing = mapper.convertValue(alertContext.get("input"), EvidencesPhishing.class);
                response = alertService.runEngine(inputPhishing);
                break;

        }

        // Get next step based on user input

        return ResponseEntity.ok(response);
    }

    @PostMapping("/process-alert-why")
    public ResponseEntity<List<String>> processAlertWhy(@RequestBody Map<String, Object> alertContext) {
        String alertId = (String) alertContext.get("alertId");
        List<String> how = null;

        switch (alertId){
            case "SAC":
                //response = alertService.runEngine(input);
                break;
            case "SLA":
                how = alertService.how();
                break;
            case "Phishing":
                how = alertService.how();
                break;
        }

        // Get next step based on user input

        return ResponseEntity.ok(how);
    }

    @PostMapping("/clear")
    public void clear() {
        alertService.clear();
    }


}