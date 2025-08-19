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
    private String tipoUtente;
    private Long tutorAssociato;

    // --- COSTRUTTORI ---
    public UserDto() {}

    public UserDto(Long id, String codice, String email, String nome, String cognome,
                   String dataNascita, String genere, String tipoUtente, Long tutorAssociato) {
        this.id = id;
        this.codice = codice;
        this.email = email;
        this.nome = nome;
        this.cognome = cognome;
        this.dataNascita = dataNascita;
        this.genere = genere;
        this.tipoUtente = tipoUtente;
        this.tutorAssociato = tutorAssociato;
    }

    // --- GETTER ---
    public Long getId() { return id; }
    public String getCodice() { return codice; }
    public String getEmail() { return email; }
    public String getNome() { return nome; }
    public String getCognome() { return cognome; }
    public String getDataNascita() { return dataNascita; }
    public String getGenere() { return genere; }
    public String getTipoUtente() { return tipoUtente; }
    public Long getTutorAssociato() { return tutorAssociato; }

    // --- SETTER ---
    public void setId(Long id) { this.id = id; }
    public void setCodice(String codice) { this.codice = codice; }
    public void setEmail(String email) { this.email = email; }
    public void setNome(String nome) { this.nome = nome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    public void setDataNascita(String dataNascita) { this.dataNascita = dataNascita; }
    public void setGenere(String genere) { this.genere = genere; }
    public void setTipoUtente(String tipoUtente) { this.tipoUtente = tipoUtente; }
    public void setTutorAssociato(Long tutorAssociato) { this.tutorAssociato = tutorAssociato; }

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
        dto.setTipoUtente(u.getTipoUtente());          // <-- aggiunto
        dto.setTutorAssociato(u.getTutorAssociato());  // <-- aggiunto
        return dto;
    }
}
