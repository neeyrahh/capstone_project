import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Container, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import '../styles/Tasks.css';
import { API_BASE_URL } from './Config';

// Lists configuration
const LIST_CONFIG = [
  { ListID: 1, Name: 'To Do', position: 1 },
  { ListID: 2, Name: 'In Progress', position: 2 },
  { ListID: 3, Name: 'Completed', position: 3 },
  { ListID: 4, Name: 'Approved', position: 4 }
];

const Tasks = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State declarations
  const [lists, setLists] = useState(LIST_CONFIG.map(list => ({ ...list, cards: [] })));
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch board members
  const fetchBoardMembers = useCallback(async () => {
    try {
      const response = await fetch(
        `/board-members/${boardId}`,
        {
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch board members');
      }

      const data = await response.json();
     
      
      if (data && data.board_members && Array.isArray(data.board_members)) {
        setBoardMembers(data.board_members);
      }
    } catch (err) {
      
      setModalError('Failed to load board members');
    }
  }, [boardId]);

  // Fetch board details
  const fetchBoardDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/board/${boardId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch board details');
      }

      const data = await response.json();
      setBoardName(data.board.name);
    } catch (err) {
    
      setError('Failed to load board details');
    }
  }, [boardId]);

  // Fetch cards
  const fetchCards = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${boardId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }

      const data = await response.json();
    
      
      // Transform the data structure to match our needs
      const updatedLists = LIST_CONFIG.map(list => {
        const positionCards = data[list.position] || [];
        return {
          ...list,
          cards: Array.isArray(positionCards) ? positionCards : []
        };
      });

      
      setLists(updatedLists);
    } catch (err) {
     
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // Initial data load
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
        
        setError('Failed to load board data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, navigate, fetchBoardDetails, fetchCards, fetchBoardMembers]);

  // Event handlers
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
      const response = await fetch(`${API_BASE_URL}/board-member/create`, {
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
     

      if (response.ok) {
        setSuccess('Member invited successfully!');
        await fetchBoardMembers();
        setEmail('');
      } else {
        throw new Error(data.msg || 'Failed to invite member');
      }
    } catch (err) {
    
      setModalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
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

  // Main render
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
              <h5 className="list-title text-center mb-3">
                {list.Name}
                <span className="badge bg-secondary ms-2">
                  {list.cards.length}
                </span>
              </h5>
              {list.cards.map(card => (
                <Link 
                  key={card._id} 
                  to={`/task/${boardId}/${card._id}`} 
                  style={{ textDecoration: 'none' }}
                >
                  <Card className="task-card mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title className="task-title">
                        {card.title}
                      </Card.Title>
                      <Card.Text>
                        <small className="d-block mb-1">
                          <strong>Assigned to: </strong> 
                          {boardMembers.find(m => m.user_id === card.assign_to)?.email || card.assign_to}
                        </small>
                        <small className="d-block">
                          <strong>Due Date: </strong> 
                          {new Date(card.dueDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </small>
                        {card.description && (
                          <small className="d-block mt-2 text-muted description-text">
                            {card.description.length > 100 
                              ? `${card.description.substring(0, 100)}...` 
                              : card.description
                            }
                          </small>
                        )}
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
          
          {boardMembers.length > 0 && (
            <div className="mt-4">
              <h6>Current Board Members:</h6>
              <ul className="list-unstyled">
                {boardMembers.map((member) => (
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