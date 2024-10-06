package org.engcia;


import org.engcia.model.AlertResponse;
import org.engcia.model.Evidences;
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
    private AlertService alertService;
    // POST endpoint to fetch the next question
    @PostMapping("/process-alert")
    public ResponseEntity<AlertResponse> processAlert(@RequestBody Map<String, Object> alertContext) {
        String expertSystem = (String) alertContext.get("expertSystem");
        String userResponse = (String) alertContext.get("userResponse");
        Integer step = (Integer) alertContext.get("questionState");

        // Get next step based on user input
        AlertResponse response = alertService.getNextStep(userResponse, step);
        return ResponseEntity.ok(response);
    }
}
