package com.healthsphere.service;

import com.healthsphere.entity.Prescription;
import com.healthsphere.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
    }

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, Prescription prescription) {
        Prescription existingPrescription = getPrescriptionById(id);
        existingPrescription.setMedicationName(prescription.getMedicationName());
        existingPrescription.setDosage(prescription.getDosage());
        existingPrescription.setFrequency(prescription.getFrequency());
        existingPrescription.setDuration(prescription.getDuration());
        existingPrescription.setInstructions(prescription.getInstructions());
        existingPrescription.setStatus(prescription.getStatus());
        return prescriptionRepository.save(existingPrescription);
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }
}
