package com.spring.readiness.athlete;

import java.util.List;

public interface AthleteService {

    void createAthlete(Athlete athlete);

    Athlete getAthleteById(Long id);

    List<Athlete> getAllAthletes();

    boolean deleteAthlete(Long id);

    boolean updateAthlete(Athlete athlete, Long id);
}
