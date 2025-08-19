package com.example.harmonise.dto;

import com.example.harmonise.entity.Exercise;

public class ExerciseDto {
    private Long idEsercizio;
    private String nomeEsercizio;

    public ExerciseDto() {}

    public ExerciseDto(Long idEsercizio, String nomeEsercizio) {
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

    // Factory method
    public static ExerciseDto from(Exercise e) {
        if (e == null) return null;
        return new ExerciseDto(e.getIdEsercizio(), e.getNomeEsercizio());
    }
}
