package com.example.harmonise.controller;

import com.example.harmonise.dto.ExerciseDto;
import com.example.harmonise.service.ExerciseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    private final ExerciseService service;

    public ExerciseController(ExerciseService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExerciseDto> getExercises() {
        return service.getAllExercises();
    }
}
