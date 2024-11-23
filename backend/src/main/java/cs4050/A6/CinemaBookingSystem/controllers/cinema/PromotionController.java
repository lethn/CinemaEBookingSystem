package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Promotion;
import cs4050.A6.CinemaBookingSystem.models.response.BadRequestError;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.PromotionRepository;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import cs4050.A6.CinemaBookingSystem.services.EmailService;
import cs4050.A6.CinemaBookingSystem.services.GmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with promotions
@RestController
public class PromotionController {
    private final PromotionRepository promotionRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    @Autowired
    public PromotionController(PromotionRepository promotionRepository, CustomerRepository customerRepository, EmailService emailService) {
        this.promotionRepository = promotionRepository;
        this.customerRepository = customerRepository;
        this.emailService = emailService;
    }

    @GetMapping("/promotions")
    public ResponseEntity<List<Promotion>> getPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(promotions);
    }

    @GetMapping("/promotions/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        Optional<Promotion> promotion = promotionRepository.findById(id);
        if (promotion.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        return ResponseEntity.ok(promotion.get());
    }

    @GetMapping("/promotions/validate/{promoCode}")
    // Returns the existing promotion if found, or an error if none exists
    public ResponseEntity<Promotion> validatePromotion(@PathVariable String promoCode) {
        var promotion = promotionRepository.findByPromoCode(promoCode);

        if (promotion.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        return ResponseEntity.ok(promotion.get());
    }

    @PostMapping("/promotions")
    public ResponseEntity<?> createPromotion(@RequestBody Promotion promotion) {
        // Check for duplicates
        var duplicate = promotionRepository.findByPromoCode(promotion.getPromoCode());
        if (duplicate.isPresent()) {
            return ResponseEntity.badRequest().body(new BadRequestError("Duplicate promotion code. Please enter a unique promotion code and try again."));
        }

        promotionRepository.save(promotion);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(promotion);
    }

    @DeleteMapping("/promotions/{id}")
    public ResponseEntity<Promotion> deletePromotion(@PathVariable("id") Long id) {
        Optional<Promotion> existingPromotion = promotionRepository.findById(id);
        if (existingPromotion.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        promotionRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/promotions/send-promotion")
    public ResponseEntity<Promotion> sendPromotionToSubscribers(@RequestParam Long promotionId) {
        var promotion = promotionRepository.findById(promotionId);
        if (promotion.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        List<Customer> subscribers = customerRepository.findAllBySubscribedToPromotions(true);

        // Send out promotion to each subscriber
        for (var subscriber : subscribers) {
            emailService.sendPromotionEmail(subscriber.getEmail(), promotion.get());
        }

        // Update modifiability status of promotion
        promotion.get().setModifiable(false);
        promotionRepository.save(promotion.get());

        return ResponseEntity.ok().build();
    }
}