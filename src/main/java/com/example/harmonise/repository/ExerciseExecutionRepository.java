package com.example.harmonise.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.harmonise.entity.ExerciseExecution;

public interface ExerciseExecutionRepository extends JpaRepository<ExerciseExecution, Long> {
    List<ExerciseExecution> findByBambino(Long bambinoId);
}
