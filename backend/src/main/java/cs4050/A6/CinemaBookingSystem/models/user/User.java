package cs4050.A6.CinemaBookingSystem.models.user;

import jakarta.persistence.*;
import lombok.Data;

// Defines common user functionality for both admin and customer concrete classes
@MappedSuperclass // Allows inheritance by children from this base class in Spring
@Data // Defines standard methods and constructors
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String passwordEncoding; // Encoded using Spring Security Password Encoder
}
