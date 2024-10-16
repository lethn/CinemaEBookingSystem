package cs4050.A6.CinemaBookingSystem.controllers.user;

import cs4050.A6.CinemaBookingSystem.models.response.BadRequestError;
import cs4050.A6.CinemaBookingSystem.models.user.Admin;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import cs4050.A6.CinemaBookingSystem.models.user.CustomerState;
import cs4050.A6.CinemaBookingSystem.models.user.User;
import cs4050.A6.CinemaBookingSystem.repositories.user.AdminRepository;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import cs4050.A6.CinemaBookingSystem.security.LoginRequest;
import cs4050.A6.CinemaBookingSystem.services.EmailService;
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
    private final EmailService emailService;

    @Autowired
    public UserController(CustomerRepository customerRepository, AdminRepository adminRepository, EmailService emailService) {
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
        this.emailService = emailService;
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
    // Use '?' to allow different return types
    public ResponseEntity<?> checkLogin(@RequestBody LoginRequest loginRequest) {
        // Check if admin account
        Optional<Admin> existingAdmin = adminRepository.findByEmail(loginRequest.getEmail());
        if (existingAdmin.isPresent()) {
            // Admin account, now validate password
            if (!Utility.isValidPassword(loginRequest.getPassword(), existingAdmin.get().getPassword())) {
                return ResponseEntity.badRequest().body(new BadRequestError("Found admin account, but invalid password.")); // Invalid password
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
        if (customerState == CustomerState.INACTIVE) {
            return ResponseEntity.badRequest().body(new BadRequestError("Customer account is inactive. Please verify account prior to login."));
        } else if (customerState == CustomerState.SUSPENDED) {
            ResponseEntity.badRequest().body(new BadRequestError("Customer account is suspended. Please contact an admin to enable account access."));
        }

        // Validate password against saved
        if (!Utility.isValidPassword(loginRequest.getPassword(), existingCustomer.get().getPassword())) {
            return ResponseEntity.badRequest().body(new BadRequestError("Found customer account, but invalid password."));
        }

        // Return successful response with corresponding customer object
        return ResponseEntity.ok(existingCustomer.get());
    }

    @GetMapping("/customers/verify") // Verifies user account -- called when user clicks on email
    public ResponseEntity<Customer> verifyCustomerAccount(@RequestParam Long customerId, @RequestParam String token) {
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

        // Check code (verify not empty)
        if (!token.isEmpty() && !existingCustomer.get().getVerificationCode().equals(token)) {
            return ResponseEntity.badRequest().build();
        }

        existingCustomer.get().setStatus(CustomerState.ACTIVE);
        existingCustomer.get().setVerificationCode(""); // Reset code
        var result = customerRepository.save(existingCustomer.get());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/customers/password-reset/generate") // Generates a password reset code and sends this to the user via email
    public ResponseEntity<?> generatePasswordReset(@RequestParam String email) {
        // Find customer
        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Customer does not exist
        }

        // Check if inactive or suspended
        var customerState = existingCustomer.get().getStatus();
        if (customerState == CustomerState.INACTIVE) {
            return ResponseEntity.badRequest().body(new BadRequestError("Customer account is inactive. Please verify account prior to login."));
        } else if (customerState == CustomerState.SUSPENDED) {
            ResponseEntity.badRequest().body(new BadRequestError("Customer account is suspended. Please contact an admin to enable account access."));
        }

        // Generate reset code
        String token = Utility.generateUniqueToken();

        // Store code
        existingCustomer.get().setPasswordResetCode(token);
        var result = customerRepository.save(existingCustomer.get());

        // Send email
        emailService.sendPasswordResetEmail(existingCustomer.get().getEmail(), token);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/customers/password-reset/reset") // Resets the user's password to the new password, assuming token is valid
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String token, @RequestParam String newPassword) {
        // TO DO: MOVE TO OWN METHOD
        // Find customer
        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Check if inactive or suspended
        var customerState = existingCustomer.get().getStatus();
        if (customerState == CustomerState.INACTIVE) {
            return ResponseEntity.badRequest().body(new BadRequestError("Customer account is inactive. Please verify account prior to login."));
        } else if (customerState == CustomerState.SUSPENDED) {
            ResponseEntity.badRequest().body(new BadRequestError("Customer account is suspended. Please contact an admin to enable account access."));
        }

        // Check reset code (verify not empty code)
        if (!token.isEmpty() && !existingCustomer.get().getPasswordResetCode().equals(token)) {
            return ResponseEntity.badRequest().build();
        }

        // Encrypt and store new password
        String encodedPassword = Utility.encode(newPassword);
        existingCustomer.get().setPassword(encodedPassword);

        existingCustomer.get().setPasswordResetCode(""); // Reset code
        var result = customerRepository.save(existingCustomer.get());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/customers") // Creates or updates existing customer object
    public ResponseEntity<Customer> saveCustomer(@RequestBody Customer customer) {
        // Encode password
        String encodedPassword = Utility.encode(customer.getPassword());
        customer.setPassword(encodedPassword);

        customerRepository.save(customer);

        // Generate verification code
        String token = Utility.generateUniqueToken();

        // Store code
        customer.setVerificationCode(token);
        customerRepository.save(customer);

        // Send email
        emailService.sendVerificationEmail(customer.getEmail(), token);

        return ResponseEntity.ok(customer);
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Customer> deleteCustomer(@PathVariable("id") Long id) {
        Optional<Customer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        customerRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAdmins() {
        List<Admin> admins = adminRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/admins") // Creates or updates existing admin object
    public ResponseEntity<Admin> saveAdmin(@RequestBody Admin admin) {
        // Encode password
        String encodedPassword = Utility.encode(admin.getPassword());
        admin.setPassword(encodedPassword);

        adminRepository.save(admin);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(admin);
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<Admin> deleteAdmin(@PathVariable("id") Long id) {
        Optional<Admin> existingAdmin = adminRepository.findById(id);
        if (existingAdmin.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        adminRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}