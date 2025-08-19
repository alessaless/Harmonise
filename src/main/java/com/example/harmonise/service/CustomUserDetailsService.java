package com.example.harmonise.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.example.harmonise.entity.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato"));

        // Ruolo in base al tipo_utente
        String ruolo = "ROLE_USER"; // default
        if ("T".equalsIgnoreCase(u.getTipoUtente())) {
            ruolo = "ROLE_TUTOR";
        } else if ("B".equalsIgnoreCase(u.getTipoUtente())) {
            ruolo = "ROLE_BAMBINO";
        }

        Collection<? extends GrantedAuthority> auths =
                Collections.singletonList(new SimpleGrantedAuthority(ruolo));

        return new org.springframework.security.core.userdetails.User(
                (u.getEmail() != null ? u.getEmail() : u.getCodice()),
                u.getPassword(),
                auths
        );
    }
}
