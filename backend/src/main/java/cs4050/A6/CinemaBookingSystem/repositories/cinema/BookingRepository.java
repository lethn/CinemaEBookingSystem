package cs4050.A6.CinemaBookingSystem.repositories.cinema;

import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Book;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Default methods inherited...

    // Custom methods
}
