package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Showroom;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowroomRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with showrooms
@RestController
public class ShowroomController {
    private final ShowroomRepository showroomRepository;
    private final TheatreRepository theatreRepository;

    @Autowired
    public ShowroomController(ShowroomRepository showroomRepository, TheatreRepository theatreRepository) {
        this.showroomRepository = showroomRepository;
        this.theatreRepository = theatreRepository;
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
}