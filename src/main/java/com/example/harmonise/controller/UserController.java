package com.example.harmonise.controller;

import com.example.harmonise.dto.UpdateUserDto;
import com.example.harmonise.dto.UserDto;
import com.example.harmonise.entity.User;
import com.example.harmonise.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 🔧 Costruttore esplicito per dependency injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // dati dell'utente loggato
    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal UserDetails principal) {
        String username = principal.getUsername(); // è l'email (o codice) salvata nel token
        User user = userService.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(UserDto.from(user));
    }

    // opzionale: get by id (per admin)
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return userService.findById(id)
                .map(UserDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getChildren/{id}")
    public ResponseEntity<List<UserDto>> getChildrenByIdTutor(@PathVariable Long id) {
        List<UserDto> children = userService.getChildrenByTutorId(id);
        return ResponseEntity.ok(children);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<UserDto> updateChild(@PathVariable Long id,
                                               @RequestBody UpdateUserDto dto) {
        User updated = userService.updateChild(id, dto);
        return ResponseEntity.ok(UserDto.from(updated));
    }

}
