package cs4050.A6.CinemaBookingSystem.security;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Represents object for a login request -- passed as JSON body in login request
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
