package org.engcia.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.engcia.Utils.FuzzyHighRequests;
import org.engcia.model.*;
import org.engcia.services.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.ArrayList;
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

    @PostMapping("/process-alert-how")
    public ResponseEntity<List<String>> processAlertHow(@RequestBody Map<String, Object> alertContext) {
        List<String> how = alertService.how();
        return ResponseEntity.ok(how);
    }
    @PostMapping("/process-alert-why")
    public ResponseEntity<List<String>> processAlertWhy(@RequestBody Map<String, Object> alertContext) throws NoSuchFieldException, IllegalAccessException {
        ObjectMapper mapper = new ObjectMapper();
        String alertId = (String) alertContext.get("alert");
        Map<String, Object> alertContextMap = (Map<String, Object>) alertContext.get("alertContext");
        String fieldName = (String) alertContextMap.get("parameterNumber");
        Map<String, Object> questionMap = (Map<String, Object>) alertContextMap.get("question");
        List<String> possibleAnswers = (List<String>) questionMap.get("possibleAnswers");

        AlertResponse response = null;
        switch (alertId){
            //Multiple login failures for a single account
            case "MLF":
                EvidencesMLF inputMLF = mapper.convertValue(alertContext.get("evidences"), EvidencesMLF.class);
                for (String answer : possibleAnswers){
                    Class<?> clazz = inputMLF.getClass();
                    Field field = clazz.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    field.set(inputMLF, answer.toLowerCase());
                    response = alertService.runEngine(inputMLF);
                }
                break;
            //Simultaneous logins activity
            case "SLA":
                EvidencesSLA input = mapper.convertValue(alertContext.get("evidences"), EvidencesSLA.class);
                for (String answer : possibleAnswers){
                    Class<?> clazz = input.getClass();
                    Field field = clazz.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    field.set(input, answer.toLowerCase());
                    response = alertService.runEngine(input);
                }
                break;
            //Changes made to the firewall
            case "CMF":
                EvidencesCMF inputCMF = mapper.convertValue(alertContext.get("evidences"), EvidencesCMF.class);
                for (String answer : possibleAnswers){
                    Class<?> clazz = inputCMF.getClass();
                    Field field = clazz.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    field.set(inputCMF, answer.toLowerCase());
                    response = alertService.runEngine(inputCMF);
                }
                break;
            //New user account
            case "NUA":
                EvidencesNUA inputNUA = mapper.convertValue(alertContext.get("evidences"), EvidencesNUA.class);
                for (String answer : possibleAnswers){
                    Class<?> clazz = inputNUA.getClass();
                    Field field = clazz.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    field.set(inputNUA, answer.toLowerCase());
                    response = alertService.runEngine(inputNUA);
                }
                break;
            //User data has been changed
            case "UDC":
                EvidencesUDC inputUDC = mapper.convertValue(alertContext.get("evidences"), EvidencesUDC.class);
                for (String answer : possibleAnswers){
                    Class<?> clazz = inputUDC.getClass();
                    Field field = clazz.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    field.set(inputUDC, answer.toLowerCase());
                    response = alertService.runEngine(inputUDC);
                }
                break;
            // Phishing: Test case
            case "Phishing":
                break;
            // Port Scan
            case "PS":
                EvidencesPS inputps = mapper.convertValue(alertContext.get("evidences"), EvidencesPS.class);
                for (String answer : possibleAnswers){
                    Class<?> clazz = inputps.getClass();
                    Field field = clazz.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    field.set(inputps, answer.toLowerCase());
                    response = alertService.runEngine(inputps);
                }
                break;
        }

        List<String> why = alertService.why(possibleAnswers);
        return ResponseEntity.ok(why);
    }

    @PostMapping("/clear")
    public void clear() {
        alertService.clear();
    }

    @PostMapping("/process-fuzzy")
    public ResponseEntity<String> processFuzzy(@RequestBody Map<String, Object> alertContext) {
        ObjectMapper mapper = new ObjectMapper();
        Number requestsPerMinute = (Number) alertContext.get("requestsPerMinute");
        String result = FuzzyHighRequests.evaluateHighRequests(requestsPerMinute.doubleValue());
        return ResponseEntity.ok(result);
    }
}