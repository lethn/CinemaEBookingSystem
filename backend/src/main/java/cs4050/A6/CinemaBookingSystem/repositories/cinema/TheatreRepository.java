package cs4050.A6.CinemaBookingSystem.repositories.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheatreRepository extends JpaRepository<Theatre, Long> {
    // Default methods inherited...

    // Custom methods
}
