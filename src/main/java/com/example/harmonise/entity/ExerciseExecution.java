package com.example.harmonise.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercises_execution")
public class ExerciseExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_esecuzione")
    private Long idEsecuzione;

    @Column(name = "id_esercizio")
    private Long idEsercizio;

    @Column(name = "bambino", nullable = false)
    private Long bambino; // riferimento all'utente bambino

    @Column(name = "numero_errori")
    private Integer numeroErrori;

    @Column(name = "terminato", length = 2)
    private String terminato;

    @Column(name = "data_esecuzione")
    private LocalDateTime dataEsecuzione;

    public ExerciseExecution() {}

    public ExerciseExecution(Long esecuzione, Long bambino, Long esercizio, Integer numeroErrori, String terminato, LocalDateTime dataEsecuzione) {
        this.idEsecuzione = esecuzione;
        this.idEsercizio = esercizio;
        this.bambino = bambino;
        this.numeroErrori = numeroErrori;
        this.terminato = terminato;
        this.dataEsecuzione = dataEsecuzione;
    }

    public Long getIdEsercizio() { return idEsercizio; }
    public void setIdEsercizio(Long idEsercizio) { this.idEsercizio = idEsercizio; }

    public Long getBambino() { return bambino; }
    public void setBambino(Long bambino) { this.bambino = bambino; }

    public Integer getNumeroErrori() { return numeroErrori; }
    public void setNumeroErrori(Integer numeroErrori) { this.numeroErrori = numeroErrori; }

    public String getTerminato() { return terminato; }
    public void setTerminato(String terminato) { this.terminato = terminato; }

    public LocalDateTime getDataEsecuzione() { return dataEsecuzione; }
    public void setDataEsecuzione(LocalDateTime dataEsecuzione) { this.dataEsecuzione = dataEsecuzione; }

    public Long getIdEsecuzione() {
        return idEsecuzione;
    }

    public void setIdEsecuzione(Long idEsecuzione) {
        this.idEsecuzione = idEsecuzione;
    }
}
