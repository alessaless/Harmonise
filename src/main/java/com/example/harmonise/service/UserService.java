package com.example.harmonise.service;

import java.util.Optional;

import com.example.harmonise.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.harmonise.entity.User;
import com.example.harmonise.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 🔧 Costruttore esplicito per l’iniezione
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User register(RegisterRequest req) {
        // controlla se email o codice già usati
        if (userRepository.findByUsername(req.getEmail()).isPresent()
                || userRepository.findByUsername(req.getCodice()).isPresent()) {
            throw new RuntimeException("Utente già esistente con questa email o codice");
        }

        User u = new User();
        u.setCodice(req.getCodice());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword())); // encode!
        u.setNome(req.getNome());
        u.setCognome(req.getCognome());
        u.setDataNascita(req.getDataNascita());
        u.setGenere(req.getGenere());

        return userRepository.save(u);
    }

    public boolean matchesPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
