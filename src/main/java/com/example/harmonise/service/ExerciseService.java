package com.example.harmonise.service;

import com.example.harmonise.dto.ExerciseDto;
import com.example.harmonise.entity.Exercise;
import com.example.harmonise.repository.ExerciseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseService {

    private final ExerciseRepository repo;

    public ExerciseService(ExerciseRepository repo) {
        this.repo = repo;
    }

    private ExerciseDto toDto(Exercise e) {
        return new ExerciseDto(e.getIdEsercizio(), e.getNomeEsercizio());
    }

    public List<ExerciseDto> getAllExercises() {
        return repo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}