package com.example.harmonise.service;

import java.util.List;
import java.util.Optional;

import com.example.harmonise.dto.RegisterRequest;
import com.example.harmonise.dto.UserDto;
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
        // controlla se email già usata
        if (userRepository.findByUsername(req.getEmail()).isPresent()) {
            throw new RuntimeException("Utente già esistente con questa email");
        }

        // genera codice randomico unico a 5 cifre
        String codiceRandom;
        do {
            codiceRandom = String.format("%05d", new java.security.SecureRandom().nextInt(100000));
        } while (userRepository.findByCodice(codiceRandom).isPresent());

        User u = new User();
        u.setCodice(codiceRandom);
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setNome(req.getNome());
        u.setCognome(req.getCognome());
        u.setDataNascita(req.getDataNascita());
        u.setGenere(req.getGenere());

        u.setTipoUtente(req.getTipoUtente());
        if ("B".equals(req.getTipoUtente())) {
            u.setTutorAssociato(req.getTutorAssociato());
        } else {
            u.setTutorAssociato(null);
        }

        return userRepository.save(u);
    }

    public List<UserDto> getChildrenByTutorId(Long tutorId) {
        return userRepository.findByTutorAssociato(tutorId).stream()
                .filter(u -> "B".equals(u.getTipoUtente())) // solo bambini
                .map(UserDto::from)
                .toList();
    }


    public boolean matchesPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
