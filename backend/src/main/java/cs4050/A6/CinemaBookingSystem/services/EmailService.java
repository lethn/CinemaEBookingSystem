package cs4050.A6.CinemaBookingSystem.services;

import cs4050.A6.CinemaBookingSystem.models.cinema.Promotion;

public interface EmailService {
    void sendVerificationEmail(String email, String token);

    void sendPasswordResetEmail(String email, String token);

    void sendProfileChangesEmail(String email);

    void sendPromotionEmail(String email, Promotion promotion);

    void sendBookingCancellationEmail(String email, Long bookingId);
}
