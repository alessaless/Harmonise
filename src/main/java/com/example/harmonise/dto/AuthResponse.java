package com.example.harmonise.dto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    // getter e setter
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
