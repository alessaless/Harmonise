package com.example.harmonise.service;

import com.example.harmonise.entity.ExercisesExecutionAdvanced;
import com.example.harmonise.repository.ExercisesExecutionAdvancedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExercisesExecutionAdvancedService {

    private final ExercisesExecutionAdvancedRepository repository;

    @Autowired
    public ExercisesExecutionAdvancedService(ExercisesExecutionAdvancedRepository repository) {
        this.repository = repository;
    }

    public ExercisesExecutionAdvanced save(ExercisesExecutionAdvanced execution) {
        return repository.save(execution);
    }

    public List<ExercisesExecutionAdvanced> getByBambino(Long bambinoId) {
        return repository.findByBambino(bambinoId);
    }
}