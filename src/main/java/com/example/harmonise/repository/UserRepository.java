package com.example.harmonise.repository;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.harmonise.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByCodice(String codice);
    default Optional<User> findByUsername(String username) {
        // username = email oppure codice
        return username.contains("@") ? findByEmail(username) : findByCodice(username);
    }
}

