package com.example.harmonise.dto;

import com.example.harmonise.entity.User;

public class UserDto {
    private Long id;
    private String codice;
    private String email;
    private String nome;
    private String cognome;
    private String dataNascita;
    private String genere;

    // --- COSTRUTTORI ---
    public UserDto() {}

    public UserDto(Long id, String codice, String email, String nome, String cognome,
                   String dataNascita, String genere) {
        this.id = id;
        this.codice = codice;
        this.email = email;
        this.nome = nome;
        this.cognome = cognome;
        this.dataNascita = dataNascita;
        this.genere = genere;
    }

    // --- GETTER ---
    public Long getId() { return id; }
    public String getCodice() { return codice; }
    public String getEmail() { return email; }
    public String getNome() { return nome; }
    public String getCognome() { return cognome; }
    public String getDataNascita() { return dataNascita; }
    public String getGenere() { return genere; }

    // --- SETTER ---
    public void setId(Long id) { this.id = id; }
    public void setCodice(String codice) { this.codice = codice; }
    public void setEmail(String email) { this.email = email; }
    public void setNome(String nome) { this.nome = nome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    public void setDataNascita(String dataNascita) { this.dataNascita = dataNascita; }
    public void setGenere(String genere) { this.genere = genere; }

    // --- FACTORY METHOD ---
    public static UserDto from(User u) {
        if (u == null) return null;
        UserDto dto = new UserDto();
        dto.setId(u.getId());
        dto.setCodice(u.getCodice());
        dto.setEmail(u.getEmail());
        dto.setNome(u.getNome());
        dto.setCognome(u.getCognome());
        dto.setDataNascita(u.getDataNascita());
        dto.setGenere(u.getGenere());
        return dto;
    }
}
