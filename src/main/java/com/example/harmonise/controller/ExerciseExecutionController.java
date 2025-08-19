package com.example.harmonise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.harmonise.dto.ExerciseExecutionDto;
import com.example.harmonise.service.ExerciseExecutionService;

@RestController
@RequestMapping("/executions")
public class ExerciseExecutionController {

    private final ExerciseExecutionService service;

    public ExerciseExecutionController(ExerciseExecutionService service) {
        this.service = service;
    }

    // GET all executions of a child
    @GetMapping("/child/{bambinoId}")
    public ResponseEntity<List<ExerciseExecutionDto>> getExecutionsByChild(@PathVariable Long bambinoId) {
        return ResponseEntity.ok(service.getExecutionsByChild(bambinoId));
    }

    @PostMapping
    public ResponseEntity<ExerciseExecutionDto> addExecution(@RequestBody ExerciseExecutionDto dto) {
        return ResponseEntity.ok(service.addExecution(dto));
    }
}
