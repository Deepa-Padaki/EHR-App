package com.healthsphere.dto;

import lombok.Data;

@Data
public class MedicalReviewRequest {
    private Long patientId;
    private Long doctorId;
    private Long appointmentId;
    private Integer rating;
    private String reviewText;
}
