package cs4050.A6.CinemaBookingSystem.controllers;

import cs4050.A6.CinemaBookingSystem.models.Movie;
import cs4050.A6.CinemaBookingSystem.repositories.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with the movie database (e.g., create movie)
@RestController
public class MovieController {
    // Could also move this into a separate service class if needed
    private final MovieRepository movieRepository;

    @Autowired // Auto-injected by Spring during runtime
    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Public endpoints
    @GetMapping("/movies") // Gets all movies from database
    public ResponseEntity<List<Movie>> getMovies() {
        // Get all movies
        List<Movie> movies = movieRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(movies);
    }

    @PostMapping("/movies")
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        // Create movie in database
        movieRepository.save(movie);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(movie);
    }

    @DeleteMapping("/movies/{id}") // Deletes a movie by its unique id
    public ResponseEntity<Movie> deleteMovie(@PathVariable("id") Long id) {
        // Check if movie exists
        Optional<Movie> existingMovie = movieRepository.findById(id);
        if (existingMovie.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Delete movie
        movieRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/movies/search") // Searches for movies by title
    public ResponseEntity<List<Movie>> findMoviesByTitle(@RequestParam String title) {
        // Get all movies with this title as/within their title value
        List<Movie> matches = movieRepository.findByTitleContaining(title);

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(matches);
    }
}
