package com.healthsphere.controller;

import com.healthsphere.entity.MedicalRecord;
import com.healthsphere.entity.Patient;
import com.healthsphere.service.MedicalRecordService;
import com.healthsphere.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    public ResponseEntity<List<MedicalRecord>> getAllRecords() {
        return ResponseEntity.ok(medicalRecordService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(medicalRecordService.getRecordById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<MedicalRecord> createRecord(@RequestBody MedicalRecord record) {
        return ResponseEntity.ok(medicalRecordService.createRecord(record));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<MedicalRecord> updateRecord(@PathVariable Long id, @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(medicalRecordService.updateRecord(id, record));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        medicalRecordService.deleteRecord(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patient/{userId}")
    public ResponseEntity<List<MedicalRecord>> getRecordsByPatient(@PathVariable Long userId) {
        // Find patient by user ID first
        Patient patient = patientRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Patient not found with userId: " + userId));
        
        // Then get records by patient ID
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatientId(patient.getId()));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getRecordsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(medicalRecordService.getRecordsByDoctorId(doctorId));
    }
}
