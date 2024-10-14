package cs4050.A6.CinemaBookingSystem.models.user;

import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
    @Column(nullable = false)
    private CustomerState status = CustomerState.INACTIVE;

    private String verificationCode;
    private String passwordResetCode;

    // Non-required fields upon creation
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentCard> paymentCards = new ArrayList<>();
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    // TO DO: Add methods
    // Q: Card limit logic should just be on frontend so user never even can get to a call?
    public boolean canAddCard() {
        // Check user is under card limit (3)
        return paymentCards.size() < 3;
    }
}
