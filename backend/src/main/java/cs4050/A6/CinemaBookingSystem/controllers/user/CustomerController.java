package cs4050.A6.CinemaBookingSystem.controllers.user;

import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import cs4050.A6.CinemaBookingSystem.models.user.CustomerState;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import cs4050.A6.CinemaBookingSystem.security.LoginRequest;
import cs4050.A6.CinemaBookingSystem.utility.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
        List<Customer> customers = customerRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(customers);
    }

    @PostMapping("/customers/login")
    public ResponseEntity<Customer> checkCustomerLogin(@RequestBody LoginRequest loginRequest) {
        // Find customer
        Optional<Customer> existingCustomer = customerRepository.findByEmail(loginRequest.getEmail());
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Verify customer is not inactive/not suspended
        var customerState = existingCustomer.get().getStatus();
        if (customerState == CustomerState.INACTIVE || customerState == CustomerState.SUSPENDED) {
            return ResponseEntity.badRequest().build(); // Invalid account
        }

        // Validate password against saved
        if (!Utility.isValidPassword(loginRequest.getPassword(), existingCustomer.get().getPassword())) {
            return ResponseEntity.badRequest().build(); // Invalid password
        }

        // Return successful response with corresponding customer object
        return ResponseEntity.ok(existingCustomer.get());
    }

    @PostMapping("/customers/verify")
    public ResponseEntity<Customer> verifyCustomerAccount(@RequestParam Long customerId) {
        // Find customer
        Optional<Customer> existingCustomer = customerRepository.findById(customerId);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Check if already verified or suspended
        var customerState = existingCustomer.get().getStatus();
        if (customerState == CustomerState.ACTIVE || customerState == CustomerState.SUSPENDED) {
            return ResponseEntity.badRequest().build();
        }

        existingCustomer.get().setStatus(CustomerState.ACTIVE);
        var result = customerRepository.save(existingCustomer.get());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/customers")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        // Encode password
        String encodedPassword = Utility.encodePassword(customer.getPassword());
        customer.setPassword(encodedPassword);

        // Create customer in database
        customerRepository.save(customer);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(customer);
    }
}