package com.spring.readiness.team.impl;

import com.spring.readiness.team.Team;
import com.spring.readiness.team.TeamRepository;
import com.spring.readiness.team.TeamService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class TeamServiceImpl implements TeamService {

    private final static Logger log = Logger.getLogger(TeamServiceImpl.class.getName());
    private final TeamRepository teamRepository;

    public TeamServiceImpl(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Override
    public void createTeam(Team team) {
        log.info("Creating team: " + team.getName()+" with id "+team.getId());
        teamRepository.save(team);
    }

    @Override
    public boolean deleteTeam(Long id) {
        log.info("Deleting team: " + id);
        if(teamRepository.existsById(id)) {
            teamRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateTeam(Team updatedTeam, Long id) {
        log.info("Updating team: " + id);
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if(optionalTeam.isPresent()) {
            Team team = optionalTeam.get();
            team.setName(updatedTeam.getName());
            team.setDescription(updatedTeam.getDescription());
            team.setAthletes(updatedTeam.getAthletes());
            teamRepository.save(team);
            return true;
        }
        return false;
    }

    @Override
    public Team getTeamById(Long id) {
        log.info("Getting team: " + id);
        return teamRepository.findById(id).orElse(null);
    }

    @Override
    public List<Team> getAllTeams() {
        log.info("Getting all teams");
        return teamRepository.findAll();
    }
}
