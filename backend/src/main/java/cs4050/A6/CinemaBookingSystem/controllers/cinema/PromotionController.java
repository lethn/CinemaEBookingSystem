package cs4050.A6.CinemaBookingSystem.controllers.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Promotion;
import cs4050.A6.CinemaBookingSystem.repositories.cinema.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with promotions
@RestController
public class PromotionController {
    private final PromotionRepository promotionRepository;

    @Autowired
    public PromotionController(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @GetMapping("/promotions")
    public ResponseEntity<List<Promotion>> getPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(promotions);
    }

    @GetMapping("/promotions/{promoCode}") // Returns the existing promotion if found, or an error if none exists
    public ResponseEntity<Promotion> validatePromotion(@PathVariable String promoCode) {
        var promotion = promotionRepository.findByPromoCode(promoCode);

        if (promotion.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        return ResponseEntity.ok(promotion.get());
    }

    @PostMapping("/promotions")
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        promotionRepository.save(promotion);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(promotion);
    }
}