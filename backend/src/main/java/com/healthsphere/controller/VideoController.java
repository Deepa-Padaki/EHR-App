package com.healthsphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/video")
@PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
public class VideoController {

    @PostMapping("/generate-room")
    public ResponseEntity<Map<String, String>> generateRoom() {
        String roomId = UUID.randomUUID().toString();
        Map<String, String> response = new HashMap<>();
        response.put("roomId", roomId);
        response.put("roomUrl", "/video/" + roomId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<Map<String, String>> getRoom(@PathVariable String roomId) {
        Map<String, String> response = new HashMap<>();
        response.put("roomId", roomId);
        response.put("status", "active");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/end-room/{roomId}")
    public ResponseEntity<Map<String, String>> endRoom(@PathVariable String roomId) {
        Map<String, String> response = new HashMap<>();
        response.put("roomId", roomId);
        response.put("status", "ended");
        return ResponseEntity.ok(response);
    }
}
