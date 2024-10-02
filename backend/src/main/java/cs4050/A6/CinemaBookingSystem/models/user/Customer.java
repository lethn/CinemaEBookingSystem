package cs4050.A6.CinemaBookingSystem.models.user;

import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    public boolean canAddCard() {
        // Check user is under card limit (3)
        return paymentCards.size() < 3;
    }
}
