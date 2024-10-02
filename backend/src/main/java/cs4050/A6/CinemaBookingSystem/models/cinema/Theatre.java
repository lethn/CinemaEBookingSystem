package cs4050.A6.CinemaBookingSystem.models.cinema;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Theatre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "theatre_id")
    private Long id;

    // Optional fields upon creation
    @OneToMany(cascade = CascadeType.ALL) // Must include cascade to persist changes
    private List<Showroom> showrooms = new ArrayList<>();
}