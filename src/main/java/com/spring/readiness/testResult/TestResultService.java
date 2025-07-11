package com.spring.readiness.testResult;


import java.util.List;

public interface TestResultService {

    boolean createTestResult(TestResult testResult, Long athleteId);

    boolean updateTestResult(TestResult testResult, Long testResultId, Long athleteId);

    boolean deleteTestResult(Long testResultId, Long athleteId);

    boolean deleteAllTestResultSFromAthlete(Long athleteId);

    TestResult getTestResultById(Long testResultId, Long athleteId);

    List<TestResult> getRecentTestsResults(Long athleteId, Integer n);

    TestResult getLatestTestResult(Long athleteId);

    double[] getReadiness(Long athleteId, Integer n);

    List<TestResult> getAllTestResults(Long athleteId);
}
