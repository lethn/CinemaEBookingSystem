package cs4050.A6.CinemaBookingSystem.repositories.user;

import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Default methods inherited...

    // Custom methods
    Optional<Customer> findByEmail(String email);
}
