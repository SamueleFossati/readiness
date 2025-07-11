import React, { useState, useEffect } from 'react';
import { Button, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTeams = async () => {
        try {
            const response = await fetch('/readiness/teams');
            if (response.ok) {
                const data = await response.json();
                setTeams(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const remove = async (id) => {
        try {
            await fetch(`/readiness/teams/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setTeams(prevTeams => prevTeams.filter(team => team.id !== id));
        } catch (error) {
            console.error('Error removing team:', error);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-right">
                    <Button color="success" tag={Link} to="/teams/new">Add Team</Button>
                </div>
                <h3>Teams</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="30%">Name</th>
                        <th width="30%">Description</th>
                        <th width="40%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map(team => (
                        <tr key={team.id}>
                            <td style={{whiteSpace: 'nowrap'}}>{team.name}</td>
                            <td>{team.description}</td>
                            <td>
                                <Button size="sm" color="primary" tag={Link}
                                        to={"/teams/view-team/" + team.id}>Details</Button>{' '}
                                <Button size="sm" color="warning" tag={Link} to={"/teams/" + team.id}>Edit</Button>{' '}
                                <Button size="sm" color="danger" onClick={() => remove(team.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default TeamList;


