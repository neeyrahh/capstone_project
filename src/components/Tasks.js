import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const mockLists = [
  {
    ListID: 1,
    Name: 'To Do',
    cards: [
      { CardID: 1, Title: 'Task 1', AssignedTo: 'Naznin', DueDate: '2024-10-05' },
      { CardID: 2, Title: 'Task 2', AssignedTo: 'Sushma', DueDate: '2024-10-10' }
    ]
  },
  {
    ListID: 2,
    Name: 'In Progress',
    cards: [
      { CardID: 3, Title: 'Task 3', AssignedTo: 'Hani', DueDate: '2024-10-15' }
    ]
  },
  {
    ListID: 3,
    Name: 'Done',
    cards: []
  }
];

const Tasks = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    console.log("Loading mock data for Tasks page");
    setLists(mockLists);  
  }, []);

  return (
    <Container fluid className="my-4">
      <h3>Tasks</h3>
      {lists.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <Row className="gx-3">
          {lists.map(list => (
            <Col key={list.ListID} md={4}>
              <h4 className="text-center mb-4">{list.Name}</h4>
              {list.cards.map(card => (
                <Link key={card.CardID} to={`/task/${card.CardID}`} style={{ textDecoration: 'none' }}>
                  <Card className="mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title className="text-primary">{card.Title}</Card.Title>
                      <Card.Text>
                        <small><strong>Assigned to:</strong> {card.AssignedTo}</small><br />
                        <small><strong>Due Date:</strong> {card.DueDate}</small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Tasks;
