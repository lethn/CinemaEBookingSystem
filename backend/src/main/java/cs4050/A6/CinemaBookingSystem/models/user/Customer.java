package cs4050.A6.CinemaBookingSystem.models.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customer")
public class Customer extends User {
    private CustomerState status;
    private List<PaymentCard> paymentCards; // Max 3 cards -- validate in add logic
    // TO DO: Add booking attribute

    // TO DO: Add methods
    public boolean addPaymentCard(String cardNumber, LocalDate expirationDate, String billingAddress) {
        // Check user is under card limit (3)
        if (paymentCards.size() >= 3) {
            return false;
        }

        // Create a new card (constructor performs validations) and add it to list
        try {
            var paymentCard = new PaymentCard(cardNumber, expirationDate, billingAddress);

            paymentCards.add(paymentCard);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
