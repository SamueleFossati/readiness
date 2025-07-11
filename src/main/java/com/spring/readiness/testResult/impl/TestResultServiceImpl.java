package com.spring.readiness.testResult.impl;

import com.spring.readiness.athlete.Athlete;
import com.spring.readiness.athlete.AthleteService;
import com.spring.readiness.testResult.TestResult;
import com.spring.readiness.testResult.TestResultRepository;
import com.spring.readiness.testResult.TestResultService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class TestResultServiceImpl implements TestResultService {

    private static final Logger log = Logger.getLogger(TestResultServiceImpl.class.getName());
    private final TestResultRepository testResultRepository;
    private final AthleteService athleteService;

    public TestResultServiceImpl(TestResultRepository testResultRepository, AthleteService athleteService) {
        this.testResultRepository = testResultRepository;
        this.athleteService = athleteService;
    }

    @Override
    public boolean createTestResult(TestResult testResult, Long athleteId) {
        log.info("Create testResult with id: " + testResult.getId()+" of athlete with id: " + athleteId);
        Athlete athlete = athleteService.getAthleteById(athleteId);
        if(athlete != null) {
            testResult.setAthlete(athlete);
            testResultRepository.save(testResult);
            return true;
        }
        log.info("Athlete with id: " + athleteId + " not found");
        return false;
    }

    @Override
    public boolean updateTestResult(TestResult updateTestResult, Long testResultId, Long athleteId) {
        log.info("Update testResult with id: " + testResultId);
        if(athleteService.getAthleteById(athleteId) != null){
            updateTestResult.setAthlete(athleteService.getAthleteById(athleteId));
            updateTestResult.setId(testResultId);
            testResultRepository.save(updateTestResult);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteTestResult(Long testResultId, Long athleteId) {
        log.info("Delete testResult with id: " + testResultId);
        if(athleteService.getAthleteById(athleteId) != null && testResultRepository.existsById(testResultId)) {
            TestResult testResult = testResultRepository.findById(testResultId).orElse(null);
            if (testResult != null) {
                Athlete athlete = testResult.getAthlete();
                athlete.getTestResults().remove(testResult);
                testResult.setAthlete(null);
                athleteService.updateAthlete(athlete, athleteId);
                testResultRepository.deleteById(testResultId);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean deleteAllTestResultSFromAthlete(Long athleteId) {
        log.info("Delete all test result from athlete with id: " + athleteId);
        if(athleteService.getAthleteById(athleteId) != null){
            Athlete athlete = athleteService.getAthleteById(athleteId);
            for(TestResult testResult : athlete.getTestResults()){
                athlete.getTestResults().remove(testResult);
                testResult.setAthlete(null);
                athleteService.updateAthlete(athlete, athleteId);
                testResultRepository.deleteById(testResult.getId());
                return true;
            }
        }
        return false;
    }

    @Override
    public TestResult getTestResultById(Long testResultId, Long athleteId) {
        log.info("Get testResult with id: " + testResultId + " of athlete with id: " + athleteId);
        List<TestResult> testResults = getAllTestResults(athleteId);
        return testResults.stream()
                .filter(testResult -> testResult.getId().equals(athleteId))
                .findFirst()
                .orElse(null);
    }
/*
    @Override
    public List<TestResult> getRecentTestResults(Long athleteId, Integer n) {
        log.info("Get :"+n+" recent testResults with id: " + athleteId);
        if(athleteService.getAthleteById(athleteId) == null){
            log.info("Athlete with id: " + athleteId + " not found");
            return null;
        }
        if(n<=0){
            log.info("n <= 0");
            return null;
        }
        if(athleteService.getAthleteById(athleteId).getTestResults().size() < n){
            log.info("Athlete with id: " + athleteId + " has too few test results");
            return null;
        }
        Pageable pageable = PageRequest.of(0, n);
        return testResultRepository.findTopNByAthleteIdOrderByTestDateDesc(athleteId, pageable);
    }

    @Override
    public TestResult getLatestTestResult(Long athleteId){
        log.info("Get latest test result from athlete with id: " + athleteId);
        if(athleteService.getAthleteById(athleteId) == null){
            log.info("Athlete with id: " + athleteId + " not found");
            return null;
        }
        if(athleteService.getAthleteById(athleteId).getTestResults().isEmpty()){
            log.info("Athlete with id: " + athleteId + " has no tests");
            return null;
        }

        return testResultRepository.findTopByAthleteIdOrderByTestDateDesc(athleteId);
    }

    private double getAverageTestResult(Integer n){
        double sum = 0.0, tests=0.0;
        for(Athlete athlete : athleteService.getAllAthletes()){
            List<TestResult> recentTestResults = getRecentTestResults(athlete.getId(),n);
            for(TestResult testResult : recentTestResults){
                sum = sum + testResult.getCmj();
                tests++;
            }
        }
        return sum/tests;
    }

    @Override
    public double[] getReadiness(Long athleteId, Integer n) {
        double[] returnArray = new double[3];
        log.info("Get readiness from Athlete with id: " + athleteId);

        List<TestResult> recentTestResults = getRecentTestResults(athleteId,n);
        log.info("Pre ultimo test");
        TestResult lastTest = getLatestTestResult(athleteId);
        log.info("Post ultimo test");
        double mean = getAverageTestResult(n);
        log.info("Mean: "+mean);

        returnArray[0] = mean;

        double standardDeviation = Math.sqrt(recentTestResults.stream()
                .mapToDouble(TestResult::getCmj)
                .map(val-> Math.pow(val - mean ,2))
                .average()
                .orElse(0.0));

        //coefficiente di Variazione (readiness)
        double coeffVariazione = standardDeviation / mean;

        returnArray[1] = coeffVariazione;

        log.info("Standard deviation: "+standardDeviation+" CoeffVariazione: "+coeffVariazione);
        log.info("Readiness (ultimo test): "+lastTest.getCmj()+" ceiling: "+(mean-coeffVariazione)+" flooring: "+ (mean-(coeffVariazione*2)));
        if(lastTest.getCmj() >= (mean-coeffVariazione)){
            returnArray[2] = 1;
        }else{
            if(lastTest.getCmj() > (mean-(coeffVariazione*2)) && lastTest.getCmj() < (mean-coeffVariazione)){
                returnArray[2] = 0;
            }else{
                returnArray[2] = -1;
            }
        }


        log.info("Contenuto di returnArray: "+returnArray[0]+" "+returnArray[1]+" "+returnArray[2]);

        return returnArray;
    }
*/

    @Override
    public List<TestResult> getRecentTestsResults(Long athleteId, Integer n) {
        log.info("Get :" + n + " recent testResults with id: " + athleteId);
        Athlete athlete = athleteService.getAthleteById(athleteId);
        if (athlete == null) {
            log.info("Athlete with id: " + athleteId + " not found");
            return null;
        }
        if (n <= 0) {
            log.info("n <= 0");
            return null;
        }
        if (athlete.getTestResults().size() < n) {
            log.info("Athlete with id: " + athleteId + " has too few test results");
            return null;
        }
        Pageable pageable = PageRequest.of(0, n);
        return testResultRepository.findTopNByAthleteIdOrderByTestDateDesc(athleteId, pageable);
    }

    @Override
    public TestResult getLatestTestResult(Long athleteId) {
        log.info("Get latest test result from athlete with id: " + athleteId);
        Athlete athlete = athleteService.getAthleteById(athleteId);
        if (athlete == null) {
            log.info("Athlete with id: " + athleteId + " not found");
            return null;
        }
        if (athlete.getTestResults().isEmpty()) {
            log.info("Athlete with id: " + athleteId + " has no tests");
            return null;
        }

        return testResultRepository.findTopByAthleteIdOrderByTestDateDesc(athleteId);
    }

    private double getAverageTestResult(Integer n) {
        double sum = 0.0, tests = 0.0;
        for (Athlete athlete : athleteService.getAllAthletes()) {
            List<TestResult> recentTestResults = getRecentTestsResults(athlete.getId(), n);
            if (recentTestResults == null || recentTestResults.size() < n) {
                continue; // Skip athlete if not enough test results
            }
            for (TestResult testResult : recentTestResults) {
                sum = sum + testResult.getCmj();
                tests++;
            }
        }
        return tests == 0 ? 0 : sum / tests;
    }

    @Override
    public double[] getReadiness(Long athleteId, Integer n) {
        double[] returnArray = new double[3];
        log.info("Get readiness from Athlete with id: " + athleteId);

        List<TestResult> recentTestResults = getRecentTestsResults(athleteId, n);
        if (recentTestResults == null || recentTestResults.size() < n) {
            log.info("Athlete with id: " + athleteId + " has insufficient test results for readiness calculation");
            returnArray[0] = -2; // Indicator for insufficient data
            returnArray[1] = -2; // Indicator for insufficient data
            returnArray[2] = -2; // Indicator for insufficient data
            return returnArray;
        }

        TestResult lastTest = getLatestTestResult(athleteId);
        if (lastTest == null) {
            log.info("No latest test result found for athlete with id: " + athleteId);
            returnArray[0] = -2; // Indicator for no latest test result
            returnArray[1] = -2; // Indicator for no latest test result
            returnArray[2] = -2; // Indicator for no latest test result
            return returnArray;
        }

        double mean = getAverageTestResult(n);
        log.info("Mean: " + mean);
        returnArray[0] = mean;

        double standardDeviation = Math.sqrt(recentTestResults.stream()
                .mapToDouble(TestResult::getCmj)
                .map(val -> Math.pow(val - mean, 2))
                .average()
                .orElse(0.0));

        // Coefficient of Variation (readiness)
        double coeffVariazione = mean != 0 ? standardDeviation / mean : 0;

        returnArray[1] = coeffVariazione;

        log.info("Standard deviation: " + standardDeviation + " CoeffVariazione: " + coeffVariazione);
        log.info("Readiness (last test): " + lastTest.getCmj() + " ceiling: " + (mean - coeffVariazione) + " flooring: " + (mean - (coeffVariazione * 2)));
        if (lastTest.getCmj() >= (mean - coeffVariazione)) {
            returnArray[2] = 1;
        } else if (lastTest.getCmj() >= (mean - (coeffVariazione * 2)) && lastTest.getCmj() < (mean - coeffVariazione)) {
            returnArray[2] = 0;
        } else {
            returnArray[2] = -1;
        }

        log.info("Contents of returnArray: " + returnArray[0] + " " + returnArray[1] + " " + returnArray[2]);

        return returnArray;
    }

    @Override
    public List<TestResult> getAllTestResults(Long athleteId) {
        log.info("Get all test results of athlete with id: " + athleteId);
        return testResultRepository.findByAthleteId(athleteId)
                .stream()
                .sorted(Comparator.comparing(TestResult::getTestDate))
                .collect(Collectors.toList());
    }


}
