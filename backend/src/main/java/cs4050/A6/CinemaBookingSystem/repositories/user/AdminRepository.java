package cs4050.A6.CinemaBookingSystem.repositories.user;

import cs4050.A6.CinemaBookingSystem.models.user.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Default methods inherited...

    // Custom methods
    Optional<Admin> findByEmail(String email);
}
