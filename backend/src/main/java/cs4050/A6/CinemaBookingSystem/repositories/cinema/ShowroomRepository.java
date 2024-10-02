package cs4050.A6.CinemaBookingSystem.repositories.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Promotion;
import cs4050.A6.CinemaBookingSystem.models.cinema.Showroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowroomRepository extends JpaRepository<Showroom, Long> {
    // Default methods inherited...

    // Custom methods
}
