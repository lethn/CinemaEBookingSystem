package cs4050.A6.CinemaBookingSystem.models.cinema;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @Column(nullable = false)
    private List<Ticket> tickets = new ArrayList<>();
    @Column(nullable = false) // Used for storing charged card -- refund use case
    private Long paymentCardId;
    @Column(nullable = false) // Used for storing name charged card -- deleted card but used for booking use case
    private String paymentCardFriendlyName;

    // Information to display in booking history page where user can cancel a booking -- just movie name and time
    @Column(nullable = false)
    private String movieTitle;
    @Column(nullable = false)
    private LocalDateTime showTime;

    // Ignore -- ensures corresponding entries are deleted
    @ManyToOne
    @JoinColumn(name = "show_id")
    @JsonIgnore
    private Show show;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Customer customer;

    // Fields set upon creation
    private String promoCode = "";
    private Integer discountPercentage = 0; // E.g., 20 for 20% off -- 0 if N/A
    private Double totalCost;
}
