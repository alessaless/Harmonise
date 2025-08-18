package com.example.harmonise.controller;

import com.example.harmonise.config.JwtService;
import com.example.harmonise.dto.*;
import com.example.harmonise.entity.User;
import com.example.harmonise.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserService userService;

    // 🔧 Costruttore esplicito (Spring lo userà per iniettare i bean)
    public AuthController(AuthenticationManager authManager, JwtService jwtService, UserService userService) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userService.findByUsername(req.getUsername())
                .orElseThrow();

        String subject = (user.getEmail() != null ? user.getEmail() : user.getCodice());
        String token = jwtService.generateToken(subject);

        return ResponseEntity.ok(new AuthResponse(token, UserDto.from(user)));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest req) {
        User user = userService.register(req);
        return ResponseEntity.ok(UserDto.from(user));
    }
}
