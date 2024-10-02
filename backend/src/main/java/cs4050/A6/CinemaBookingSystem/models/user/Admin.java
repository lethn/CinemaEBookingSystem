package cs4050.A6.CinemaBookingSystem.models.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "admin")
@Data
@EqualsAndHashCode(callSuper = true) // Specifies to call super implementation
public class Admin extends User {

    // TO DO: Define methods
}
