package com.example.harmonise.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.harmonise.entity.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    // con JpaRepository hai già findAll() pronto
}
