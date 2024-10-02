package cs4050.A6.CinemaBookingSystem.repositories.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    // Default methods inherited...

    // Custom methods
    // Searches for an existing promotion by promoCode
    Optional<Promotion> findByPromoCode(String promoCode);
}

