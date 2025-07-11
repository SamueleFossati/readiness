package com.spring.readiness.team;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("readiness/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        teamService.createTeam(team);
        return new ResponseEntity<>(team, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return new ResponseEntity<>(teamService.getAllTeams(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable long id) {
        Team team = teamService.getTeamById(id);
        if(team == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(team, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable long id, @RequestBody Team team) {
        if(teamService.updateTeam(team,id)){
            return new ResponseEntity<>(team, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeam(@PathVariable long id) {
        if(teamService.deleteTeam(id)){
            return new ResponseEntity<>("Team with id: "+id+" deleted",HttpStatus.OK);
        }
        return new ResponseEntity<>("Team with id: "+id+" not found",HttpStatus.NOT_FOUND);
    }


}
