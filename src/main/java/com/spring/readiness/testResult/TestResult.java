package com.spring.readiness.testResult;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spring.readiness.athlete.Athlete;
import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
public class TestResult{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double cmj;

    private LocalDate testDate;

    @JsonIgnore
    @ManyToOne
    private Athlete athlete;

    public TestResult() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getCmj() {
        return cmj;
    }

    public void setCmj(double cmj) {
        this.cmj = cmj;
    }

    public LocalDate getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDate testDate) {
        this.testDate = testDate;
    }

    public Athlete getAthlete() {
        return athlete;
    }

    public void setAthlete(Athlete athlete) {
        this.athlete = athlete;
    }
}
