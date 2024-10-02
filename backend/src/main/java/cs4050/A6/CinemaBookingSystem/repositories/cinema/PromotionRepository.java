package cs4050.A6.CinemaBookingSystem.repositories.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Promotion;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    // Default methods inherited...

    // Custom methods
}

