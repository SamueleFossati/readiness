package com.spring.readiness.testResult;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {

    List<TestResult> findByAthleteId(Long athleteId);

    @Query(value = "SELECT t FROM TestResult t WHERE t.athlete.id = :athleteId ORDER BY t.testDate DESC")
    List<TestResult> findTopNByAthleteIdOrderByTestDateDesc(@Param("athleteId") Long athleteId, Pageable pageable);

    TestResult findTopByAthleteIdOrderByTestDateDesc(Long athleteId);
}
