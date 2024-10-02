package cs4050.A6.CinemaBookingSystem.models.cinema;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "showing") // Need to specify a custom name since 'show' is reserved in MySQL
// Represents a particular showing for a movie
public class Show {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_id")
    private Long id;
    @ElementCollection(targetClass = String.class)
    private Set<String> reservedSeats; // Stores seat ids that are already reserved -- non-present ids are available

    private int durationInMinutes;
    private LocalDateTime time;

    // Non-required fields upon creation
    @OneToMany(cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    //     TO DO: Update class diagram to include boolean flag
//     isAvailable indicates if the seat is now available or reserved
    public void updateSeatStatus(String seatId, boolean isAvailable) {
        if (isAvailable) {
            // Make available
            reservedSeats.remove(seatId);
        } else {
            // Make unavailable
            reservedSeats.add(seatId);
        }
    }
}