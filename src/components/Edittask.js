import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Styles.css';

const EditCard = () => {
  const { boardId, cardId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    position: ''
  });

  const fetchCardDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/card/${cardId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch card details');
      }

      const data = await response.json();
      console.log('Card data:', data);
      
      // Format the date for the datetime-local input
      const formattedDate = new Date(data.dueDate)
        .toISOString()
        .slice(0, 16); // Format: YYYY-MM-DDTHH:mm

      setFormData({
        title: data.title || '',
        description: data.description || '',
        dueDate: formattedDate,
        position: data.position || '1'
      });
    } catch (err) {
      console.error('Error fetching card:', err);
      setError('Failed to load card details');
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchCardDetails();
  }, [fetchCardDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/card/update/${cardId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          dueDate: new Date(formData.dueDate).toISOString(),
          position: Number(formData.position)
        })
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (response.ok) {
        alert('Card updated successfully!');
        navigate(`/task/${boardId}/${cardId}`);
      } else {
        throw new Error(data.msg || 'Failed to update card');
      }
    } catch (err) {
      console.error('Error updating card:', err);
      setError(err.message || 'Failed to update card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          <label htmlFor="position">Status</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="1">To Do</option>
            <option value="2">In Progress</option>
            <option value="3">Completed</option>
            <option value="4">Approved</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="button-primary"
            disabled={loading}
          >
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