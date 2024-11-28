import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  FaTag, FaBell, FaListAlt, FaCheckSquare } from 'react-icons/fa';
import '../styles/Styles.css';
import { API_BASE_URL } from './Config';

const TaskDetails = () => {
  const { boardId, cardId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Review requirements', completed: false },
    { id: 2, text: 'Implementation', completed: false },
    { id: 3, text: 'Testing', completed: false },
    { id: 4, text: 'Documentation', completed: false }
  ]);

  const fetchCardDetails = useCallback(async () => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/card/${cardId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch card details');
      }

      const data = await response.json();
     
      setTask(data.card || data); // Handle both possible response formats

    } catch (err) {
     
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchCardDetails();
  }, [fetchCardDetails]);

  const handleChecklistToggle = (itemId) => {
    setChecklist(prevChecklist =>
      prevChecklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const calculateProgress = () => {
    const completedItems = checklist.filter(item => item.completed).length;
    return (completedItems / checklist.length) * 100;
  };
 
  const handleDeleteCard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/card/delete/${cardId}`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorMsg = (await response.json()).msg || 'Unknown error';
        throw new Error(errorMsg);
      }
  
      alert("Card deleted successfully!");
      navigate(`/tasks/${boardId}`);
    } catch (error) {
      console.error("Delete Error:", error);
      setError(error.message || "Failed to delete card.");
    }
  };
  

  // Add this log to verify the cardId and boardId
  useEffect(() => {
    
  }, [cardId, boardId]);
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="task-details-container">
        <div className="error-message">{error}</div>
        <button className="button-primary" 
        onClick={() => navigate(`/tasks/${boardId}`)}
        >
          Back to Board
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-container">
        <div className="error-message">Task not found</div>
        <button className="button-primary" onClick={() => navigate(`/tasks/${boardId}`)}>
          Back to Board
        </button>
      </div>
    );
  }

  const getStatusFromPosition = (position) => {
    switch (Number(position)) {
      case 1: return 'To Do';
      case 2: return 'In Progress';
      case 3: return 'Completed';
      case 4: return 'Approved';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (position) => {
    switch (Number(position)) {
      case 1: return 'to-do';
      case 2: return 'in-progress';
      case 3: return 'completed';
      case 4: return 'approved';
      default: return '';
    }
  };

  return (
    <div className="task-details-container">
      <div className="task-header">
        <h1 className="task-title">{task.title}</h1>
        <span className={`status-label ${getStatusClass(task.position)}`}>
          {getStatusFromPosition(task.position)}
        </span>
      </div>
      
      <div className="task-info">
        {/* <div className="task-info-item">
          <FaUser className="task-icon" /> 
          <span className='task-icon-text'>
            {assignedUser ? assignedUser.email : task.assign_to}
          </span>
        </div> */}
        <div className="task-info-item">
          <FaTag className="task-icon" /> 
          <span className='task-icon-text'>
            {getStatusFromPosition(task.position)}
          </span>
        </div>
        <div className="task-info-item">
          <FaBell className="task-icon" /> 
          <span className='task-icon-text'>
            Due: {new Date(task.dueDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="task-section">
        <h3 className="task-section-title">
          <FaListAlt className="section-icon" /> Description
        </h3>
        <p className="task-description">{task.description}</p>
      </div>

      <div className="task-section">
        <h3 className="task-section-title">
          <FaCheckSquare className="section-icon" /> Checklist
        </h3>
        <div className="checklist-header">
          <div className="checklist-progress">
            {Math.round(calculateProgress())}%
          </div>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <div className="checklist">
          {checklist.map(item => (
            <div key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleChecklistToggle(item.id)}
                className="checklist-checkbox"
              />
              <span className={item.completed ? 'completed' : ''}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="task-actions">
      <button 
        className="button-primary"
        onClick={() => navigate(`/task/${boardId}/${cardId}/edit`)}
        disabled={loading}
      >
        Edit
      </button>
      <button 
        className="button-primary"
        onClick={() => navigate(`/tasks/${boardId}`)}
        disabled={loading}
      >
        Back to Board
      </button>
      <button 
        className="button-danger"
        onClick={handleDeleteCard}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
    {error && (
      <div className="error-message mt-3">
        {error}
      </div>
    )}
    </div>
  );
};

export default TaskDetails;