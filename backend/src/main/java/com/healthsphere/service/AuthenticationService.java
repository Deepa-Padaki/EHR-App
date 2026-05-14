package com.healthsphere.service;

import com.healthsphere.dto.AuthenticationRequest;
import com.healthsphere.dto.AuthenticationResponse;
import com.healthsphere.dto.RegisterRequest;
import com.healthsphere.entity.Doctor;
import com.healthsphere.entity.Patient;
import com.healthsphere.entity.Role;
import com.healthsphere.entity.User;
import com.healthsphere.repository.DoctorRepository;
import com.healthsphere.repository.PatientRepository;
import com.healthsphere.repository.UserRepository;
import com.healthsphere.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        var savedUser = userRepository.save(user);
        System.out.println("User registered successfully: " + savedUser.getEmail() + " with role: " + savedUser.getRole());
        
        // Create corresponding Patient or Doctor record
        if (savedUser.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setPatientId("PAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            patient.setCreatedAt(LocalDateTime.now());
            patientRepository.save(patient);
            System.out.println("Patient record created for user: " + savedUser.getEmail());
        } else if (savedUser.getRole() == Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setDoctorId("DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            doctor.setCreatedAt(LocalDateTime.now());
            doctorRepository.save(doctor);
            System.out.println("Doctor record created for user: " + savedUser.getEmail());
        }
        
        var jwtToken = jwtService.generateTokenWithId(
                org.springframework.security.core.userdetails.User
                        .withUsername(savedUser.getEmail())
                        .password(savedUser.getPassword())
                        .authorities("ROLE_" + savedUser.getRole().name())
                        .build(),
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName()
        );
        return new AuthenticationResponse(jwtToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var jwtToken = jwtService.generateTokenWithId(
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities("ROLE_" + user.getRole().name())
                        .build(),
                user.getId(),
                user.getFirstName(),
                user.getLastName()
        );
        return new AuthenticationResponse(jwtToken);
    }
}
