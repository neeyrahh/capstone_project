import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Container, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import '../styles/Tasks.css';

const INITIAL_LISTS = [
  { ListID: 1, Name: 'To Do', cards: [] },
  { ListID: 2, Name: 'In Progress', cards: [] },
  { ListID: 3, Name: 'Completed', cards: [] },
  { ListID: 4, Name: 'Approved', cards: [] }
];

const Tasks = () => {
  const { boardId } = useParams();
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardMembers, setBoardMembers] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Define fetchBoardMembers using useCallback
  const fetchBoardMembers = useCallback(async () => {
    try {
      const membersResponse = await fetch(
        `http://localhost:5000/api/board-members/${boardId}`,
        {
          credentials: 'include'
        }
      );

      if (!membersResponse.ok) {
        throw new Error('Failed to fetch board members');
      }

      const data = await membersResponse.json();
      console.log('Board members data:', data); // Debug log
      
      if (data && data.board_members && Array.isArray(data.board_members)) {
        setBoardMembers(data.board_members);
      }
    } catch (err) {
      console.error('Error fetching board members:', err);
      setModalError('Failed to load board members');
    }
  }, [boardId]);

  // Define fetchBoardDetails using useCallback
  const fetchBoardDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/board/${boardId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch board details');
      }

      const data = await response.json();
      setBoardName(data.board.name);
    } catch (err) {
      console.error('Error fetching board details:', err);
      setError('Failed to load board details');
    }
  }, [boardId]);

  // Define fetchCards using useCallback
  const fetchCards = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cards/${boardId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }

      const data = await response.json();
      console.log('Cards data:', data); // Debug log
      
      if (data && Array.isArray(data.cards)) {
        const updatedLists = INITIAL_LISTS.map(list => ({
          ...list,
          cards: data.cards.filter(card => card.status === list.Name) || []
        }));
        setLists(updatedLists);
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // Main useEffect for initial data loading
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      setError('');
      try {
        await Promise.all([
          fetchBoardDetails(),
          fetchCards(),
          fetchBoardMembers()
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load board data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, navigate, fetchBoardDetails, fetchCards, fetchBoardMembers]);

  const handleAddCard = () => {
    navigate(`/tasks/${boardId}/add`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail('');
    setModalError('');
    setSuccess('');
  };

  const handleShowModal = async () => {
    setShowModal(true);
    setModalError('');
    await fetchBoardMembers();
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setModalError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/board-member/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId,
          email
        })
      });

      const data = await response.json();
      console.log('Invite response:', data); // Debug log

      if (response.ok) {
        setSuccess('Member invited successfully!');
        await fetchBoardMembers(); // Refresh the members list
        setEmail('');
      } else {
        throw new Error(data.msg || 'Failed to invite member');
      }
    } catch (err) {
      console.error('Invitation error:', err);
      setModalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading board data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="tasks-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{boardName} - Tasks Board</h4>
        <Button 
          variant="primary" 
          onClick={handleShowModal}
          className="invite-member-btn"
        >
          + Invite Member
        </Button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Row className="gx-3">
        {lists.map(list => (
          <Col key={list.ListID} md={3} className="mb-4">
            <div className="task-list">
              <h5 className="list-title text-center mb-3">{list.Name}</h5>
              {list.cards.map(card => (
                <Link key={card._id} to={`/task/${boardId}/${card._id}`} style={{ textDecoration: 'none' }}>
                  <Card className="task-card mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title className="task-title">{card.title}</Card.Title>
                      <Card.Text>
                        <small><strong>Assigned to: </strong> 
                          {boardMembers.find(m => m.user_id === card.assign_to)?.email || card.assign_to}
                        </small><br />
                        <small><strong>Due Date: </strong> 
                          {new Date(card.dueDate).toLocaleDateString()}
                        </small>
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
          {modalError && <Alert variant="danger">{modalError}</Alert>}
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
          
          {/* Display current board members */}
          {boardMembers.length > 0 && (
            <div className="mt-4">
              <h6>Current Board Members:</h6>
              <ul className="list-unstyled">
                {boardMembers.map((member, index) => (
                  <li key={member.user_id} className="text-muted">
                    {member.email || member.user_id}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tasks;