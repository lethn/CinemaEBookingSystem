package cs4050.A6.CinemaBookingSystem.models.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Customer extends User {
    private CustomerState status = CustomerState.INACTIVE;

    // Non-required fields upon creation
    @OneToMany(cascade = CascadeType.ALL)
    private List<PaymentCard> paymentCards = new ArrayList<>(); // Max 3 cards -- validate in add logic
    @OneToMany(cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

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
