import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Styles.css';

const AddBoardForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/board/create", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Board created successfully!");
        navigate('/dashboard'); // Navigate to the dashboard
      } else {
        alert(data.msg || "Error creating board");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-board-form">
      <h2>Create New Board</h2>
      <div className="form-group">
        <label>Board Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-control"
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
      <button type="submit" className="btn btn-primary">Create Board</button>
    </form>
  );
};

export default AddBoardForm;
