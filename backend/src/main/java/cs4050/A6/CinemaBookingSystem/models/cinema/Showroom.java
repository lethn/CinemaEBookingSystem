package cs4050.A6.CinemaBookingSystem.models.cinema;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Showroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showroom_id")
    private Long id;
    @ElementCollection(targetClass = String.class)
    private List<String> seats;

    // Optional fields upon creation
    @OneToMany(cascade = CascadeType.ALL)
    private List<Show> shows = new ArrayList<>();
}