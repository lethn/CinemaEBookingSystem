package cs4050.A6.CinemaBookingSystem.models.cinema;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @OneToMany(cascade = CascadeType.ALL)
    private List<Ticket> tickets = new ArrayList<>();

    // TO DO: Figure out a way to include relevant info from showing in this so can display show info in order history
//    @ManyToOne
//    @JoinColumn(name="show_id", nullable = false)
//    private Show show;
    // Also add payment card friendly name?

    // Fields set upon creation
    private String promoCode = "";
    private Integer discountPercentage = 0; // E.g., 20 for 20% off -- 0 if N/A
    private Double totalCost;
}
