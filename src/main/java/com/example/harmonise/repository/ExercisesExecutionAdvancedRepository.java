package com.example.harmonise.repository;

import com.example.harmonise.entity.ExercisesExecutionAdvanced;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExercisesExecutionAdvancedRepository extends JpaRepository<ExercisesExecutionAdvanced, Long> {

    List<ExercisesExecutionAdvanced> findByBambino(Long bambino);
}
