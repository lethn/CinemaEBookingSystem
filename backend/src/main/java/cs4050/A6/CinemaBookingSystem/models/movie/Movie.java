package cs4050.A6.CinemaBookingSystem.models.movie;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import cs4050.A6.CinemaBookingSystem.models.cinema.Show;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long id; // Auto-generated unique identifier
    @ElementCollection(targetClass = String.class) // Annotation required to prevent compile-error
    private List<String> cast;

    private String title;
    private String category;
    private String director;
    private String producer;
    private String synopsis;
    private String trailer;
    private String picture;
    private String rating; // E.g., 'PG-13'
    private boolean nowPlaying; // Whether movie is currently showing

    // Non-required fields upon creation
    @OneToMany(cascade = CascadeType.ALL)
    private List<Show> shows = new ArrayList<>();

    // All basic methods (getters, setters, etc.) automatically defined by Lombok
}
