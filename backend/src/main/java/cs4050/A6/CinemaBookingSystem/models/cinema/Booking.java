package cs4050.A6.CinemaBookingSystem.models.cinema;

import com.fasterxml.jackson.annotation.JsonBackReference;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Ticket> tickets = new ArrayList<>();

    // TO DO: Figure out a way to include relevant info from showing in this so can display in order history
//    @ManyToOne
//    @JoinColumn(name="show_id", nullable = false)
//    private Show show;

    private String promoCode;
    private Integer discountPercentage; // E.g., 20 for 20% off -- 0 if N/A
    private Double totalCost; // Should be provided since user sees total before booking is created

//    // Move to different file
//    public void calculateTotalCost() {
//        double total = 0;
//        for (var ticket : tickets) {
//            // Calculate ticket cost based on type -- check values
//            switch (ticket.getType()) {
//                case ADULT -> total += 12;
//                case SENIOR -> total += 10;
//                case CHILD -> total += 8;
//            }
//        }
//
//        // Apply discount
//        int remaining = 1 - (discountPercentage / 100);
//        total *= remaining;
//
//        totalCost = total;
//    }
}
