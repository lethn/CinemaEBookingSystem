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

// Setups various public-facing REST endpoints for interacting with theatres (holds showrooms)
@RestController
public class TheatreController {
    private final TheatreRepository theatreRepository;
    private final ShowroomRepository showroomRepository;
    private final ShowRepository showRepository;

    @Autowired
    public TheatreController(TheatreRepository theatreRepository, ShowroomRepository showroomRepository, ShowRepository showRepository) {
        this.theatreRepository = theatreRepository;
        this.showroomRepository = showroomRepository;
        this.showRepository = showRepository;
    }

    @GetMapping("/theatres")
    public ResponseEntity<List<Theatre>> getTheatres() {
        List<Theatre> theatres = theatreRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(theatres);
    }

    @PostMapping("/theatres")
    public ResponseEntity<Theatre> createTheatre(@RequestBody Theatre theatre) {
        theatreRepository.save(theatre);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(theatre);
    }

    // Just for testing -- duplication of code
    @DeleteMapping("/theatres/{id}")
    public ResponseEntity<Showroom> deleteTheatre(@PathVariable("id") Long id) {
        Optional<Theatre> existingTheatre = theatreRepository.findById(id);
        if (existingTheatre.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Delete existing showrooms
        var showrooms = existingTheatre.get().getShowrooms();
        for (int i = 0; i < showrooms.size(); i++) {
            Optional<Showroom> existingShowroom = showroomRepository.findById(showrooms.get(i).getId());
            if (existingShowroom.isEmpty()) {
                return ResponseEntity.notFound().build(); // Does not exist
            }

            // Remove from theatre (parent)
            existingTheatre.get().getShowrooms().remove(existingShowroom.get());

            // Delete all shows
            var shows = existingShowroom.get().getShows();
            for (int j = 0; j < shows.size(); j++) {
                Optional<Show> existingShow = showRepository.findById(shows.get(i).getId());
                // Remove from parent
                existingShowroom.get().getShows().remove(existingShow.get());
                // Now delete
                showRepository.deleteById(existingShow.get().getId());
            }

            // Now delete showroom without any shows
            showroomRepository.deleteById(existingShowroom.get().getId());
        }

        theatreRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}