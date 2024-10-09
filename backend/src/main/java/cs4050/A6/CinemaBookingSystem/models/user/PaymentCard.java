package cs4050.A6.CinemaBookingSystem.models.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PaymentCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_card_id")
    private Long id;

    private String friendlyName; // Friendly name for easy displaying
    private String cardNumber; // Encoded using Spring Security Password Encoder during creation -- raw password passed
    private LocalDate expirationDate;
    private String billingAddress;
}
