package com.healthsphere.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @Column(nullable = false)
    private String medicationName;
    
    @Column(nullable = false)
    private String dosage;
    
    private String frequency;
    private String duration;
    private String instructions;
    private String pharmacyName;
    private String pharmacyAddress;
    
    @Enumerated(EnumType.STRING)
    private PrescriptionStatus status;
    
    private LocalDateTime prescriptionDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        prescriptionDate = LocalDateTime.now();
        status = PrescriptionStatus.ACTIVE;
    }
}
