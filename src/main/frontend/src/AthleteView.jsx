/*import React, { useState, useEffect } from "react";
import {Button, Container, Table} from "reactstrap";
import AppNavbar from "./AppNavbar";
import {Link, useParams} from "react-router-dom";
import ReadinessChart from "./ReadinessChart";

const AthleteView = ({ match }) => {
    const [athlete, setAthlete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const [team, setTeam] = useState(null);

    const { id} = useParams();

    useEffect(() => {
        const fetchAthleteData = async () => {
            try {
                // Fetch athlete details
                const athleteResponse = await fetch(`/readiness/athletes/${id}`);
                const athleteData = await athleteResponse.json();
                setAthlete(athleteData);

                // Fetch athlete's tests
                const testsResponse = await fetch(`/readiness/${id}/testResults`);
                const testsData = await testsResponse.json();
                setTests(testsData);

                // Fetch athlete's team
                const teamResponse = await fetch(`/readiness/teams/${athleteData.teamId}`);
                const teamData = await teamResponse.json();
                setTeam(teamData);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching athlete details:', error);
                setIsLoading(false);
            }
        };

        fetchAthleteData();
    }, [id]);




    if (isLoading) {
        return <p>Loading ...</p>;
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3><strong>{athlete.nome} {athlete.cognome} - {team ? team.name : "No Team Assigned"}</strong></h3>
                <h3>Tests</h3>
                <ReadinessChart athleteId={id} tests={setTests}/>
                <Button size="sm" color="primary" tag={Link} to="/athletes">Back</Button>{' '}
            </Container>
        </div>
    );
};

export default AthleteView;
*/
import React, { useState, useEffect } from "react";
import { Button, Container } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { Link, useParams, useLocation } from "react-router-dom";
import ReadinessChart from "./ReadinessChart";

const AthleteView = () => {
    const [athlete, setAthlete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const [team, setTeam] = useState(null);

    const { id } = useParams();
    const location = useLocation();
    const readiness = location.state?.readiness || 'Unknown';

    useEffect(() => {
        const fetchAthleteData = async () => {
            try {
                // Fetch athlete details
                const athleteResponse = await fetch(`/readiness/athletes/${id}`);
                const athleteData = await athleteResponse.json();
                setAthlete(athleteData);

                // Fetch athlete's tests
                const testsResponse = await fetch(`/readiness/${id}/testResults`);
                const testsData = await testsResponse.json();
                setTests(testsData);

                // Fetch athlete's team
                const teamResponse = await fetch(`/readiness/teams/${athleteData.teamId}`);
                const teamData = await teamResponse.json();
                setTeam(teamData);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching athlete details:', error);
                setIsLoading(false);
            }
        };

        fetchAthleteData();
    }, [id]);

    if (isLoading) {
        return <p>Loading ...</p>;
    }

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <h3><strong>{athlete.nome} {athlete.cognome} - {team ? team.name : "No Team Assigned"}</strong></h3>
                <h3>Tests</h3>
                <ReadinessChart athleteId={id} tests={tests} readiness={readiness}/>
                <Button size="sm" color="primary" tag={Link} to="/athletes">Back</Button>{' '}
            </Container>
        </div>
    );
};

export default AthleteView;
