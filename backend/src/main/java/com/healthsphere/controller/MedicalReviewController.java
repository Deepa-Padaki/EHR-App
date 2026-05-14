package com.healthsphere.controller;

import com.healthsphere.dto.MedicalReviewRequest;
import com.healthsphere.entity.MedicalReview;
import com.healthsphere.repository.MedicalReviewRepository;
import com.healthsphere.repository.PatientRepository;
import com.healthsphere.repository.DoctorRepository;
import com.healthsphere.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/medical-reviews")
@CrossOrigin(origins = "*")
public class MedicalReviewController {

    @Autowired
    private MedicalReviewRepository medicalReviewRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<MedicalReview> createReview(@RequestBody MedicalReviewRequest request) {
        try {
            var patient = patientRepository.findByUserId(request.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            var doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            MedicalReview.MedicalReviewBuilder reviewBuilder = MedicalReview.builder()
                    .patient(patient)
                    .doctor(doctor)
                    .rating(request.getRating())
                    .reviewText(request.getReviewText());

            if (request.getAppointmentId() != null) {
                var appointment = appointmentRepository.findById(request.getAppointmentId())
                        .orElseThrow(() -> new RuntimeException("Appointment not found"));
                reviewBuilder.appointment(appointment);
            }

            MedicalReview review = reviewBuilder.build();
            MedicalReview savedReview = medicalReviewRepository.save(review);
            
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<MedicalReview>> getReviewsByDoctor(@PathVariable Long doctorId) {
        List<MedicalReview> reviews = medicalReviewRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<MedicalReview>> getReviewsByPatient(@PathVariable Long patientId) {
        List<MedicalReview> reviews = medicalReviewRepository.findByPatientId(patientId);
        return ResponseEntity.ok(reviews);
    }
}
