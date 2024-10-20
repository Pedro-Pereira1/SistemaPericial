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
            //Multiple login failures for a single account
            case "MLF":
                //EvidencesMLF input = mapper.convertValue(alertContext.get("input"), EvidencesMLF.class);
                //response = alertService.runEngine(input);
                break;
            //Simultaneous logins activity
            case "SLA":
                EvidencesSLA input = mapper.convertValue(alertContext.get("input"), EvidencesSLA.class);
                response = alertService.runEngine(input);
                break;
            //Changes made to the firewall
            case "CMF":
                //EvidencesCMF input = mapper.convertValue(alertContext.get("input"), EvidencesCMF.class);
                //response = alertService.runEngine(input);
                break;
            //New user account
            case "NUA":
                //EvidencesNUA input = mapper.convertValue(alertContext.get("input"), EvidencesNUA.class);
                //response = alertService.runEngine(input);
                break;
            //User data has been changed
            case "UDC":
                //EvidencesUDC input = mapper.convertValue(alertContext.get("input"), EvidencesUDC.class);
                //response = alertService.runEngine(input);
                break;
            // Phishing: Test case
            case "Phishing":
                EvidencesPhishing inputPhishing = mapper.convertValue(alertContext.get("input"), EvidencesPhishing.class);
                response = alertService.runEngine(inputPhishing);
                break;
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/process-alert-why")
    public ResponseEntity<List<String>> processAlertWhy(@RequestBody Map<String, Object> alertContext) {
        List<String> how = alertService.how();
        return ResponseEntity.ok(how);
    }

    @PostMapping("/clear")
    public void clear() {
        alertService.clear();
    }


}