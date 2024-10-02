package org.engcia;

import org.engcia.AlertProcessor;
import org.engcia.model.Evidences;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
