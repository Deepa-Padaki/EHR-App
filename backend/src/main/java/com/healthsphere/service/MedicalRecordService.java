package com.healthsphere.service;

import com.healthsphere.entity.MedicalRecord;
import com.healthsphere.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public List<MedicalRecord> getAllRecords() {
        return medicalRecordRepository.findAll();
    }

    public MedicalRecord getRecordById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
    }

    public MedicalRecord createRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    public MedicalRecord updateRecord(Long id, MedicalRecord record) {
        MedicalRecord existingRecord = getRecordById(id);
        existingRecord.setDiagnosis(record.getDiagnosis());
        existingRecord.setSymptoms(record.getSymptoms());
        existingRecord.setTreatment(record.getTreatment());
        existingRecord.setMedications(record.getMedications());
        existingRecord.setLabResults(record.getLabResults());
        return medicalRecordRepository.save(existingRecord);
    }

    public void deleteRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public List<MedicalRecord> getRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public List<MedicalRecord> getRecordsByDoctorId(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }
}
