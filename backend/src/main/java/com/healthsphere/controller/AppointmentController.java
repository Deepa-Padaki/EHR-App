package com.healthsphere.controller;

import com.healthsphere.dto.AppointmentRequest;
import com.healthsphere.entity.Appointment;
import com.healthsphere.entity.AppointmentStatus;
import com.healthsphere.entity.AppointmentType;
import com.healthsphere.entity.Doctor;
import com.healthsphere.entity.MedicalRecord;
import com.healthsphere.entity.Patient;
import com.healthsphere.service.AppointmentService;
import com.healthsphere.repository.DoctorRepository;
import com.healthsphere.repository.MedicalRecordRepository;
import com.healthsphere.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            System.out.println("Creating appointment with request: " + request);
            
            // Find patient by user ID
            Patient patient = patientRepository.findByUserId(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with userId: " + request.getPatientId()));
            
            // Find doctor by ID
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + request.getDoctorId()));

            Appointment appointment = new Appointment();
            appointment.setPatient(patient);
            appointment.setDoctor(doctor);
            appointment.setAppointmentDateTime(request.getAppointmentDateTime());
            appointment.setReason(request.getReason());
            
            // Parse appointment type
            AppointmentType type;
            try {
                type = AppointmentType.valueOf(request.getType());
            } catch (IllegalArgumentException e) {
                type = AppointmentType.IN_PERSON; // Default
            }
            appointment.setType(type);
            appointment.setStatus(AppointmentStatus.SCHEDULED);
            appointment.setVideoCallLink("https://meet.healthsphere.com/" + UUID.randomUUID().toString().substring(0, 8));

            Appointment savedAppointment = appointmentService.createAppointment(appointment);
            System.out.println("Appointment created successfully: " + savedAppointment.getId());
            
            // Create sample medical record and prescription for demonstration
            try {
                MedicalRecord record = new MedicalRecord();
                record.setPatient(patient);
                record.setDoctor(doctor);
                record.setAppointment(savedAppointment);
                record.setDiagnosis("Pending diagnosis - appointment scheduled");
                record.setSymptoms(request.getReason());
                record.setTreatment("To be determined after consultation");
                record.setMedications("None prescribed yet");
                record.setRecordDate(java.time.LocalDateTime.now());
                record.setCreatedAt(java.time.LocalDateTime.now());
                medicalRecordRepository.save(record);
                System.out.println("Sample medical record created for appointment: " + savedAppointment.getId());
            } catch (Exception e) {
                System.err.println("Could not create sample medical record: " + e.getMessage());
            }
            
            return ResponseEntity.ok(savedAppointment);
        } catch (Exception e) {
            System.err.println("Error creating appointment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, appointment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patient/{userId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long userId) {
        // Find patient by user ID first
        Patient patient = patientRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Patient not found with userId: " + userId));
        
        // Then get appointments by patient ID
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(patient.getId()));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctorId));
    }
}
