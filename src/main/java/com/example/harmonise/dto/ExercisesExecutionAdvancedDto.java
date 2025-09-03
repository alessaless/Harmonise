package com.example.harmonise.dto;

import com.example.harmonise.entity.ExercisesExecutionAdvanced;

import java.sql.Date;

public class ExercisesExecutionAdvancedDto {
    private Long idEsecuzione;
    private Long bambino;
    private Long idEsercizio;
    private Integer numeroErrori;
    private String terminato;
    private Date dataEsecuzione;
    private Integer livelliCompletati;
    private Integer averagedTimespent;
    private Integer totalNumProblems;
    private Integer numTopics;
    private Integer averagedComplexity;
    private Integer maxComplexity;
    private Integer minComplexity;
    private Integer averagedPointsEarnedSession;

    public ExercisesExecutionAdvancedDto() {
    }

    public ExercisesExecutionAdvancedDto(Long idEsecuzione, Long bambino, Long idEsercizio, Integer numeroErrori, String terminato, Date dataEsecuzione, Integer livelliCompletati, Integer averagedTimespent, Integer totalNumProblems, Integer numTopics, Integer averagedComplexity, Integer maxComplexity, Integer minComplexity, Integer averagedPointsEarnedSession) {
        this.idEsecuzione = idEsecuzione;
        this.bambino = bambino;
        this.idEsercizio = idEsercizio;
        this.numeroErrori = numeroErrori;
        this.terminato = terminato;
        this.dataEsecuzione = dataEsecuzione;
        this.livelliCompletati = livelliCompletati;
        this.averagedTimespent = averagedTimespent;
        this.totalNumProblems = totalNumProblems;
        this.numTopics = numTopics;
        this.averagedComplexity = averagedComplexity;
        this.maxComplexity = maxComplexity;
        this.minComplexity = minComplexity;
        this.averagedPointsEarnedSession = averagedPointsEarnedSession;
    }

    public Long getIdEsecuzione() {
        return idEsecuzione;
    }

    public void setIdEsecuzione(Long idEsecuzione) {
        this.idEsecuzione = idEsecuzione;
    }

    public Long getBambino() {
        return bambino;
    }

    public void setBambino(Long bambino) {
        this.bambino = bambino;
    }

    public Long getIdEsercizio() {
        return idEsercizio;
    }

    public void setIdEsercizio(Long idEsercizio) {
        this.idEsercizio = idEsercizio;
    }

    public Integer getNumeroErrori() {
        return numeroErrori;
    }

    public void setNumeroErrori(Integer numeroErrori) {
        this.numeroErrori = numeroErrori;
    }

    public String getTerminato() {
        return terminato;
    }

    public void setTerminato(String terminato) {
        this.terminato = terminato;
    }

    public Date getDataEsecuzione() {
        return dataEsecuzione;
    }

    public void setDataEsecuzione(Date dataEsecuzione) {
        this.dataEsecuzione = dataEsecuzione;
    }

    public Integer getLivelliCompletati() {
        return livelliCompletati;
    }

    public void setLivelliCompletati(Integer livelliCompletati) {
        this.livelliCompletati = livelliCompletati;
    }

    public Integer getAveragedTimespent() {
        return averagedTimespent;
    }

    public void setAveragedTimespent(Integer averagedTimespent) {
        this.averagedTimespent = averagedTimespent;
    }

    public Integer getTotalNumProblems() {
        return totalNumProblems;
    }

    public void setTotalNumProblems(Integer totalNumProblems) {
        this.totalNumProblems = totalNumProblems;
    }

    public Integer getNumTopics() {
        return numTopics;
    }

    public void setNumTopics(Integer numTopics) {
        this.numTopics = numTopics;
    }

    public Integer getAveragedComplexity() {
        return averagedComplexity;
    }

    public void setAveragedComplexity(Integer averagedComplexity) {
        this.averagedComplexity = averagedComplexity;
    }

    public Integer getMaxComplexity() {
        return maxComplexity;
    }

    public void setMaxComplexity(Integer maxComplexity) {
        this.maxComplexity = maxComplexity;
    }

    public Integer getMinComplexity() {
        return minComplexity;
    }

    public void setMinComplexity(Integer minComplexity) {
        this.minComplexity = minComplexity;
    }

    public Integer getAveragedPointsEarnedSession() {
        return averagedPointsEarnedSession;
    }

    public void setAveragedPointsEarnedSession(Integer averagedPointsEarnedSession) {
        this.averagedPointsEarnedSession = averagedPointsEarnedSession;
    }

    public static ExercisesExecutionAdvancedDto from(ExercisesExecutionAdvanced e) {
        if (e == null) {
            return null;
        }

        ExercisesExecutionAdvancedDto dto = new ExercisesExecutionAdvancedDto();
        dto.setIdEsecuzione(e.getId());
        dto.setBambino(e.getBambino());
        dto.setIdEsercizio(e.getIdEsercizio());
        dto.setNumeroErrori(e.getNumeroErrori());
        dto.setTerminato(e.getTerminato());
        dto.setDataEsecuzione(e.getDataEsecuzione());
        dto.setLivelliCompletati(e.getLivelliCompletati());
        dto.setAveragedTimespent(e.getAveragedTimespent());
        dto.setTotalNumProblems(e.getTotalNumProblems());
        dto.setNumTopics(e.getNumTopics());
        dto.setAveragedComplexity(e.getAveragedComplexity());
        dto.setMaxComplexity(e.getMaxComplexity());
        dto.setMinComplexity(e.getMinComplexity());
        dto.setAveragedPointsEarnedSession(e.getAveragedPointsEarnedSession());
        return dto;
    }
}