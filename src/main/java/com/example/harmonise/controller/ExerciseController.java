package com.example.harmonise.controller;

import com.example.harmonise.dto.ExerciseDto;
import com.example.harmonise.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<List<ExerciseDto>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }
}
