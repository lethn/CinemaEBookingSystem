package cs4050.A6.CinemaBookingSystem.controllers.movie;

import cs4050.A6.CinemaBookingSystem.models.cinema.Show;
import cs4050.A6.CinemaBookingSystem.models.movie.Movie;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import cs4050.A6.CinemaBookingSystem.models.user.CustomerState;
import cs4050.A6.CinemaBookingSystem.repositories.movie.MovieRepository;
import cs4050.A6.CinemaBookingSystem.utility.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(movie.get());
    }

    @GetMapping("/movies/shows") // Get all showings for a particular movie
    public ResponseEntity<List<Show>> getShowsForMovie(@RequestParam Long movieId) {
        Optional<Movie> existingMovie = movieRepository.findById(movieId);
        if (existingMovie.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Return list of showings for this movie
        return ResponseEntity.ok(existingMovie.get().getShows());
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

    @GetMapping("/movies/search-title")
    public ResponseEntity<List<Movie>> findMoviesByTitle(@RequestParam String title) {
        // Get all movies with this title as/within their title value
        List<Movie> matches = movieRepository.findByTitleContaining(title);

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/movies/search-category")
    public ResponseEntity<List<Movie>> findMoviesByCategory(@RequestParam String category) {
        // Get all movies with this param as/within their category value
        List<Movie> matches = movieRepository.findByCategoryContaining(category);

        return ResponseEntity.ok(matches);
    }

    @PatchMapping("/movies/{id}") // Updates specified fields on existing movie object
    // Any field that is null (meaning wasn't included in JSON body) is assumed to not be changing
    public ResponseEntity<Movie> updateMovie(@PathVariable("id") Long id, @RequestBody Map<String, Object> patch) {
        Optional<Movie> existing = movieRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Extract non-null fields
        for (String key : patch.keySet()) {
            Object value = patch.get(key);

            if (value == null) {
                continue;
            }

            switch (key) {
                case "cast" -> existing.get().setCast((List<String>) value);
                case "title" -> existing.get().setTitle((String) value);
                case "category" -> existing.get().setCategory((String) value);
                case "director" -> existing.get().setDirector((String) value);
                case "producer" -> existing.get().setProducer((String) value);
                case "synopsis" -> existing.get().setSynopsis((String) value);
                case "trailer" -> existing.get().setTrailer((String) value);
                case "picture" -> existing.get().setPicture((String) value);
                case "rating" -> existing.get().setRating((String) value);
                case "nowPlaying" -> existing.get().setNowPlaying((boolean) value);
                case "durationInMinutes" -> existing.get().setDurationInMinutes((int) value);
            }
        }

        var result = movieRepository.save(existing.get());

        return ResponseEntity.ok(result);
    }
}
