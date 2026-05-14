package com.healthsphere.config;

import com.healthsphere.entity.Doctor;
import com.healthsphere.entity.Patient;
import com.healthsphere.entity.Role;
import com.healthsphere.entity.User;
import com.healthsphere.repository.DoctorRepository;
import com.healthsphere.repository.PatientRepository;
import com.healthsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("=== Seeding Database with Sample Data ===");
        
        // Check if data already exists
        if (doctorRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping...");
            return;
        }

        // Create sample doctors
        String[] doctorEmails = {
            "dr.sarah@healthsphere.com",
            "dr.michael@healthsphere.com",
            "dr.emily@healthsphere.com",
            "dr.james@healthsphere.com",
            "dr.lisa@healthsphere.com"
        };

        String[] doctorNames = {
            "Dr. Sarah Johnson",
            "Dr. Michael Chen",
            "Dr. Emily Williams",
            "Dr. James Brown",
            "Dr. Lisa Anderson"
        };

        String[] specializations = {
            "Cardiologist",
            "Dermatologist",
            "Pediatrician",
            "Orthopedic",
            "Neurologist"
        };

        String[] qualifications = {
            "MD, FACC",
            "MD, FAAD",
            "MD, FAAP",
            "MD, FAAOS",
            "MD, PhD"
        };

        String[] departments = {
            "Cardiology",
            "Dermatology",
            "Pediatrics",
            "Orthopedics",
            "Neurology"
        };

        for (int i = 0; i < 5; i++) {
            // Create User
            String[] nameParts = doctorNames[i].replace("Dr. ", "").split(" ");
            User user = User.builder()
                    .firstName(nameParts[0])
                    .lastName(nameParts[1])
                    .email(doctorEmails[i])
                    .password(passwordEncoder.encode("doctor123"))
                    .role(Role.DOCTOR)
                    .build();
            
            User savedUser = userRepository.save(user);
            System.out.println("Created doctor user: " + savedUser.getEmail());

            // Create Doctor record
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setDoctorId("DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            doctor.setSpecialization(specializations[i]);
            doctor.setQualification(qualifications[i]);
            doctor.setDepartment(departments[i]);
            doctor.setExperience(String.valueOf(10 + i) + " years");
            doctor.setConsultationFee(String.valueOf(100.0 + (i * 20)));
            doctor.setLicenseNumber("LIC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
            doctor.setCreatedAt(LocalDateTime.now());
            
            doctorRepository.save(doctor);
            System.out.println("Created doctor record: " + doctorNames[i] + " - " + specializations[i]);
        }

        // Create sample patient user
        User patientUser = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("patient@healthsphere.com")
                .password(passwordEncoder.encode("patient123"))
                .role(Role.PATIENT)
                .build();
        
        User savedPatientUser = userRepository.save(patientUser);
        System.out.println("Created patient user: " + savedPatientUser.getEmail());

        // Create Patient record
        Patient patient = new Patient();
        patient.setUser(savedPatientUser);
        patient.setPatientId("PAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        patient.setCreatedAt(LocalDateTime.now());
        
        patientRepository.save(patient);
        System.out.println("Created patient record for: " + savedPatientUser.getEmail());

        System.out.println("=== Database Seeding Complete ===");
        System.out.println("");
        System.out.println("Sample Login Credentials:");
        System.out.println("Patient: patient@healthsphere.com / patient123");
        System.out.println("Doctors:");
        for (int i = 0; i < 5; i++) {
            System.out.println("  " + doctorEmails[i] + " / doctor123");
        }
    }
}
