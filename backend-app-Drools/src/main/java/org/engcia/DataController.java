package org.engcia;


import org.engcia.model.Evidences;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/evidences") // Update base path for clarity
public class DataController {

    @PostMapping("/submit") // Maps to /api/evidences/submit
    public ResponseEntity<String> submitEvidences(@RequestBody Evidences data) {
        // Process the received JSON data
        System.out.println("Received data: " + data);
        String conclusion = Haemorrhage.run(data);

        return new ResponseEntity<>(conclusion, HttpStatus.OK);
    }
}

