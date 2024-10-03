package cs4050.A6.CinemaBookingSystem.models.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Defines common user functionality for both admin and customer concrete classes
@MappedSuperclass // Allows inheritance by children from this base class in Spring
@Getter
@Setter
@NoArgsConstructor
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password; // Encoded using Spring Security Password Encoder during creation -- raw password passed
    @Column(nullable = false)
    private UserType userType;

    // TO DO: add non-null, unique annotations as needed -- add validation logic as needed (e.g., showing)
    // ADD @UniqueConstraint for composite key
    // Need validation logic in methods for some of this
    // Add logic to check seats
}
