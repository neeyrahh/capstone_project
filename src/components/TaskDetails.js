import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/TaskDetails.css';

// Mock data for task details
const mockTasks = [
  {
    CardID: 1,
    Title: 'Implement Task Details Screen',
    Description: 'Create the Task Details screen where users can view more information.',
    Priority: 'High',
    AssignedTo: 'Naznin',
    DueDate: '2024-10-05',
    Status: 'In Progress',
    Checklist: [
      { id: 1, text: 'Implement the design in React', completed: true },
      { id: 2, text: 'Add buttons for actions like "Edit Task" and "Delete Task"', completed: true },
      { id: 3, text: 'Test the responsiveness', completed: false },
      { id: 4, text: 'Collaborate with the backend team', completed: false }
    ]
  },
];

const TaskDetails = () => {
  const { cardId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const selectedTask = mockTasks.find(task => task.CardID === parseInt(cardId));
    setTask(selectedTask);
  }, [cardId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  const completedItems = task.Checklist.filter(item => item.completed).length;
  const progress = (completedItems / task.Checklist.length) * 100;

  return (
    <div className="task-details-container">
      <h1 className="task-title">{task.Title}</h1>
      
      <div className="task-section">
        <h3 className="task-section-title">Description</h3>
        <div className="task-section-content">
          <p>{task.Description}</p>
        </div>
      </div>
      
      <div className="task-section">
        <h3 className="task-section-title">Details</h3>
        <div className="task-section-content">
          <p><strong>Assigned To:</strong> {task.AssignedTo}</p>
          <p><strong>Due Date:</strong> {task.DueDate}</p>
          <p><strong>Status:</strong> <span className="label">{task.Status}</span></p>
          <p><strong>Priority:</strong> <span className="label">{task.Priority}</span></p>
        </div>
      </div>

      <div className="task-section">
        <h3 className="task-section-title">Checklist</h3>
        <div className="task-section-content">
          {task.Checklist.map(item => (
            <div key={item.id} className="checklist-item">
              <input type="checkbox" className="checklist-checkbox" checked={item.completed} readOnly />
              <span>{item.text}</span>
            </div>
          ))}
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button className="button-primary">Edit Task</button>
        <button className="button-danger">Delete Task</button>
      </div>
    </div>
  );
};

export default TaskDetails;
