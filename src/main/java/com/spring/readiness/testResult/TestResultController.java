package com.spring.readiness.testResult;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.ErrorManager;

@Controller
public class TestResultController {

    private final TestResultService testResultService;

    public TestResultController(TestResultService testResultService) {
        this.testResultService = testResultService;
    }

    @PostMapping("/readiness/{athleteId}/testResults")
    public ResponseEntity<TestResult> createTestResult(@PathVariable long athleteId, @RequestBody TestResult testResult) {
        if(testResultService.createTestResult(testResult, athleteId)) {
            return new ResponseEntity<>(testResult, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/readiness/{athleteId}/testResults")
    public ResponseEntity<List<TestResult>> getAllTestResults(@PathVariable Long athleteId) {
        return new ResponseEntity<>(testResultService.getAllTestResults(athleteId), HttpStatus.OK);
    }

    @GetMapping("/readiness/{athleteId}/testResults/{testResultId}")
    public ResponseEntity<TestResult> getTestResultById(@PathVariable Long testResultId, @PathVariable Long athleteId) {
        if(testResultService.getTestResultById(athleteId, testResultId) != null) {
            return new ResponseEntity<>(testResultService.getTestResultById(athleteId, testResultId), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/readiness/{athleteId}/readiness")
    public ResponseEntity<?> getReadiness(@PathVariable Long athleteId, @RequestBody Integer testsNumber) {
        try {
            double[] readiness = testResultService.getReadiness(athleteId, testsNumber);
            return new ResponseEntity<>(readiness, HttpStatus.OK);
        } catch (Exception e) {
            // return an error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("timestamp", new Date());
            errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            errorResponse.put("error", e.getMessage());
            errorResponse.put("path", "/readiness/" + athleteId + "/readiness");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/readiness/{athleteId}/testResults/{testResultId}")
    public ResponseEntity<TestResult> updateTestResult(@PathVariable Long testResultId, @PathVariable Long athleteId,  @RequestBody TestResult testResult) {
        if(testResultService.updateTestResult(testResult, athleteId, testResultId)) {
            return new ResponseEntity<>(testResult, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/readiness/{athleteId}/testResults/{testResultId}")
    public ResponseEntity<String> deleteTestResult(@PathVariable Long testResultId, @PathVariable Long athleteId) {
        if(testResultService.deleteTestResult(testResultId, athleteId)) {
            return new ResponseEntity<>("Test with id: "+testResultId+" from athlete with id: "+athleteId+" deleted",HttpStatus.OK);
        }
        return new ResponseEntity<>("Test Not Deleted", HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/readiness/{athleteId}/testResults")
    public ResponseEntity<String> deleteAllTestResults(@PathVariable Long athleteId) {
        if(testResultService.deleteAllTestResultSFromAthlete(athleteId)){
            return new ResponseEntity<>("All Test Results Deleted from athlete with id: "+athleteId, HttpStatus.OK);
        }
        return new ResponseEntity<>("Tests not deleted", HttpStatus.BAD_REQUEST);
    }
}
