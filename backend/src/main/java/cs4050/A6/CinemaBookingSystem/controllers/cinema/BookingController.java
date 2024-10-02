package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.BookingRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowRepository;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with bookings
@RestController
public class BookingController {
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ShowRepository showRepository;

    @Autowired
    public BookingController(BookingRepository bookingRepository, CustomerRepository customerRepository, ShowRepository showRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.showRepository = showRepository;
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getBookings() {
        // Get all bookings
        List<Booking> movies = bookingRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(movies);
    }

    @PostMapping("/bookings") // Specify customerId and showId in URL, booking in body
    public ResponseEntity<Booking> createBooking(@RequestParam Long customerId, @RequestParam Long showId, @RequestBody Booking booking) {
        // Get existing customer
        var existingCustomer = customerRepository.findById(customerId);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Get existing show
        var existingShow = showRepository.findById(showId);
        if (existingShow.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        var result = bookingRepository.save(booking);
        existingCustomer.get().getBookings().add(result);
        existingShow.get().getBookings().add(result);
        customerRepository.save(existingCustomer.get());
        showRepository.save(existingShow.get());

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(booking);
    }
}