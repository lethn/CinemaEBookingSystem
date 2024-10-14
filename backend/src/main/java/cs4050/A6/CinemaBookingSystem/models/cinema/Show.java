package cs4050.A6.CinemaBookingSystem.models.cinema;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cs4050.A6.CinemaBookingSystem.models.movie.Movie;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
// Q: May not need if only show admin available times to schedule
// Need to specify a custom name since 'show' is reserved in MySQL
@Table(name = "showing", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"time", "showroomId"}) // Creates a uniqueness constraint using time and showroomId combo
})
// Represents a particular showing for a movie
public class Show {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_id")
    private Long id;

    @Column(nullable = false)
    private int durationInMinutes;
    @Column(nullable = false)
    private LocalDateTime time;
    @Column(nullable = false)
    private Long showroomId; // Set by controller method using query param in URL

    // Non-required fields upon creation
    @ElementCollection(targetClass = String.class)
    private List<String> allSeats; // All seats based on parent showroom -- no reservation information
    @ElementCollection(targetClass = String.class)
    private Set<String> reservedSeats = new HashSet<>(); // Stores seat ids that are already reserved -- non-present ids are available

    // Ignore -- ensures proper deletion
    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    private Movie movie;

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