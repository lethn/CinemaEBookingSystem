package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Theatre;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with theatres (holds showrooms)
@RestController
public class TheatreController {
    private final TheatreRepository theatreRepository;

    @Autowired
    public TheatreController(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
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
}