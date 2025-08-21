package com.example.harmonise.dto;

import com.example.harmonise.entity.ExerciseExecution;
import java.time.LocalDateTime;

public class ExerciseExecutionDto {
    private Long idEsecuzione;
    private Long idEsercizio;
    private Long bambino;
    private Integer numeroErrori;
    private String terminato;
    private LocalDateTime dataEsecuzione;
    private int livelliCompletati;

    public ExerciseExecutionDto() {}

    public ExerciseExecutionDto(Long idEsecuzione, Long idEsercizio, Long bambino, Integer numeroErrori, String terminato, LocalDateTime dataEsecuzione, int livelliCompletati) {
        this.idEsecuzione = idEsecuzione;
        this.idEsercizio = idEsercizio;
        this.bambino = bambino;
        this.numeroErrori = numeroErrori;
        this.terminato = terminato;
        this.dataEsecuzione = dataEsecuzione;
        this.livelliCompletati = livelliCompletati;
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

    public int getLivelliCompletati() {
        return livelliCompletati;
    }

    public void setLivelliCompletati(int livelliCompletati) {
        this.livelliCompletati = livelliCompletati;
    }

    // Factory method
    public static ExerciseExecutionDto from(ExerciseExecution e) {
        if (e == null) return null;
        return new ExerciseExecutionDto(
                e.getIdEsecuzione(),
                e.getIdEsercizio(),
                e.getBambino(),
                e.getNumeroErrori(),
                e.getTerminato(),
                e.getDataEsecuzione(),
                e.getLivelliCompletati()
        );
    }
}
