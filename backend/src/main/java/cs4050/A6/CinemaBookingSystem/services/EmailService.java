package cs4050.A6.CinemaBookingSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSenderImpl mailSender;
    private final String fromEmail = "cinemaproject.no.reply@gmail.com";

    @Autowired
    public EmailService(JavaMailSenderImpl mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String email, String token) {
        String subject = "Email Verification Code for Your New Account";

        String content = "Please use the following code to verify your account: " + token + ".";

        SimpleMailMessage message = new SimpleMailMessage(); // Use Spring mail library
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String email, String token) {
        String subject = "Password Reset Code for Your Account";

        String content = "Please use the following code to reset your password: " + token + ".";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    public void sendProfileChangesEmail(String email) {
        String subject = "Profile Changes Made";
        String content = "Your profile information has been successfully updated. " +
                "Check your account page to see what's changed!";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }
}
