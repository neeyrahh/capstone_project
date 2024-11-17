import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
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
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLists(mockLists);
  }, [isAuthenticated, navigate]);

  const handleAddCard = () => {
    navigate("/tasks/add");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail('');
    setError('');
    setSuccess('');
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // const userId = localStorage.getItem('userId'); // Get userId from localStorage
      
      const response = await fetch('http://localhost:5000/api/board-member/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId: "673a1f69b726ca4c57c4b463", // Your board ID
          email: email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Member invited successfully!');
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        if (response.status === 401) {
          setError('Please sign in again to continue.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(data.msg || 'Failed to invite member');
        }
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="tasks-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Tasks Board</h4>
        <Button 
          variant="primary" 
          onClick={handleShowModal}
          className="invite-member-btn"
        >
          + Invite Member
        </Button>
      </div>

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
              <Button
                variant="outline-secondary"
                className="w-100 mt-2 add-card-btn"
                onClick={handleAddCard}
              >
                + Add a card
              </Button>
            </div>
          </Col>
        ))}
      </Row>

      {/* Invite Member Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Invite Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleInviteMember}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Enter the email address of the person you want to invite.
              </Form.Text>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tasks;