import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

const TeamEdit = () => {
    const { id } = useParams();
    const history = useNavigate();
    const [item, setItem] = useState({ name: '', description: '' });



    useEffect(() => {
        const fetchTeam = async () => {
            if (id !== 'new') {
                const response = await fetch(`/readiness/teams/${id}`);
                if (response.ok) {
                    const team = await response.json();
                    setItem(team);
                }
            }
        };
        fetchTeam();
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

        await fetch('/readiness/teams' + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        history('/teams');
    };

    const title = <h2>{item.id ? 'Edit Team' : 'Add Team'}</h2>;

    return (
        <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                               onChange={handleChange} autoComplete="name"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description" value={item.description || ''}
                               onChange={handleChange} autoComplete="description"/>
                    </FormGroup>
                    <br></br>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/teams">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
};

export default TeamEdit;
