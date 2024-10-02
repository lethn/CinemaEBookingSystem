package cs4050.A6.CinemaBookingSystem.models.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "payment_card")
@Data
public class PaymentCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_card_id")
    private Long id;
    @ManyToOne
    @JoinColumn(name="user_id", nullable = false) // Cannot be null -- must be associated with a customer
    private Customer customer;

    private String cardNumber; // Need to be encrypted???
    // Maybe add last 4 digits or friendly name for displaying???
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
