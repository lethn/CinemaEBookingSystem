package cs4050.A6.CinemaBookingSystem.repositories.user;

import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// Default methods inherited; custom methods must be defined
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);

    List<Customer> findAllBySubscribedToPromotions(boolean subscribedToPromotions);
}
