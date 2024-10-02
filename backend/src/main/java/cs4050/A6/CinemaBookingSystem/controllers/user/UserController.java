package cs4050.A6.CinemaBookingSystem.controllers.user;

import cs4050.A6.CinemaBookingSystem.models.user.Admin;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import cs4050.A6.CinemaBookingSystem.models.user.CustomerState;
import cs4050.A6.CinemaBookingSystem.models.user.User;
import cs4050.A6.CinemaBookingSystem.repositories.user.AdminRepository;
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

// Setups various public-facing REST endpoints for interacting with admin and customer accounts
@RestController
public class UserController {
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    @Autowired
    public UserController(CustomerRepository customerRepository, AdminRepository adminRepository) {
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getCustomers() {
        List<Customer> customers = customerRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(customer.get());
    }

    @PostMapping("/login") // Login for both customers and admins -- checks for admin account first
    public ResponseEntity<User> checkLogin(@RequestBody LoginRequest loginRequest) {
        // Check if admin account
        Optional<Admin> existingAdmin = adminRepository.findByEmail(loginRequest.getEmail());
        if (existingAdmin.isPresent()) {
            // Admin account, now validate password
            if (!Utility.isValidPassword(loginRequest.getPassword(), existingAdmin.get().getPassword())) {
                return ResponseEntity.badRequest().build(); // Invalid password
            } else {
                return ResponseEntity.ok(existingAdmin.get());
            }
        }

        // Not an admin, so check for customer account
        Optional<Customer> existingCustomer = customerRepository.findByEmail(loginRequest.getEmail());
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Neither type of account exists
        }

        // Verify customer is not inactive/not suspended
        var customerState = existingCustomer.get().getStatus();
        if (customerState == CustomerState.INACTIVE || customerState == CustomerState.SUSPENDED) {
            return ResponseEntity.badRequest().build(); // Invalid customer account
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

    @PostMapping("/customers") // Creates or updates existing customer object
    public ResponseEntity<Customer> saveCustomer(@RequestBody Customer customer) {
        // Encode password
        String encodedPassword = Utility.encodePassword(customer.getPassword());
        customer.setPassword(encodedPassword);

        customerRepository.save(customer);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(customer);
    }

    // Admin specific functionality
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAdmins() {
        List<Admin> admins = adminRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/admins") // Creates or updates existing admin object
    public ResponseEntity<Admin> saveAdmin(@RequestBody Admin admin) {
        // Encode password
        String encodedPassword = Utility.encodePassword(admin.getPassword());
        admin.setPassword(encodedPassword);

        adminRepository.save(admin);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(admin);
    }
}