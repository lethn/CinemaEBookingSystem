package cs4050.A6.CinemaBookingSystem.models.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
// Represents the error object returned as JSON for a bad API call
public class BadRequestError {
    private String message;

    public BadRequestError(String message) {
        this.message = message;
    }
}
