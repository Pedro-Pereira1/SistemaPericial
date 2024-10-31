package org.engcia.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.engcia.Utils.FuzzyHighRequests;
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
                EvidencesMLF inputMLF = mapper.convertValue(alertContext.get("input"), EvidencesMLF.class);
                System.out.println(inputMLF);
                response = alertService.runEngine(inputMLF);
                break;
            //Simultaneous logins activity
            case "SLA":
                EvidencesSLA input = mapper.convertValue(alertContext.get("input"), EvidencesSLA.class);
                response = alertService.runEngine(input);
                break;
            //Changes made to the firewall
            case "CMF":
                EvidencesCMF inputCMF = mapper.convertValue(alertContext.get("input"), EvidencesCMF.class);
                response = alertService.runEngine(inputCMF);
                break;
            //New user account
            case "NUA":
                EvidencesNUA inputNUA = mapper.convertValue(alertContext.get("input"), EvidencesNUA.class);
                response = alertService.runEngine(inputNUA);
                break;
            //User data has been changed
            case "UDC":
                EvidencesUDC inputUDC = mapper.convertValue(alertContext.get("input"), EvidencesUDC.class);
                response = alertService.runEngine(inputUDC);
                break;
            // Phishing: Test case
            case "Phishing":
                EvidencesPhishing inputPhishing = mapper.convertValue(alertContext.get("input"), EvidencesPhishing.class);
                response = alertService.runEngine(inputPhishing);
                break;
            // Port Scan
            case "PS":
                EvidencesPS inputps = mapper.convertValue(alertContext.get("input"), EvidencesPS.class);
                response = alertService.runEngine(inputps);
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

    @GetMapping("/get-conclusions")
    public ResponseEntity<List<String>> getConclusions() {
        return ResponseEntity.ok(alertService.getConclusions());
    }

    @PostMapping("/process-fuzzy")
    public ResponseEntity<String> processFuzzy(@RequestBody Map<String, Object> alertContext) {
        ObjectMapper mapper = new ObjectMapper();
        Number requestsPerMinute = (Number) alertContext.get("requestsPerMinute");
        String result = FuzzyHighRequests.evaluateHighRequests(requestsPerMinute.doubleValue());
        return ResponseEntity.ok(result);
    }

}