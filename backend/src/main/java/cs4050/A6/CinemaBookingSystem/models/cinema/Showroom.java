package cs4050.A6.CinemaBookingSystem.models.cinema;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Column(nullable = false)
    @ElementCollection(targetClass = String.class)
    private List<String> seats;

    private String friendlyName;

    // Optional fields upon creation
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Show> shows = new ArrayList<>();
}