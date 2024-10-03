import React, { useState, useEffect } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';


const mockTasks = [
  {
    CardID: 1,
    Title: 'Task 1',
    Description: 'This is the description of Task 1.',
    Priority: 'High',
    AssignedTo: 'Azhar',
    DueDate: '2024-10-05',
    Status: 'To Do'
  },
  {
    CardID: 2,
    Title: 'Task 2',
    Description: 'This is the description of Task 2.',
    Priority: 'Medium',
    AssignedTo: 'Arthur',
    DueDate: '2024-10-10',
    Status: 'To Do'
  },
  {
    CardID: 3,
    Title: 'Task 3',
    Description: 'This is the description of Task 3.',
    Priority: 'Low',
    AssignedTo: 'Adyl',
    DueDate: '2024-10-07',
    Status: 'In Progress'
  }
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

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>{task.Title}</Card.Title>
          <Card.Text>
            <strong>Description:</strong> {task.Description}<br />
            <strong>Priority:</strong> {task.Priority}<br />
            <strong>Assigned to:</strong> {task.AssignedTo}<br />
            <strong>Due Date:</strong> {task.DueDate}<br />
            <strong>Status:</strong> {task.Status}
          </Card.Text>
          <Button variant="primary" className="me-2">Edit Task</Button>
          <Button variant="danger">Delete Task</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskDetails;
