package com.spring.readiness.athlete;


import com.fasterxml.jackson.annotation.*;
import com.spring.readiness.team.Team;
import com.spring.readiness.testResult.TestResult;
import jakarta.persistence.*;

import java.util.List;


@Entity
public class Athlete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String cognome;

    @ManyToOne
    @JsonBackReference
    private Team team;

    @OneToMany(mappedBy = "athlete", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestResult> testResults;

    public Athlete() {

    }

    public Athlete(Long id, String nome, String cognome, List<TestResult> testResults){
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.testResults = testResults;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public List<TestResult> getTestResults() {
        return testResults;
    }

}
