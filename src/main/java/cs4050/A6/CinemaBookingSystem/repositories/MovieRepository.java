package cs4050.A6.CinemaBookingSystem.repositories;

import cs4050.A6.CinemaBookingSystem.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Defines methods for interacting with database -- can add custom queries as needed
public interface MovieRepository extends JpaRepository<Movie, Long> {
    // Default methods inherited...

    // Custom methods
    // Finds all movies whose title contains the specified keyword
    List<Movie> findByTitleContaining(String title);
}
