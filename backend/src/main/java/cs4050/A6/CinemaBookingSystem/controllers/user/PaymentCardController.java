package cs4050.A6.CinemaBookingSystem.controllers.user;

import cs4050.A6.CinemaBookingSystem.models.movie.Movie;
import cs4050.A6.CinemaBookingSystem.models.user.PaymentCard;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.PaymentCardRepository;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import cs4050.A6.CinemaBookingSystem.utility.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with payment cards
@RestController
public class PaymentCardController {
    private final PaymentCardRepository paymentCardRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public PaymentCardController(PaymentCardRepository paymentCardRepository, CustomerRepository customerRepository) {
        this.paymentCardRepository = paymentCardRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/paymentCards/{id}")
    public ResponseEntity<List<PaymentCard>> getPaymentCardsForUser(@PathVariable Long id) {
        // Get all payment cards for user
        List<PaymentCard> paymentCards = paymentCardRepository.findAllById(Collections.singleton(id));

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(paymentCards);
    }

    @PostMapping("/paymentCards") // Specify customerId in URL, booking in body
    public ResponseEntity<PaymentCard> createPaymentCard(@RequestParam Long customerId, @RequestBody PaymentCard paymentCard) {
        // Get existing customer
        var existingCustomer = customerRepository.findById(customerId);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Validate card
        if (!Utility.isValidCard(paymentCard.getCardNumber(), paymentCard.getExpirationDate())) {
            return ResponseEntity.badRequest().build(); // Invalid card
        }

        // Verify customer is under card limit
        if (!existingCustomer.get().canAddCard()) {
            return ResponseEntity.badRequest().build(); // Too many cards
        }

        // Encode card number
        String encodedCardNumber = Utility.encode(paymentCard.getCardNumber());
        paymentCard.setCardNumber(encodedCardNumber);

        var result = paymentCardRepository.save(paymentCard);
        existingCustomer.get().getPaymentCards().add(result);
        customerRepository.save(existingCustomer.get());

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/paymentCards/{id}")
    public ResponseEntity<PaymentCard> deletePaymentCard(@PathVariable("id") Long id) {
        Optional<PaymentCard> existingCard = paymentCardRepository.findById(id);
        if (existingCard.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        paymentCardRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}