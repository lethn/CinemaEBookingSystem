package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Show;
import cs4050.A6.CinemaBookingSystem.models.cinema.Showroom;
import cs4050.A6.CinemaBookingSystem.models.movie.Movie;
import cs4050.A6.CinemaBookingSystem.models.response.BadRequestError;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowroomRepository;
import cs4050.A6.CinemaBookingSystem.repositories.movie.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @GetMapping("/shows/{id}")
    public ResponseEntity<Show> getShow(@PathVariable Long id) {
        Optional<Show> show = showRepository.findById(id);

        if (show.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(show.get());
    }

    @PostMapping("/shows")
    public ResponseEntity<?> saveShow(@RequestParam Long movieId, @RequestParam Long showroomId, @RequestParam Long theatreId, @RequestBody Show show) {
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

        // Set query params
        show.setShowroomId(showroomId);
        show.setTheatreId(theatreId);
        show.setMovie(existingMovie.get());

        // Add total seats based on room -- make copy
        show.setAllSeats(new ArrayList<>(existingShowroom.get().getSeats()));

        // Check for time conflict
        if (hasConflict(existingShowroom.get(), show, existingMovie.get())) {
            return ResponseEntity.badRequest().body(new BadRequestError("Time conflict with existing show. Please check time and showroom."));
        }

        var result = showRepository.save(show);

        // Add result to existing movie and showroom
        existingMovie.get().getShows().add(result);
        existingShowroom.get().getShows().add(result);
        movieRepository.save(existingMovie.get());
        showroomRepository.save(existingShowroom.get());

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(show);
    }

    @DeleteMapping("/shows/{id}")
    public ResponseEntity<Show> deleteShow(@PathVariable Long id) {
        // Check if show exists
        Optional<Show> existingShow = showRepository.findById(id);
        if (existingShow.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Update showroom showings list -- manual since no relationship -- may need to add ref on show side
        Optional<Showroom> existingShowroom = showroomRepository.findById(existingShow.get().getShowroomId());
        if (existingShowroom.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            existingShowroom.get().getShows().remove(existingShow.get());
            showroomRepository.save(existingShowroom.get());
        }

        showRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }

    // Check whether new show conflicts with any existing shows in this room
    // Assumes that shows cannot run at the same moment (i.e., one cannot start at the same time as another finishes)
    private boolean hasConflict(Showroom showroom, Show show, Movie movie) {
        var duration = movie.getDurationInMinutes();
        var newStartTime = show.getTime();
        var newEndTime = show.getTime().plusMinutes(duration);

        var existingShows = showroom.getShows();
        for (var existingShow : existingShows) {
            var existingStartTime = existingShow.getTime();
            var existingEndTime = existingShow.getTime().plusMinutes(duration);

            // Check for conflict
            boolean startTimeOverlaps = (newStartTime.isEqual(existingStartTime) || newStartTime.isAfter(existingStartTime)) && (newStartTime.isBefore(existingEndTime) || newStartTime.isEqual(existingEndTime));
            boolean endTimeOverlaps = (newEndTime.isEqual(existingStartTime) || newEndTime.isAfter(existingStartTime)) && (newEndTime.isBefore(existingEndTime) || newEndTime.isEqual(existingEndTime));
            if (startTimeOverlaps || endTimeOverlaps) {
                return true;
            }
        }

        return false;
    }
}