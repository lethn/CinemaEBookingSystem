package cs4050.A6.CinemaBookingSystem.models.cinema;

import com.fasterxml.jackson.annotation.JsonBackReference;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long id;

    private SeatType type;
    // Don't need ticket cost since determined based on type -- flat rate based on type
    private String seatId;
}
