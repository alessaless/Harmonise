package com.example.harmonise.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.harmonise.dto.ExerciseDto;
import com.example.harmonise.entity.Exercise;
import com.example.harmonise.repository.ExerciseRepository;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public List<ExerciseDto> getAllExercises() {
        List<Exercise> exercises = exerciseRepository.findAll();
        return exercises.stream()
                .map(ExerciseDto::from)
                .collect(Collectors.toList());
    }
}
