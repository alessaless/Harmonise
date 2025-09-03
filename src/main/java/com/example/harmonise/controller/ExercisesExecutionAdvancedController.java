package com.example.harmonise.controller;

import com.example.harmonise.dto.ExercisesExecutionAdvancedDto;
import com.example.harmonise.entity.ExercisesExecutionAdvanced;
import com.example.harmonise.service.ExercisesExecutionAdvancedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/execution/advanced")
public class ExercisesExecutionAdvancedController {

    private final ExercisesExecutionAdvancedService service;

    @Autowired
    public ExercisesExecutionAdvancedController(ExercisesExecutionAdvancedService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ExercisesExecutionAdvanced> saveExecution(@RequestBody ExercisesExecutionAdvancedDto executionDTO) {
        ExercisesExecutionAdvanced execution = convertToEntity(executionDTO);
        ExercisesExecutionAdvanced savedExecution = service.save(execution);
        return new ResponseEntity<>(savedExecution, HttpStatus.CREATED);
    }

    @GetMapping("/byBambino/{bambinoId}")
    public ResponseEntity<List<ExercisesExecutionAdvanced>> getExecutionsByBambino(@PathVariable Long bambinoId) {
        List<ExercisesExecutionAdvanced> executions = service.getByBambino(bambinoId);
        return new ResponseEntity<>(executions, HttpStatus.OK);
    }

    private ExercisesExecutionAdvanced convertToEntity(ExercisesExecutionAdvancedDto dto) {
        ExercisesExecutionAdvanced entity = new ExercisesExecutionAdvanced();
        entity.setBambino(dto.getBambino());
        entity.setIdEsercizio(dto.getIdEsercizio());
        entity.setNumeroErrori(dto.getNumeroErrori());
        entity.setTerminato(dto.getTerminato());
        entity.setDataEsecuzione(dto.getDataEsecuzione());
        entity.setLivelliCompletati(dto.getLivelliCompletati());
        entity.setAveragedTimespent(dto.getAveragedTimespent());
        entity.setTotalNumProblems(dto.getTotalNumProblems());
        entity.setNumTopics(dto.getNumTopics());
        entity.setAveragedComplexity(dto.getAveragedComplexity());
        entity.setMaxComplexity(dto.getMaxComplexity());
        entity.setMinComplexity(dto.getMinComplexity());
        entity.setAveragedPointsEarnedSession(dto.getAveragedPointsEarnedSession());
        return entity;
    }
}
