package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Show;
import cs4050.A6.CinemaBookingSystem.models.cinema.Showroom;
import cs4050.A6.CinemaBookingSystem.models.cinema.Theatre;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowroomRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with showrooms
@RestController
public class ShowroomController {
    private final ShowroomRepository showroomRepository;
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;

    @Autowired
    public ShowroomController(ShowroomRepository showroomRepository, TheatreRepository theatreRepository, ShowRepository showRepository) {
        this.showroomRepository = showroomRepository;
        this.theatreRepository = theatreRepository;
        this.showRepository = showRepository;
    }

    @GetMapping("/showrooms")
    public ResponseEntity<List<Showroom>> getShowrooms() {
        List<Showroom> showrooms = showroomRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(showrooms);
    }

    @PostMapping("/showrooms") // Specify theatreId, showroom in body
    public ResponseEntity<Showroom> createShowroom(@RequestParam Long theatreId, @RequestBody Showroom showroom) {
        // Get existing theatre
        var existingTheatre = theatreRepository.findById(theatreId);
        if (existingTheatre.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Save showroom to DB
        var result = showroomRepository.save(showroom);

        // Add result to theatre
        existingTheatre.get().getShowrooms().add(result);
        theatreRepository.save(existingTheatre.get());

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(showroom);
    }

    // Just for testing -- multiple params to simplify
    @DeleteMapping("/showrooms")
    public ResponseEntity<Showroom> deleteShowroom(@RequestParam Long theatreId, @RequestParam Long showroomId) {
        Optional<Showroom> existingShowroom = showroomRepository.findById(showroomId);
        if (existingShowroom.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Remove from theatre (parent)
        Optional<Theatre> existingTheatre = theatreRepository.findById(theatreId);
        if (existingTheatre.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        existingTheatre.get().getShowrooms().remove(existingShowroom.get());

        // Delete all shows
        var shows = existingShowroom.get().getShows();
        for (int i = 0; i < shows.size(); i++) {
            Optional<Show> existingShow = showRepository.findById(shows.get(i).getId());
            // Remove from parent
            existingShowroom.get().getShows().remove(existingShow.get());
            // Now delete
            showRepository.deleteById(existingShow.get().getId());
        }

        // Now delete showroom without any shows
        showroomRepository.deleteById(showroomId);

        return ResponseEntity.ok().build();
    }
}