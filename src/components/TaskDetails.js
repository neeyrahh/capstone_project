import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaTag, FaBell, FaListAlt, FaCheckSquare } from 'react-icons/fa';
import '../styles/Styles.css';

const mockTasks = [
  {
    CardID: 1,
    Title: 'Design MongoDB collections',
    Description: 'Design the necessary collections in MongoDB for storing users, tasks, and boards. Define relationships between collections using references.',
    Priority: 'High',
    AssignedTo: 'Naznin',
    DueDate: '2024-10-05',
    Status: 'In Progress',
    Checklist: [
      { id: 1, text: 'Create Users collection schema', completed: true },
      { id: 2, text: 'Create Tasks collection schema', completed: true },
      { id: 3, text: 'Create Boards collection schema and set up relationships', completed: true },
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
    return <div className="loading">Loading...</div>;
  }

  const completedItems = task.Checklist.filter(item => item.completed).length;
  const progress = (completedItems / task.Checklist.length) * 100;

  return (
    <div className="task-details-container">
      <div className="task-header">
        <h1 className="task-title">{task.Title}</h1>
        <span className={`status-label ${task.Status.toLowerCase()}`}>{task.Status}</span>
      </div>
      
      <div className="task-info">
        <div className="task-info-item">
          <FaUser className="task-icon" /> <span className='task-icon-text'>{task.AssignedTo}</span>
        </div>
        <div className="task-info-item">
          <FaTag className="task-icon" /> <span className='task-icon-text'>{task.Priority}</span>
        </div>
        <div className="task-info-item">
          <FaBell className="task-icon" /> <span className='task-icon-text'>Watch</span>
        </div>
      </div>

      <div className="task-section">
        <h3 className="task-section-title"><FaListAlt className="section-icon" /> Description</h3>
        <p className="task-description">{task.Description}</p>
      </div>

      <div className="task-section">
        <h3 className="task-section-title"><FaCheckSquare className="section-icon" /> Checklist</h3>
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        <div className="checklist">
          {task.Checklist.map(item => (
            <div key={item.id} className="checklist-item">
              <input type="checkbox" className="checklist-checkbox" checked={item.completed} readOnly />
              <span className={item.completed ? 'completed' : ''}>{item.text}</span>
            </div>
          ))}
        </div>
        {/* <button className="add-item-button">Add an item</button> */}
      </div>

      <div className="task-actions">
        <button className="button-primary">Edit</button>
        {/* <button className="button-secondary">Hide checked items</button> */}
        <button className="button-danger">Delete</button>
      </div>
    </div>
  );
};

export default TaskDetails;




// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import '../styles/TaskDetails.css';

// // Mock data for task details
// const mockTasks = [
//   {
//     CardID: 1,
//     Title: 'Implement Task Details Screen',
//     Description: 'Create the Task Details screen where users can view more information.',
//     Priority: 'High',
//     AssignedTo: 'Naznin',
//     DueDate: '2024-10-05',
//     Status: 'In Progress',
//     Checklist: [
//       { id: 1, text: 'Implement the design in React', completed: true },
//       { id: 2, text: 'Add buttons for actions like "Edit Task" and "Delete Task"', completed: true },
//       { id: 3, text: 'Test the responsiveness', completed: false },
//       { id: 4, text: 'Collaborate with the backend team', completed: false }
//     ]
//   },
// ];

// const TaskDetails = () => {
//   const { cardId } = useParams();
//   const [task, setTask] = useState(null);

//   useEffect(() => {
//     const selectedTask = mockTasks.find(task => task.CardID === parseInt(cardId));
//     setTask(selectedTask);
//   }, [cardId]);

//   if (!task) {
//     return <div>Loading...</div>;
//   }

//   const completedItems = task.Checklist.filter(item => item.completed).length;
//   const progress = (completedItems / task.Checklist.length) * 100;

//   return (
//     <div className="task-details-container">
//       <h1 className="task-title">{task.Title}</h1>
      
//       <div className="task-section">
//         <h3 className="task-section-title">Description</h3>
//         <div className="task-section-content">
//           <p>{task.Description}</p>
//         </div>
//       </div>
      
//       <div className="task-section">
//         <h3 className="task-section-title">Details</h3>
//         <div className="task-section-content">
//           <p><strong>Assigned To:</strong> {task.AssignedTo}</p>
//           <p><strong>Due Date:</strong> {task.DueDate}</p>
//           <p><strong>Status:</strong> <span className="label">{task.Status}</span></p>
//           <p><strong>Priority:</strong> <span className="label">{task.Priority}</span></p>
//         </div>
//       </div>

//       <div className="task-section">
//         <h3 className="task-section-title">Checklist</h3>
//         <div className="task-section-content">
//           {task.Checklist.map(item => (
//             <div key={item.id} className="checklist-item">
//               <input type="checkbox" className="checklist-checkbox" checked={item.completed} readOnly />
//               <span>{item.text}</span>
//             </div>
//           ))}
//           <div className="progress-bar-container">
//             <div className="progress-bar" style={{ width: `${progress}%` }}></div>
//           </div>
//         </div>
//       </div>

//       <div className="task-actions">
//         <button className="button-primary">Edit Task</button>
//         <button className="button-danger">Delete Task</button>
//       </div>
//     </div>
//   );
// };

// export default TaskDetails;
