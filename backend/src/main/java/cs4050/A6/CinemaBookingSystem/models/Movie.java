package cs4050.A6.CinemaBookingSystem.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

// Entity class to model a movie in the database
@Entity
@Table(name = "movie") // Table name
@Data // Defines toString, equals/hashcode, getters, setters, and required args constructor
public class Movie {
    @Id
    @GeneratedValue
    private Long id; // Auto-generated unique identifier

    // It might be easier to store dates and times of the movie showings directly in the database for searching reasons.
    // An instance of the Movie class should have info that is the same no matter the showing time.
    private String title;
    private String category;
    @ElementCollection(targetClass = String.class) // Annotation required to prevent compile-error
    private List<String> cast;
    private String director;
    private String producer;
    private String synopsis;
    private String trailer;
    private String picture;

    // All basic methods (getters, setters, etc.) automatically defined by Lombok
}
