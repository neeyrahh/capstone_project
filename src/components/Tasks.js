import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// this is the new branch

const mockLists = [
  {
    ListID: 1,
    Name: 'To Do',
    cards: [
      { CardID: 1, Title: 'Task 1', AssignedTo: 'Azhar', DueDate: '2024-10-05' },
      { CardID: 2, Title: 'Task 2', AssignedTo: 'Arthur', DueDate: '2024-10-10' }
    ]
  },
  {
    ListID: 2,
    Name: 'In Progress',
    cards: [
      { CardID: 3, Title: 'Task 3', AssignedTo: 'Adyl', DueDate: '2024-10-07' }
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
    setLists(mockLists);  
  }, []);

  return (
    <Container fluid className="my-4">
      <Row className="gx-3">
        {lists.map(list => (
          <Col key={list.ListID} md={3}>
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
    </Container>
  );
};

export default Tasks;
