package cs4050.A6.CinemaBookingSystem.models.cinema;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Long id;

    @Column(nullable = false)
    private String promoCode;
    @Column(nullable = false)
    private Integer discount; // Discount % -- e.g., 10 means 10% off
    @Column(nullable = false)
    private boolean isModifiable = true; // Set to false once admin sends email -- CONFIRM WHETHER AFFECTS DELETION?
}
