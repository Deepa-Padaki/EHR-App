package com.healthsphere.repository;

import com.healthsphere.entity.MedicalReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalReviewRepository extends JpaRepository<MedicalReview, Long> {
    List<MedicalReview> findByDoctorId(Long doctorId);
    List<MedicalReview> findByPatientId(Long patientId);
    List<MedicalReview> findByAppointmentId(Long appointmentId);
}
