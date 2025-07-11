import React, { useState, useEffect } from "react";
import {
    Button,
    ButtonGroup,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    Col, Row
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import AppNavbar from "./AppNavbar";

const TestList = () => {
    const [tests, setTests] = useState([]);
    const [athleteName, setAthleteName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [cmj, setCmj] = useState('');
    const [testDate, setDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    const { id } = useParams();

    const fetchTests = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/readiness/${id}/testResults`);
            if (response.ok) {
                const data = await response.json();
                setTests(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
            setIsLoading(false);
        }
    };

    const fetchAthleteDetails = async () => {
        try {
            const response = await fetch(`/readiness/athletes/${id}`);
            if (response.ok) {
                const data = await response.json();
                setAthleteName(`${data.nome} ${data.cognome}`);
            }
        } catch (error) {
            console.error("Error fetching athlete details:", error);
        }
    };

    useEffect(() => {
        fetchTests();
        fetchAthleteDetails();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/readiness/${id}/testResults`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cmj, testDate })
            });

            if (response.ok) {
                setCmj('');
                setDate('');
                fetchTests();
            } else {
                console.error("Failed to add test");
            }
        } catch (error) {
            console.error("Error adding test:", error);
        }
    };

    const removeTest = async(idTest) =>{
        try {
            await fetch(`/readiness/${id}/testResults/${idTest}`,{
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setTests(prevTests => prevTests.filter(test => test.id !== idTest));
        } catch (error) {
            console.error('Error removing test:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate the current items to display
    const indexOfLastTest = currentPage * itemsPerPage;
    const indexOfFirstTest = indexOfLastTest - itemsPerPage;
    const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

    const totalPages = Math.ceil(tests.length / itemsPerPage);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <h3>{athleteName}'s Test Results</h3>

                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>CMJ</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentTests.map((test) => (
                        <tr key={test.id}>
                            <td>{test.testDate}</td>
                            <td>{test.cmj}</td>
                            <td>
                                <ButtonGroup>
                                    <Button size="sm" color="danger" onClick={() => removeTest(test.id)}>Delete</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <PaginationItem disabled={currentPage <= 1}>
                            <PaginationLink
                                onClick={() => handlePageChange(currentPage - 1)}
                                previous
                                href="#"
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((page, i) => (
                            <PaginationItem active={i + 1 === currentPage} key={i}>
                                <PaginationLink onClick={() => handlePageChange(i + 1)} href="#">
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem disabled={currentPage >= totalPages}>
                            <PaginationLink
                                onClick={() => handlePageChange(currentPage + 1)}
                                next
                                href="#"
                            />
                        </PaginationItem>
                    </Pagination>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="cmj">CMJ:</Label>
                                <Input type="text" name="cmj" id="cmj" value={cmj} onChange={(e) => setCmj(e.target.value)} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="date">Date:</Label>
                                <Input type="date" name="date" id="date" value={testDate} onChange={(e) => setDate(e.target.value)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <br/>
                    <Button color="success" type="submit">Add Test</Button>{' '}
                    <Button color="primary" tag={Link} to="/athletes">Back</Button>{' '}
                </Form>


            </Container>
        </div>
    );
};

export default TestList;
