package com.example.harmonise.repository;

import com.example.harmonise.entity.ExercisesExecutionAdvanced;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface ExercisesExecutionAdvancedRepository extends JpaRepository<ExercisesExecutionAdvanced, Long> {

    List<ExercisesExecutionAdvanced> findByBambino(Long bambino);

    @Query(value = "SELECT CAST(AVG(total_num_problems) AS SIGNED) FROM exercises_execution_advanced WHERE bambino = ?1", nativeQuery = true)
    Integer getAverageExercisesExecuted(Long bambino);

    @Query(value = """
    SELECT CAST(AVG(averaged_timespent) AS SIGNED)
    FROM exercises_execution_advanced
    WHERE bambino = ?1
      AND data_esecuzione BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW()
    """, nativeQuery = true)
    Integer getAverageTimeLastWeek(Long bambino);


}
