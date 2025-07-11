package com.spring.readiness.athlete.impl;

import com.spring.readiness.athlete.Athlete;
import com.spring.readiness.athlete.AthleteRepository;
import com.spring.readiness.athlete.AthleteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class AthleteServiceImpl implements AthleteService {

    private static final Logger log = Logger.getLogger(AthleteServiceImpl.class.getName());
    private final AthleteRepository athleteRepository;

    public AthleteServiceImpl(AthleteRepository athleteRepository) {
        this.athleteRepository = athleteRepository;
    }

    @Override
    public void createAthlete(Athlete athlete) {
        log.info("Create Athlete with id " + athlete.getId());
        athleteRepository.save(athlete);
    }

    @Override
    public Athlete getAthleteById(Long id) {
        log.info("Finding athlete by id: " + id);
        return athleteRepository.findById(id).orElse(null);
    }

    @Override
    public List<Athlete> getAllAthletes() {
        log.info("Finding all athletes");
        return athleteRepository.findAll();
    }

    @Override
    public boolean deleteAthlete(Long id) {
        log.info("Deleting athlete by id: " + id);
        if(athleteRepository.existsById(id)) {
            athleteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateAthlete(Athlete updatedAthlete, Long id) {
        log.info("Updating athlete with id: " + updatedAthlete.getId());
        Optional<Athlete> optionalAthlete = athleteRepository.findById(id);
        if(optionalAthlete.isPresent()) {
            Athlete athlete = optionalAthlete.get();
            athlete.setId(id);
            athlete.setNome(updatedAthlete.getNome());
            athlete.setCognome(updatedAthlete.getCognome());
            athlete.setTeam(updatedAthlete.getTeam());
            athleteRepository.save(athlete);
            return true;
        }
        return false;
    }
}
