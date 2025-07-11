/*
import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Input, Label, FormGroup, Form } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

const AthleteList = () => {
    const [athletes, setAthletes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [testsNumber, setTestsNumber] = useState(15); // default value

    const fetchAthletes = async (testsNumber) => {
        try {
            const response = await fetch('/readiness/athletes');
            if (response.ok) {
                const data = await response.json();
                const athletesWithReadiness = await Promise.all(data.map(async athlete => {
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
                        return { ...athlete, readiness };

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
        fetchAthletes(newTestsNumber);
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
        fetchAthletes(testsNumber);
    }, []); // fetch athletes on initial render

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <Button size="sm" color="success" tag={Link} to="/athletes/new">Add Athlete</Button>{' '}
                <Button size="sm" color="primary" tag={Link} to="/">Back</Button>


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

                <h3>Athletes</h3>
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
                        else if (athlete.readiness === 'error') rowClass = 'table-secondary';

                        return (
                            <tr key={athlete.id} className={rowClass}>
                                <td style={{whiteSpace: 'nowrap'}}>{athlete.nome}</td>
                                <td style={{whiteSpace: 'nowrap'}}>{athlete.cognome}</td>
                                <td>
                                    <Button size="sm" color="primary" tag={Link}
                                            to={"/athletes/view-athlete/" + athlete.id}>Details</Button>{' '}
                                    <Button size="sm" color="warning" tag={Link}
                                            to={"/athletes/" + athlete.id}>Edit</Button>{' '}
                                    <Button size="sm" color="danger"
                                            onClick={() => remove(athlete.id)}>Delete</Button>{' '}
                                    <Button size="sm" color="success" tag={Link} to={`/athletes/${athlete.id}/tests`}>Add
                                        Test</Button>{' '}
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

export default AthleteList;
*/
import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Input, Label, FormGroup, Form } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link, useNavigate } from 'react-router-dom';

const AthleteList = () => {
    const [athletes, setAthletes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [testsNumber, setTestsNumber] = useState(15); // default value
    const navigate = useNavigate();

    const fetchAthletes = async (testsNumber) => {
        try {
            const response = await fetch('/readiness/athletes');
            if (response.ok) {
                const data = await response.json();
                const athletesWithReadiness = await Promise.all(data.map(async athlete => {
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
        fetchAthletes(newTestsNumber);
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
        fetchAthletes(testsNumber);
    }, []); // fetch athletes on initial render

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <Button size="sm" color="success" tag={Link} to="/athletes/new">Add Athlete</Button>{' '}
                <Button size="sm" color="primary" tag={Link} to="/">Back</Button>

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

                <h3>Athletes</h3>
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
                                    <Button size="sm" color="primary" onClick={() => navigate(`/athletes/view-athlete/${athlete.id}`, { state: { readiness: athlete.readinessArray } })}>Details</Button>{' '}
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

export default AthleteList;




