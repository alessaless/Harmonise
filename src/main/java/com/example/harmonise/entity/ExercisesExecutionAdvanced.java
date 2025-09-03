package com.example.harmonise.entity;
import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "exercises_execution_advanced")
public class ExercisesExecutionAdvanced {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_esecuzione")
    private Long id;

    @Column(name = "bambino", nullable = false)
    private Long bambino;

    @Column(name = "id_esercizio", nullable = false)
    private Long idEsercizio;

    @Column(name = "numero_errori")
    private Integer numeroErrori;

    @Column(name = "terminato")
    private String terminato;

    @Column(name = "data_esecuzione")
    private Date dataEsecuzione;

    @Column(name = "livelli_completati")
    private Integer livelliCompletati;

    @Column(name = "averaged_timespent")
    private Integer averagedTimespent;

    @Column(name = "total_num_problems")
    private Integer totalNumProblems;

    @Column(name = "num_topics")
    private Integer numTopics;

    @Column(name = "averaged_complexity")
    private Integer averagedComplexity;

    @Column(name = "max_complexity")
    private Integer maxComplexity;

    @Column(name = "min_complexity")
    private Integer minComplexity;

    @Column(name = "averaged_points_earned_session")
    private Integer averagedPointsEarnedSession;


    public ExercisesExecutionAdvanced() {}

    public ExercisesExecutionAdvanced(Long id, Long bambino, Long idEsercizio, Integer numeroErrori, String terminato, Date dataEsecuzione, Integer livelliCompletati, Integer averagedTimespent, Integer totalNumProblems, Integer numTopics, Integer averagedComplexity, Integer maxComplexity, Integer minComplexity, Integer averagedPointsEarnedSession) {
        this.id = id;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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


}
