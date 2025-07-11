package com.spring.readiness.team;

import org.springframework.stereotype.Service;

import java.util.List;

public interface TeamService {

    void createTeam(Team team);

    boolean deleteTeam(Long id);

    boolean updateTeam(Team team, Long id);

    Team getTeamById(Long id);

    List<Team> getAllTeams();

}
