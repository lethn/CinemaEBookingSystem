package cs4050.A6.CinemaBookingSystem.controllers.user;

import cs4050.A6.CinemaBookingSystem.models.cinema.Booking;
import cs4050.A6.CinemaBookingSystem.models.response.BadRequestError;
import cs4050.A6.CinemaBookingSystem.models.user.Admin;
import cs4050.A6.CinemaBookingSystem.models.user.Customer;
import cs4050.A6.CinemaBookingSystem.models.user.CustomerState;
import cs4050.A6.CinemaBookingSystem.models.user.UserType;
import cs4050.A6.CinemaBookingSystem.repositories.user.AdminRepository;
import cs4050.A6.CinemaBookingSystem.repositories.user.CustomerRepository;
import cs4050.A6.CinemaBookingSystem.security.LoginRequest;
import cs4050.A6.CinemaBookingSystem.services.EmailService;
import cs4050.A6.CinemaBookingSystem.utility.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    @GetMapping("/customers/bookings") // Get all showings for a particular movie
    public ResponseEntity<List<Booking>> getBookingsForCustomer(@RequestParam Long customerId) {
        Optional<Customer> existingCustomer = customerRepository.findById(customerId);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Return list of showings for this movie
        return ResponseEntity.ok(existingCustomer.get().getBookings());
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

    @GetMapping("/customers/verify")
    // Verifies user account -- called by frontend when user inputs email and token into verification page
    public ResponseEntity<Customer> verifyCustomerAccount(@RequestParam String email, @RequestParam String token) {
        // Find customer
        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
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

    @PostMapping("/customers/password-reset/generate")
    // Generates a password reset code and sends this to the user via email
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

    @PostMapping("/customers/password-reset/reset")
    // Resets the user's password to the new password, assuming token is valid
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

    @PostMapping("/customers")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        // Encode password
        String encodedPassword = Utility.encode(customer.getPassword());
        customer.setPassword(encodedPassword);

        customerRepository.save(customer);

        // Generate verification code
        String token = Utility.generateUniqueToken();

        // Store code
        customer.setVerificationCode(token);
        var result = customerRepository.save(customer);

        // Send email
        emailService.sendVerificationEmail(customer.getEmail(), token);

        return ResponseEntity.ok(result);
    }

    @PatchMapping("/customers/{id}") // Updates specified fields on existing customer object
    // Allows updating of an existing customer via a patch request -- only contains fields that are user-updatable
    // Any field that is null (meaning wasn't included in JSON body) is assumed to not be changing
    public ResponseEntity<Customer> updateCustomer(@PathVariable("id") Long id, @RequestBody Map<String, Object> patch) {
        Optional<Customer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Extract non-null fields
        for (String key : patch.keySet()) {
            Object value = patch.get(key);

            if (value == null) {
                continue;
            }

            switch (key) {
                case "firstName" -> existingCustomer.get().setFirstName((String) value);
                case "lastName" -> existingCustomer.get().setLastName((String) value);
                case "password" -> {
                    String encodedPassword = Utility.encode((String) value);
                    existingCustomer.get().setPassword(encodedPassword);
                }
                case "subscribedToPromotions" -> existingCustomer.get().setSubscribedToPromotions((boolean) value);
                case "streetAddress" -> existingCustomer.get().setStreetAddress((String) value);
                case "city" -> existingCustomer.get().setCity((String) value);
                case "state" -> existingCustomer.get().setState((String) value);
                case "postalCode" -> existingCustomer.get().setPostalCode((String) value);
                // Convert into corresponding enum value
                case "status" -> existingCustomer.get().setStatus(CustomerState.valueOf(((String) value).toUpperCase()));
            }
        }

        var result = customerRepository.save(existingCustomer.get());

        emailService.sendProfileChangesEmail(existingCustomer.get().getEmail());//hopefully this sends a changes email
        return ResponseEntity.ok(result);
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

    @GetMapping("/admins/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(admin.get());
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

    @PostMapping("/convert-customer-to-admin") // Converts a customer into an admin
    public ResponseEntity<Admin> convertCustomerToAdmin(@RequestParam Long customerId) {
        Optional<Customer> existingCustomer = customerRepository.findById(customerId);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Copy data
        Admin admin = new Admin();
        admin.setFirstName(existingCustomer.get().getFirstName());
        admin.setLastName(existingCustomer.get().getLastName());
        admin.setEmail(existingCustomer.get().getEmail());
        admin.setPassword(existingCustomer.get().getPassword());
        admin.setUserType(UserType.ADMIN);

        // Delete old entry and save new one
        customerRepository.deleteById(customerId);
        adminRepository.save(admin);

        return ResponseEntity.ok(admin);
    }
}