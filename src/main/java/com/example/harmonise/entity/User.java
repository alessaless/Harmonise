package com.example.harmonise.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users",
        indexes = {
                @Index(name="idx_users_email", columnList="email"),
                @Index(name="idx_users_codice", columnList="codice")
        })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "codice", nullable = false, length = 10, unique = true)
    private String codice;

    @Column(name = "email", length = 100, unique = true)
    private String email;

    @Column(name = "nome", length = 100)
    private String nome;

    @Column(name = "cognome", length = 100)
    private String cognome;

    @Column(name = "data_nascita", length = 100)
    private String dataNascita;

    @Column(name = "genere", length = 2)
    private String genere;

    @Column(name = "tipo_utente", length = 2)
    private String tipoUtente;

    @Column(name = "tutor_associato")
    private Long tutorAssociato;

    // --- GETTER & SETTER ---
    public Long getId() { return id; }
    public String getPassword() { return password; }
    public String getCodice() { return codice; }
    public String getEmail() { return email; }
    public String getNome() { return nome; }
    public String getCognome() { return cognome; }
    public String getDataNascita() { return dataNascita; }
    public String getGenere() { return genere; }
    public String getTipoUtente() { return tipoUtente; }
    public Long getTutorAssociato() { return tutorAssociato; }

    public void setId(Long id) { this.id = id; }
    public void setPassword(String password) { this.password = password; }
    public void setCodice(String codice) { this.codice = codice; }
    public void setEmail(String email) { this.email = email; }
    public void setNome(String nome) { this.nome = nome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    public void setDataNascita(String dataNascita) { this.dataNascita = dataNascita; }
    public void setGenere(String genere) { this.genere = genere; }
    public void setTipoUtente(String tipoUtente) { this.tipoUtente = tipoUtente; }
    public void setTutorAssociato(Long tutorAssociato) { this.tutorAssociato = tutorAssociato; }
}
