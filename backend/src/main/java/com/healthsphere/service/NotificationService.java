package com.healthsphere.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAppointmentReminder(String email, String appointmentTime, String doctorName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Appointment Reminder - HealthSphere");
        message.setText("Dear Patient,\n\n" +
                "This is a reminder for your upcoming appointment:\n" +
                "Doctor: " + doctorName + "\n" +
                "Date & Time: " + appointmentTime + "\n\n" +
                "Please log in to your HealthSphere portal to join the consultation.\n\n" +
                "Best regards,\nHealthSphere Team");
        
        mailSender.send(message);
    }

    public void sendPrescriptionNotification(String email, String doctorName, String medication) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("New Prescription - HealthSphere");
        message.setText("Dear Patient,\n\n" +
                "Dr. " + doctorName + " has prescribed:\n" +
                "Medication: " + medication + "\n\n" +
                "Please log in to your HealthSphere portal to view the full prescription details.\n\n" +
                "Best regards,\nHealthSphere Team");
        
        mailSender.send(message);
    }

    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDailyReminders() {
        System.out.println("Sending daily appointment reminders...");
    }
}
