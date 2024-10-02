package cs4050.A6.CinemaBookingSystem.controllers.user;

import cs4050.A6.CinemaBookingSystem.models.user.Admin;
import cs4050.A6.CinemaBookingSystem.repositories.user.AdminRepository;
import cs4050.A6.CinemaBookingSystem.security.LoginRequest;
import cs4050.A6.CinemaBookingSystem.utility.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// CORS Configuration for specific endpoint (front-end)
@CrossOrigin(origins = "http://localhost:3000")

// Setups various public-facing REST endpoints for interacting with admin accounts
@RestController
public class AdminController {
    private final AdminRepository adminRepository;

    @Autowired
    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAdmins() {
        List<Admin> admins = adminRepository.findAll();

        // Return successful response with JSON encoded body
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/admins/login")
    public ResponseEntity<Admin> checkAdminLogin(@RequestBody LoginRequest loginRequest) {
        Optional<Admin> existingAdmin = adminRepository.findByEmail(loginRequest.getEmail());
        if (existingAdmin.isEmpty()) {
            return ResponseEntity.notFound().build(); // Does not exist
        }

        // Validate password against saved
        if (!Utility.isValidPassword(loginRequest.getPassword(), existingAdmin.get().getPassword())) {
            return ResponseEntity.badRequest().build(); // Invalid password
        }

        return ResponseEntity.ok(existingAdmin.get());
    }

    @PostMapping("/admins")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        // Encode password
        String encodedPassword = Utility.encodePassword(admin.getPassword());
        admin.setPassword(encodedPassword);

        adminRepository.save(admin);

        // Return successful response with JSON encoded object created
        return ResponseEntity.ok(admin);
    }
}