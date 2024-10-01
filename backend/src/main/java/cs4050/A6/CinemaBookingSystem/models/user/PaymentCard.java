package cs4050.A6.CinemaBookingSystem.models.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "payment-card")
@Data
public class PaymentCard {
    @Id
    @GeneratedValue
    private Long id;

    private String cardNumber; // Need to be encrypted???
    // Maybe add last 4 digits or friendly name for displaying?
    private LocalDate expirationDate;
    private String billingAddress;

    public PaymentCard(String cardNumber, LocalDate expirationDate, String billingAddress) {
        if (!isValidCard(cardNumber, expirationDate)) {
            throw new IllegalArgumentException("Invalid card.");
        } else {
            // Valid card so construct object
            this.cardNumber = cardNumber;
            this.expirationDate = expirationDate;
            this.billingAddress = billingAddress;
        }
    }

    public PaymentCard() {} // Default no-args constructor for Spring

    // TO DO: Add methods
    private boolean isValidCard(String cardNumber, LocalDate expirationDate) {
        // TO DO: Validate...
        return true;
    }
}
