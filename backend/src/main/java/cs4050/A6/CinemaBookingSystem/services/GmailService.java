package cs4050.A6.CinemaBookingSystem.services;

import cs4050.A6.CinemaBookingSystem.models.cinema.Promotion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

@Service
public class GmailService implements EmailService {
    private final JavaMailSenderImpl mailSender;
    private final String fromEmail = "cinemaproject.no.reply@gmail.com";

    @Autowired
    public GmailService(JavaMailSenderImpl mailSender) {
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

    public void sendPromotionEmail(String email, Promotion promotion) {
        String subject = "New Promotion";

        String content = "We have a new promotion available! Use code:  " + promotion.getPromoCode() + " to get " + promotion.getDiscount() + "% off your next order!";

        SimpleMailMessage message = new SimpleMailMessage(); // Use Spring mail library
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    public void sendBookingConfirmationEmail(String email, Long bookingId) {
        String subject = "Booking Confirmed";

        String content = "The following booking has been confirmed: ID: " + bookingId + ". Thank you for your purchase!";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    public void sendBookingCancellationEmail(String email, Long bookingId) {
        String subject = "Booking Cancelled - Refund Issued";

        String content = "The following booking has been cancelled: " + bookingId + ". A refund has been issued to your payment method.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }
}
