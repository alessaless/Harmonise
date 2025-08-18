package com.example.harmonise.dto;

public class RegisterRequest {
    private String codice;
    private String email;
    private String password;
    private String nome;
    private String cognome;
    private String dataNascita;
    private String genere;

    // --- COSTRUTTORE VUOTO ---
    public RegisterRequest() {}

    // --- COSTRUTTORE COMPLETO (opzionale) ---
    public RegisterRequest(String codice, String email, String password, String nome,
                           String cognome, String dataNascita, String genere) {
        this.codice = codice;
        this.email = email;
        this.password = password;
        this.nome = nome;
        this.cognome = cognome;
        this.dataNascita = dataNascita;
        this.genere = genere;
    }

    // --- GETTER ---
    public String getCodice() { return codice; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getNome() { return nome; }
    public String getCognome() { return cognome; }
    public String getDataNascita() { return dataNascita; }
    public String getGenere() { return genere; }

    // --- SETTER ---
    public void setCodice(String codice) { this.codice = codice; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setNome(String nome) { this.nome = nome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    public void setDataNascita(String dataNascita) { this.dataNascita = dataNascita; }
    public void setGenere(String genere) { this.genere = genere; }
}
