import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Styles.css';
import { API_BASE_URL } from './Config';

const EditCard = () => {
  const { boardId, cardId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    position: '',
    assign_to: '' 
  });
  const [boardMembers, setBoardMembers] = useState([]);

  // Fetch card details
  const fetchCardDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${boardId}`, {
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
  
      const data = await response.json();
     
  
      // Check if the data structure is what you expect
      if (data && data[1] && data[1].length > 0) {
        const card = data[1][0]; 
  
        const formattedDate = new Date(card.dueDate).toISOString().slice(0, 16); 
  
        setFormData({
          title: card.title || '',
          description: card.description || '',
          dueDate: formattedDate,
          position: card.position || '1',
          assign_to: card.assign_to?._id || '', 
        });
  
       
      } else {
        
        throw new Error('Invalid card data structure');
      }
    } catch (err) {
    
    } finally {
      setLoading(false);
    }
  }, [boardId]);
  


  const fetchBoardMembers = useCallback(async () => {
    try {
    
      const response = await fetch(`${API_BASE_URL}/board-members/${boardId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch board members');
      }

      const data = await response.json();
      

      if (data && data.board_members && Array.isArray(data.board_members)) {
        setBoardMembers(data.board_members);
      } else {
    
      }
    } catch (err) {
      setError('Failed to load board members');
     
    }
  }, [boardId]);

  useEffect(() => {
    fetchCardDetails();
    fetchBoardMembers();
  }, [fetchCardDetails, fetchBoardMembers]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
     
      const response = await fetch(`${API_BASE_URL}/card/update/${cardId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dueDate: new Date(formData.dueDate).toISOString(),
          position: Number(formData.position),
        }),
      });

      const data = await response.json();
      

      if (response.ok) {
        alert('Card updated successfully!');
        navigate(`/tasks/${boardId}`);
      } else {
        throw new Error(data.msg || 'Failed to update card');
      }
    } catch (err) {
      setError(err.message || 'Failed to update card. Please try again.');
     
    } finally {
      setLoading(false);
    }
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  if (loading && !formData.title) {
    return <div className="loading">Loading...</div>;
  }


  return (
    <div className="task-details-container">
      <div className="task-header">
        <button
          className="back-button"
          onClick={() => navigate(`/task/${boardId}/${cardId}`)}
        >
          <FaArrowLeft /> Back to Task
        </button>
        <h1>Edit Task</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-control"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="assign_to">Assign To</label>
          <select
            id="assign_to"
            name="assign_to"
            value={formData.assign_to}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select a member</option>
            {boardMembers.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate(`/task/${boardId}/${cardId}`)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCard;
