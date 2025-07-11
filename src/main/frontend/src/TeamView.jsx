// TeamView.js
import React, { useState, useEffect } from 'react';
import {Button, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link, useParams, useNavigate } from 'react-router-dom';

const TeamView = () => {
    const { id } = useParams();
    const [athletes, setAthletes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [testsNumber, setTestsNumber] = useState(15); // default value
    const navigate = useNavigate();


    const fetchAllAthletes = async (testsNumber) => {
        try {
            const response = await fetch('/readiness/athletes');
            if (response.ok) {
                const data = await response.json();
                // Filter athletes by team ID
                const teamAthletes = data.filter(athlete => athlete.teamId === parseInt(id, 10));
                const athletesWithReadiness = await Promise.all(teamAthletes.map(async athlete => {
                    try {
                        const readinessResponse = await fetch(`/readiness/${athlete.id}/readiness`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(testsNumber),
                        });

                        if (!readinessResponse.ok) {
                            const errorData = await readinessResponse.json();
                            console.error('Error fetching readiness:', errorData);
                            return { ...athlete, readiness: 'error' };
                        }

                        const readinessArray = await readinessResponse.json();
                        const readiness = readinessArray[2]
                        return { ...athlete, readiness, readinessArray };

                    } catch (error) {
                        console.error('Error fetching readiness:', error);
                        return { ...athlete, readiness: 'error' };
                    }
                }));
                setAthletes(athletesWithReadiness);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching athletes:', error);
            setIsLoading(false);
        }
    };

    const handleTestsNumberChange = (e) => {
        const newTestsNumber = parseInt(e.target.value, 10);
        setTestsNumber(newTestsNumber);
        fetchAllAthletes(newTestsNumber);
    };

    const remove = async (id) => {
        try {
            await fetch(`/readiness/athletes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setAthletes(prevAthletes => prevAthletes.filter(athlete => athlete.id !== id));
        } catch (error) {
            console.error('Error removing athlete:', error);
        }
    };

    useEffect(() => {
        fetchAllAthletes(testsNumber);
    }, [id]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <Button size="sm" color="primary" tag={Link} to="/teams">Back</Button>
                <h3>Team's Athletes</h3>
                <Form inline>
                    <FormGroup>
                        <Label for="testsNumber" className="mr-sm-2">Number of Tests Considered:</Label>
                        <Input
                            type="select"
                            name="testsNumber"
                            id="testsNumber"
                            value={testsNumber}
                            onChange={handleTestsNumberChange}
                        >
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                        </Input>
                    </FormGroup>
                </Form>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="30%">Nome</th>
                        <th width="30%">Cognome</th>
                        <th width="40%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {athletes.map(athlete => {
                        let rowClass = '';
                        if (athlete.readiness === 1) rowClass = 'table-success';
                        else if (athlete.readiness === 0) rowClass = 'table-warning';
                        else if (athlete.readiness === -1) rowClass = 'table-danger';
                        else if (athlete.readiness === 'error' || athlete.readiness === -2) rowClass = 'table-secondary';

                        return (
                            <tr key={athlete.id} className={rowClass}>
                                <td style={{whiteSpace: 'nowrap'}}>{athlete.nome}</td>
                                <td style={{whiteSpace: 'nowrap'}}>{athlete.cognome}</td>
                                <td>
                                    <Button size="sm" color="primary" onClick={() => navigate(`/athletes/view-athlete/${athlete.id}`, {state: {readiness: athlete.readinessArray}})}>Details</Button>{' '}
                                    <Button size="sm" color="warning" tag={Link} to={"/athletes/" + athlete.id}>Edit</Button>{' '}
                                    <Button size="sm" color="danger" onClick={() => remove(athlete.id)}>Delete</Button>{' '}
                                    <Button size="sm" color="success" tag={Link} to={`/athletes/${athlete.id}/tests`}>Add Test</Button>{' '}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default TeamView;
