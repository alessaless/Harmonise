package com.example.harmonise.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.harmonise.dto.ExerciseExecutionDto;
import com.example.harmonise.entity.ExerciseExecution;
import com.example.harmonise.repository.ExerciseExecutionRepository;

@Service
public class ExerciseExecutionService {

    private final ExerciseExecutionRepository repository;

    public ExerciseExecutionService(ExerciseExecutionRepository repository) {
        this.repository = repository;
    }

    // GET all executions of a child
    public List<ExerciseExecutionDto> getExecutionsByChild(Long bambinoId) {
        return repository.findByBambino(bambinoId).stream()
                .map(ExerciseExecutionDto::from)
                .collect(Collectors.toList());
    }

    // ADD new execution
    public ExerciseExecutionDto addExecution(ExerciseExecutionDto dto) {
        ExerciseExecution execution = new ExerciseExecution();
        execution.setIdEsercizio(dto.getIdEsercizio());
        execution.setBambino(dto.getBambino());
        execution.setNumeroErrori(dto.getNumeroErrori());
        execution.setTerminato(dto.getTerminato());
        execution.setDataEsecuzione(dto.getDataEsecuzione() != null ? dto.getDataEsecuzione() : LocalDateTime.now());

        ExerciseExecution saved = repository.save(execution);
        return ExerciseExecutionDto.from(saved);
    }
}
