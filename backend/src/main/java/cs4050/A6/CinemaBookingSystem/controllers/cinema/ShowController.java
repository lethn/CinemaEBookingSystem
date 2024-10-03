package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Show;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowroomRepository;
import cs4050.A6.CinemaBookingSystem.repositories.movie.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with showings
@RestController
public class ShowController {
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ShowroomRepository showroomRepository;

    @Autowired
    public ShowController(ShowRepository showRepository, MovieRepository movieRepository, ShowroomRepository showroomRepository) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.showroomRepository = showroomRepository;
    }

    @GetMapping("/shows")
    public ResponseEntity<List<Show>> getShows() {
        List<Show> shows = showRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(shows);
    }

    @PostMapping("/shows") // Specify movieId and showroomId in URL, show in body
    public ResponseEntity<Show> createShow(@RequestParam Long movieId, @RequestParam Long showroomId, @RequestBody Show show) {
        // Get existing movie
        var existingMovie = movieRepository.findById(movieId);
        if (existingMovie.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Get existing showroom
        var existingShowroom = showroomRepository.findById(showroomId);
        if (existingShowroom.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Add total seats based on room
        show.setAllSeats(existingShowroom.get().getSeats());

        // Save show to DB
        var result = showRepository.save(show);

        // Add result to existing movie and showroom
        existingMovie.get().getShows().add(result);
        existingShowroom.get().getShows().add(result);
        movieRepository.save(existingMovie.get());
        showroomRepository.save(existingShowroom.get());

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(show);
    }
}