import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCardForm = () => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle adding the card, e.g., an API call or state update

    // After successful card addition, navigate back to the tasks page
    navigate('/tasks');
  };

  return (
    <div className="task-details-container">
      <h2 className='task-title'>Add New Card</h2>
      <form onSubmit={handleSubmit} className="add-card-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control"
            placeholder="Enter card title"
          />
        </div>
        <div className="form-group">
          <label>Assigned To</label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
            className="form-control"
            placeholder="Assign to..."
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className='task-actions'>
        <button type="submit" className="button-primary">Add Card</button>
        <button type="button" onClick={() => navigate('/tasks')} className="button-danger">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddCardForm;
