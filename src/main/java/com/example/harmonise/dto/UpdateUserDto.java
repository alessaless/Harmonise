package com.example.harmonise.dto;

public class UpdateUserDto {
    private String nome;
    private String cognome;
    private String dataNascita;
    private String email;
    private String password;
    private String genere;

    // --- GETTER & SETTER ---
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }

    public String getDataNascita() { return dataNascita; }
    public void setDataNascita(String dataNascita) { this.dataNascita = dataNascita; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGenere() { return genere; }
    public void setGenere(String genere) { this.genere = genere; }
}
