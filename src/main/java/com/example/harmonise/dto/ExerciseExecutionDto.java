package com.example.harmonise.dto;

import com.example.harmonise.entity.ExerciseExecution;
import java.time.LocalDateTime;

public class ExerciseExecutionDto {
    private Long idEsercizio;
    private Long bambino;
    private Integer numeroErrori;
    private String terminato;
    private LocalDateTime dataEsecuzione;

    public ExerciseExecutionDto() {}

    public ExerciseExecutionDto(Long idEsercizio, Long bambino, Integer numeroErrori, String terminato, LocalDateTime dataEsecuzione) {
        this.idEsercizio = idEsercizio;
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

    // Factory method
    public static ExerciseExecutionDto from(ExerciseExecution e) {
        if (e == null) return null;
        return new ExerciseExecutionDto(
                e.getIdEsercizio(),
                e.getBambino(),
                e.getNumeroErrori(),
                e.getTerminato(),
                e.getDataEsecuzione()
        );
    }
}
