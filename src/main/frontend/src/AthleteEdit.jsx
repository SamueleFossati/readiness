import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

const AthleteEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState({ nome: '', cognome: '', teamId: '' });
    const [teams, setTeams] = useState([]);

    const fetchAthlete = async () => {
        if (id !== 'new') {
            const response = await fetch(`/readiness/athletes/${id}`);
            if (response.ok) {
                const athlete = await response.json();
                setItem(athlete);
            }
        }
    };

    const fetchTeams = async () => {
        const response = await fetch('/readiness/teams');
        if (response.ok) {
            const teams = await response.json();
            setTeams(teams);
        }
    };

    useEffect(() => {
        fetchAthlete();
        fetchTeams();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        await fetch('/readiness/athletes' + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        navigate('/athletes');
    };

    const title = <h2>{item.id ? 'Edit Athlete' : 'Add Athlete'}</h2>;

    return (
        <div>
            <AppNavbar />
            <Container>
                {title}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nome">Nome</Label>
                                <Input type="text" name="nome" id="nome" value={item.nome || ''}
                                       onChange={handleChange} autoComplete="nome" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="cognome">Cognome</Label>
                                <Input type="text" name="cognome" id="cognome" value={item.cognome || ''}
                                       onChange={handleChange} autoComplete="cognome" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label for="teamId">Team</Label>
                        <Input type="select" name="teamId" id="teamId" value={item.teamId || ''}
                               onChange={handleChange} autoComplete="teamId">
                            <option value="">Select a team</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    <br />
                    <Button color="success" type="submit">Save</Button>{' '}
                    <Button color="danger" tag={Link} to="/athletes">Cancel</Button>{' '}

                </Form>
            </Container>
        </div>
    );
};

export default AthleteEdit;
