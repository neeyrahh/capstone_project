import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Container, Form, Button } from 'react-bootstrap';
import { API_BASE_URL } from './Config';

const AddCardForm = () => {
  const { boardId } = useParams();
  const [title, setTitle] = useState('');
  const [assign_to, setAssignTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [boardMembers, setBoardMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const navigate = useNavigate();

  const fetchBoardMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/board-members/${boardId}`,
        {
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch board members');
      }

      const data = await response.json();
      
      
      // Check if the response has board_members array
      if (data && data.board_members && Array.isArray(data.board_members)) {
        setBoardMembers(data.board_members);
      } else if (Array.isArray(data)) {
        
        setBoardMembers(data);
      } else {
        
        throw new Error('Invalid board members data format');
      }
    } catch (err) {
     
      setError('Failed to load board members. Please try again.');
      setBoardMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, [boardId]);

  // Single useEffect that depends on fetchBoardMembers
  useEffect(() => {
    if (!boardId) {
      navigate('/dashboard');
      return;
    }
    fetchBoardMembers();
  }, [boardId, navigate, fetchBoardMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedDate = new Date(dueDate).toISOString();

      

      const response = await fetch(`${API_BASE_URL}/card/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId,
          title,
          description,
          assign_to,
          dueDate: formattedDate,
          position: 1  // Changed to 1 for "To Do"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create card');
      }

      // Navigate back to the board's tasks view
      navigate(`/tasks/${boardId}`);
    } catch (err) {
      
      setError(err.message || 'Failed to create card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className='card-title mb-4'>Add New Card</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter card title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assigned To</Form.Label>
              {loadingMembers ? (
                <div className="text-muted">
                  <span className="spinner-border spinner-border-sm me-2" />
                  Loading board members...
                </div>
              ) : (
                <Form.Select
                  value={assign_to}
                  onChange={(e) => setAssignTo(e.target.value)}
                  required
                >
                  <option value="">Select a board member...</option>
                  {boardMembers.map((member) => (
                    <option 
                      key={member.user_id} 
                      value={member.user_id}
                    >
                      {member.email}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter card description"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading || loadingMembers}
                style={{ minWidth: '120px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating...
                  </>
                ) : 'Add Card'}
              </Button>
              <Button 
                type="button" 
                variant="outline-secondary"
                onClick={() => navigate(`/tasks/${boardId}`)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default AddCardForm;