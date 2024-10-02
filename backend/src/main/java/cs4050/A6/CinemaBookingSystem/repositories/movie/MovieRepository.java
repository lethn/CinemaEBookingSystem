package cs4050.A6.CinemaBookingSystem.repositories.movie;

import cs4050.A6.CinemaBookingSystem.models.movie.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Defines methods for interacting with database -- can add custom queries as needed
public interface MovieRepository extends JpaRepository<Movie, Long> {
    // Default methods inherited...

    // Custom methods
    // Finds all movies whose title contains the specified keyword
    List<Movie> findByTitleContaining(String title);
}
