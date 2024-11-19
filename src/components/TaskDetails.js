import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaTag, FaBell, FaListAlt, FaCheckSquare } from 'react-icons/fa';
import '../styles/Styles.css';

const TaskDetails = () => {
  const { boardId, cardId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Review requirements', completed: false },
    { id: 2, text: 'Implementation', completed: false },
    { id: 3, text: 'Testing', completed: false },
    { id: 4, text: 'Documentation', completed: false }
  ]);

  const fetchCardDetails = useCallback(async () => {
    try {
      
      const response = await fetch(`http://localhost:5000/api/card/${cardId}`, {
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
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        setLoading(true);
      
        
        // NOTE: Updated URL format based on your backend API structure
        const url = `http://localhost:5000/api/card/${cardId}`;
       

        const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

      

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
         
        }

        if (response.ok) {
          alert('Card deleted successfully!');
          navigate(`/tasks/${boardId}`);
        } else {
          // More specific error messages based on status
          switch (response.status) {
            case 404:
              throw new Error('Card not found. It may have been already deleted.');
            case 401:
              throw new Error('You are not authorized to delete this card.');
            case 403:
              throw new Error('You do not have permission to delete this card.');
            default:
              throw new Error(data?.msg || 'Failed to delete card. Please try again.');
          }
        }
      } catch (err) {
        
        setError(err.message || 'Failed to delete task. Please try again.');
        setLoading(false);
      }
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
        // onClick={() => navigate(`/task/${boardId}/${cardId}/edit`)}
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
        // onClick={handleDeleteCard}
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