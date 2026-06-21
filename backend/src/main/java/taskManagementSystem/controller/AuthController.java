package taskManagementSystem.controller;

import taskManagementSystem.dto.JwtResponse;
import taskManagementSystem.dto.LoginRequest;
import taskManagementSystem.entity.User;
import taskManagementSystem.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import taskManagementSystem.jwt.JwtUtil;
import org.springframework.security.core.Authentication;
import taskManagementSystem.repository.UserRepository;


@RestController
@RequestMapping("/auth")

public class AuthController {
    
    @Autowired
private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {

    try {
        User savedUser = authService.signup(user);
        return ResponseEntity.ok(savedUser);

    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
    
    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest request) {
  
        User user = authService.login(request.getEmail(), request.getPassword());
        String token = JwtUtil.generateToken(user.getEmail(),user.getRole());
        //return JwtUtil.generateToken(user.getEmail());
        

        return new JwtResponse(
            token,
            user.getRole()
        );
    }

    @GetMapping("/me")
        public User getCurrentUser(Authentication authentication) {
            return userRepository
                    .findByEmail(authentication.getName())
                    .orElseThrow();
        }
    
}
