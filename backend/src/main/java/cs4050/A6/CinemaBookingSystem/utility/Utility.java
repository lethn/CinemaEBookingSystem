package cs4050.A6.CinemaBookingSystem.utility;

import cs4050.A6.CinemaBookingSystem.models.cinema.Ticket;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

// Utility class for methods that do not belong to a particular class instance
public class Utility {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public static double calculateTotalCost(List<Ticket> tickets, int discountPercentage) {
        double total = 0;
        for (var ticket : tickets) {
            // Calculate ticket cost based on type
            // TO DO: CONFIRM PRICES
            switch (ticket.getType()) {
                case ADULT -> total += 12;
                case SENIOR -> total += 10;
                case CHILD -> total += 8;
            }
        }

        // Apply discount
        double discount = 1 - (discountPercentage / 100.0);
        total *= discount;

        return total;
    }

    public static boolean isValidCard(String cardNumber, LocalDate expirationDate) {
        // TO DO: Validate...
        return true;
    }

    public static String encode(String data) {
        return encoder.encode(data);
    }

    // Checks whether a supplied password matches a user's encoded password
    public static boolean isValidPassword(String password, String encoding) {
        return encoder.matches(password, encoding);
    }

    // Generates a random token for verifying email or resetting password
    public static String generateUniqueToken() {
        return UUID.randomUUID().toString();
    }
}
