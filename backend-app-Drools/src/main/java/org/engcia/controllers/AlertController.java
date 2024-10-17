package org.engcia.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.engcia.AlertProcessor;
import org.engcia.model.AlertQuestion;
import org.engcia.model.AlertResponse;
import org.engcia.model.Evidences;
import org.engcia.model.EvidencesSAC;
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
        ObjectMapper mapper = new ObjectMapper();
        //System.out.println("Received data :) : " + alertContext);
        String alertId = (String) alertContext.get("alertId");


        AlertResponse response = null;

        switch (alertId){
            case "SAC":
                //response = alertService.runEngine(input);
                break;
            case "SLA":
                EvidencesSAC input = mapper.convertValue(alertContext.get("input"), EvidencesSAC.class);
                response = alertServiceSLA.runEngine(input);
                break;

        }

        // Get next step based on user input

        return ResponseEntity.ok(response);
    }
}
