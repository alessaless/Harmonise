package com.example.harmonise.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.example.harmonise.entity.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    // 🔧 Costruttore manuale per l’iniezione di UserService
    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato"));

        // Ruoli non gestiti qui: lista vuota
        Collection<? extends GrantedAuthority> auths = Collections.emptyList();

        return new org.springframework.security.core.userdetails.User(
                (u.getEmail() != null ? u.getEmail() : u.getCodice()),
                u.getPassword(),
                auths
        );
    }
}
