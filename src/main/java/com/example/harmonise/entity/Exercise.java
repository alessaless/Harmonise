package com.example.harmonise.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_esercizio")
    private Long idEsercizio;

    @Column(name = "nome_esercizio", length = 100)
    private String nomeEsercizio;

    public Exercise() {}

    public Exercise(Long idEsercizio, String nomeEsercizio) {
        this.idEsercizio = idEsercizio;
        this.nomeEsercizio = nomeEsercizio;
    }

    public Long getIdEsercizio() {
        return idEsercizio;
    }

    public void setIdEsercizio(Long idEsercizio) {
        this.idEsercizio = idEsercizio;
    }

    public String getNomeEsercizio() {
        return nomeEsercizio;
    }

    public void setNomeEsercizio(String nomeEsercizio) {
        this.nomeEsercizio = nomeEsercizio;
    }
}
