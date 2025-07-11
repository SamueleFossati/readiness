package com.spring.readiness.athlete;

import com.spring.readiness.DTO.AthleteDTO;
import com.spring.readiness.team.Team;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/readiness/athletes")
public class AthleteController {

    private final AthleteService athleteService;

    public AthleteController(AthleteService athleteService) {
        this.athleteService = athleteService;
    }

    @PostMapping
    public ResponseEntity<Athlete> createAthlete(@RequestBody Athlete athlete) {
        athleteService.createAthlete(athlete);
        return new ResponseEntity<>(athlete, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AthleteDTO>> getAthletes() {
        List<Athlete> athletes = athleteService.getAllAthletes();
        List<AthleteDTO> athleteDTOs = new ArrayList<>();
        for(Athlete athlete : athletes) {
            athleteDTOs.add(convertToDTO(athlete));
        }
        return new ResponseEntity<>(athleteDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AthleteDTO> getAthleteById(@PathVariable Long id) {
        Athlete athlete = athleteService.getAthleteById(id);
        if(athlete == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }else{
            return new ResponseEntity<>(convertToDTO(athlete), HttpStatus.OK);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAthleteById(@PathVariable Long id) {
        if(athleteService.deleteAthlete(id)) {
            return new ResponseEntity<>("Athlete with id "+id+" Deleted Successfully", HttpStatus.OK);
        }else {
            return new ResponseEntity<>("Athlete not existing", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AthleteDTO> updateAthlete(@RequestBody AthleteDTO athleteDTO, @PathVariable Long id) {
        Athlete athlete = convertToEntity(athleteDTO);
        if(athleteService.updateAthlete(athlete, id)) {
            return new ResponseEntity<>(convertToDTO(athlete), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    private AthleteDTO convertToDTO(Athlete athlete) {
        AthleteDTO athleteDTO = new AthleteDTO();
        athleteDTO.setId(athlete.getId());
        athleteDTO.setNome(athlete.getNome());
        athleteDTO.setCognome(athlete.getCognome());
        if (athlete.getTeam() != null) {
            athleteDTO.setTeamId(athlete.getTeam().getId());
        }
        return athleteDTO;
    }

    private Athlete convertToEntity(AthleteDTO athleteDTO) {
        Athlete athlete = new Athlete();
        athlete.setNome(athleteDTO.getNome());
        athlete.setCognome(athleteDTO.getCognome());
        if (athleteDTO.getTeamId() != null) {
            Team team = new Team();
            team.setId(athleteDTO.getTeamId());
            athlete.setTeam(team);
        }
        return athlete;
    }

}
