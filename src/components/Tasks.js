import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import '../styles/Tasks.css';

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
    Name: 'Completed',
    cards: [
      { CardID: 4, Title: 'Task 4', AssignedTo: 'Munirat', DueDate: '2024-10-12' }
    ]
  },
  {
    ListID: 4,
    Name: 'Approved',
    cards: [
      { CardID: 5, Title: 'Task 5', AssignedTo: 'Bibek', DueDate: '2024-10-20' }
    ]
  }
];

const Tasks = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    setLists(mockLists);
  }, []);

  return (
    <Container fluid className="tasks-container p-4">
      <Row className="gx-3">
        {lists.map(list => (
          <Col key={list.ListID} md={3} className="mb-4">
            <div className="task-list">
              <h5 className="list-title text-center mb-3">{list.Name}</h5>
              {list.cards.map(card => (
                <Link key={card.CardID} to={`/task/${card.CardID}`} style={{ textDecoration: 'none' }}>
                  <Card className="task-card mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title className="task-title">{card.Title}</Card.Title>
                      <Card.Text>
                        <small><strong>Assigned to:</strong> {card.AssignedTo}</small><br />
                        <small><strong>Due Date:</strong> {card.DueDate}</small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
              <Button variant="outline-secondary" className="w-100 mt-2 add-card-btn">+ Add a card</Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Tasks;
