package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import cs4050.A6.CinemaBookingSystem.models.cinema.Show;
import cs4050.A6.CinemaBookingSystem.models.cinema.Ticket;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.BookingRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.PaymentCardRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.PromotionRepository;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.ShowRepository;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import cs4050.A6.CinemaBookingSystem.services.EmailService;
import cs4050.A6.CinemaBookingSystem.services.GmailService;
import cs4050.A6.CinemaBookingSystem.utility.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with bookings
@RestController
public class BookingController {
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ShowRepository showRepository;
    private final PromotionRepository promotionRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final EmailService emailService;

    @Autowired
    public BookingController(BookingRepository bookingRepository, CustomerRepository customerRepository, ShowRepository showRepository, PromotionRepository promotionRepository, PaymentCardRepository paymentCardRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.showRepository = showRepository;
        this.promotionRepository = promotionRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.emailService = emailService;
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getBookings() {
        // Get all bookings
        List<Booking> movies = bookingRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);

        if (booking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(booking.get());
    }

    @PostMapping("/bookings") // Specify customerId, showId, promoCode (optional) in URL, booking in body
    public ResponseEntity<Booking> createBooking(@RequestParam Long customerId, @RequestParam Long showId, @RequestParam Long paymentCardId, @RequestParam(required = false) String promoCode, @RequestBody Booking booking) {
        // Get existing customer
        var existingCustomer = customerRepository.findById(customerId);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        } else {
            booking.setCustomer(existingCustomer.get());
        }

        // Get existing show and set movie name / time
        var existingShow = showRepository.findById(showId);
        if (existingShow.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        } else {
            booking.setShow(existingShow.get());
            booking.setShowTime(existingShow.get().getTime());
            booking.setMovieTitle(existingShow.get().getMovie().getTitle());
        }

        // Get existing card
        var existingCard = paymentCardRepository.findById(paymentCardId);
        if (existingCard.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        } else {
            booking.setPaymentCardId(existingCard.get().getId());
            booking.setPaymentCardFriendlyName(existingCard.get().getFriendlyName());
        }

        // Get existing promotion (if specified)
        if (promoCode != null && !promoCode.isEmpty()) {
            var existingPromotion = promotionRepository.findByPromoCode(promoCode);
            if (existingPromotion.isEmpty()) {
                return ResponseEntity.notFound().build(); // Invalid promo code
            }

            booking.setPromoCode(promoCode);
            booking.setDiscountPercentage(existingPromotion.get().getDiscount());
        }

        // Compute cost
        double cost = Utility.calculateTotalCost(booking.getTickets(), booking.getDiscountPercentage());
        booking.setTotalCost(cost);

        // Reserve seats
        for (Ticket ticket : booking.getTickets()) {
            String seatId = ticket.getSeatId();

            existingShow.get().updateSeatStatus(seatId, false);
        }

        // Save and update customer/show objects
        var result = bookingRepository.save(booking);
        existingCustomer.get().getBookings().add(result);
        existingShow.get().getBookings().add(result);
        customerRepository.save(existingCustomer.get());
        showRepository.save(existingShow.get());

        // Send booking confirmation email
        emailService.sendBookingConfirmationEmail(existingCustomer.get().getEmail(), result.getId());

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Booking> deleteBooking(@PathVariable Long id) {
        Optional<Booking> existingBooking = bookingRepository.findById(id);
        if (existingBooking.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Update show to update booked seats status -- booking itself automatically removed from list inside show
        Optional<Show> existingShow = showRepository.findById(existingBooking.get().getShow().getId());
        if (existingShow.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            // Free seats
            for (Ticket ticket : existingBooking.get().getTickets()) {
                String seatId = ticket.getSeatId();

                existingShow.get().updateSeatStatus(seatId, true);
            }

            showRepository.save(existingShow.get());
        }

        var customerEmail = existingBooking.get().getCustomer().getEmail();

        bookingRepository.deleteById(id);
        // Send booking cancellation email
        emailService.sendBookingCancellationEmail(customerEmail, id);

        return ResponseEntity.ok().build();
    }
}