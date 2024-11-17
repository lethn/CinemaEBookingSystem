package cs4050.A6.CinemaBookingSystem.models.movie;

import cs4050.A6.CinemaBookingSystem.models.cinema.Show;
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
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long id; // Auto-generated unique identifier
    @Column(nullable = false)
    @ElementCollection(targetClass = String.class) // Annotation required to prevent compile-error
    private List<String> cast;

    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private String director;
    @Column(nullable = false)
    private String producer;
    @Column(nullable = false, length = 1000)
    private String synopsis;
    @Column(nullable = false, length = 1000)
    private String trailer;
    @Column(nullable = false, length = 1000)
    private String picture;
    @Column(nullable = false)
    private String rating; // E.g., 'PG-13'
    @Column(nullable = false)
    private boolean nowPlaying; // Whether movie is currently showing
    @Column(nullable = false)
    private int durationInMinutes; // Same for every showing of a movie

    // Non-required fields upon creation
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Show> shows = new ArrayList<>();

    // All basic methods (getters, setters, etc.) automatically defined by Lombok
}
