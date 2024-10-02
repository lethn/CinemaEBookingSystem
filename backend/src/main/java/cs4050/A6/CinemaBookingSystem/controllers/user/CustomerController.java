package cs4050.A6.CinemaBookingSystem.controllers.user;

import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with customer accounts
@RestController
public class CustomerController {
    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getCustomers() {
        // Get all movies
        List<Customer> movies = customerRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(movies);
    }

    @PostMapping("/customers")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        // Create customer in database
        customerRepository.save(customer);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(customer);
    }
}