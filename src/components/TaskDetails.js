import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTag, FaBell, FaListAlt, FaCheckSquare, FaTrash } from 'react-icons/fa';
import '../styles/Styles.css';
import { API_BASE_URL } from './Config';

const TaskDetails = () => {
  const { boardId, cardId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch card details from the server
  const fetchCardDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/card/${cardId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch card details');
      }

      const data = await response.json();
      setTask(data.card || data);
      setChecklist(data.card?.checklist || []);
    } catch (err) {
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchCardDetails();
  }, [fetchCardDetails]);

  // Toggle checklist item status (completed/uncompleted)
  const handleChecklistToggle = (index) => {
    const updatedChecklist = checklist.map((item, idx) =>
      idx === index ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
  };

  // Add a new checklist item
  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const updatedChecklist = [
      ...checklist,
      { item: newChecklistItem.trim(), completed: false },
    ];
    setChecklist(updatedChecklist);
    setNewChecklistItem('');
  };

  // Save the checklist to the backend
  const saveChecklist = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/card/update/${cardId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          assign_to: task.assign_to,
          checklist,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save checklist');
      }

      const data = await response.json();
      setTask(data.card); // Update task with the latest backend data
      alert('Checklist saved successfully!');
    } catch (error) {
      console.error('Error saving checklist:', error);
      alert('Failed to save checklist.');
    } finally {
      setIsSaving(false);
    }
  };

  // Edit a checklist item
  const handleEditChecklistItem = (index) => {
    setEditIndex(index);
  };

  const handleEditSubmit = (e, index) => {
    if (e.key === 'Enter') {
      setEditIndex(null);
      saveChecklist(); // Save checklist when editing is complete
    }
  };

  // Delete a checklist item
  const handleDeleteChecklistItem = async (checklistItemId) => {
    try {
      console.log("Deleting Checklist Item ID:", checklistItemId);
  
      const response = await fetch(`${API_BASE_URL}/card/${cardId}/checklist/${checklistItemId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });
  
      if (!response.ok) {
        const errorMsg = await response.text(); // Capture backend error message
        throw new Error(`Failed to delete checklist item: ${errorMsg}`);
      }
  
      const data = await response.json();
      console.log("Backend Response:", data);
  
      // Update the checklist state with the updated checklist array
      setChecklist(data.card?.checklist || []);
      alert('Checklist item deleted successfully!');
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      alert('Failed to delete checklist item.');
    }
  };
  

  // Calculate the progress percentage of the checklist
  const calculateProgress = () => {
    const completedItems = checklist.filter((item) => item.completed).length;
    return checklist.length ? (completedItems / checklist.length) * 100 : 0;
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

      alert('Card deleted successfully!');
      navigate(`/tasks/${boardId}`);
    } catch (error) {
      console.error('Delete Error:', error);
      setError(error.message || 'Failed to delete card.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="task-details-container">
        <div className="error-message">{error}</div>
        <button
          className="button-primary"
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
        <button
          className="button-primary"
          onClick={() => navigate(`/tasks/${boardId}`)}
        >
          Back to Board
        </button>
      </div>
    );
  }

  const getStatusFromPosition = (position) => {
    switch (Number(position)) {
      case 1:
        return 'To Do';
      case 2:
        return 'In Progress';
      case 3:
        return 'Completed';
      case 4:
        return 'Approved';
      default:
        return 'Unknown';
    }
  };

  const getStatusClass = (position) => {
    switch (Number(position)) {
      case 1:
        return 'to-do';
      case 2:
        return 'in-progress';
      case 3:
        return 'completed';
      case 4:
        return 'approved';
      default:
        return '';
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
        <div className="task-info-item">
          <FaTag className="task-icon" />
          <span className="task-icon-text">{getStatusFromPosition(task.position)}</span>
        </div>
        <div className="task-info-item">
          <FaBell className="task-icon" />
          <span className="task-icon-text">
            Due: {new Date(task.dueDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
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
          <div className="checklist-progress">{Math.round(calculateProgress())}% Complete</div>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <div className="checklist">
          {checklist.map((item, index) => (
            <div key={index} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleChecklistToggle(index)}
                className="checklist-checkbox"
              />
              {editIndex === index ? (
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) => {
                    const updatedChecklist = [...checklist];
                    updatedChecklist[index].item = e.target.value;
                    setChecklist(updatedChecklist);
                  }}
                  onKeyDown={(e) => handleEditSubmit(e, index)}
                  className="checklist-edit-input"
                />
              ) : (
                <span
                  className={item.completed ? 'completed' : ''}
                  onClick={() => handleEditChecklistItem(index)}
                >
                  {item.item}
                </span>
              )}
              <button
                className="button-icon"
                onClick={() => handleDeleteChecklistItem(item._id)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <div className="checklist-add">
            <input
              type="text"
              placeholder="Add a checklist item"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              className="checklist-input"
            />
            <button
              className="button-primary checklist-add-button"
              onClick={handleAddChecklistItem}
              disabled={!newChecklistItem.trim()}
            >
              Add
            </button>
          </div>
        </div>
        <button
          className="button-primary"
          onClick={saveChecklist}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Checklist'}
        </button>
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
        <button className="button-danger" onClick={handleDeleteCard} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      {error && <div className="error-message mt-3">{error}</div>}
    </div>
  );
};

export default TaskDetails;
