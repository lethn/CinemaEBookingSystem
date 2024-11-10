package cs4050.A6.CinemaBookingSystem.models.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(nullable = false)
    private String friendlyName; // Friendly name for easy displaying
    @Column(nullable = false)
    private String cardNumber; // Encoded using Spring Security during creation
    @Column(nullable = false)
    private LocalDate expirationDate;

    // Ignore -- ensures corresponding entries are deleted
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Customer customer;
}
