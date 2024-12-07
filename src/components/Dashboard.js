import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Styles.css";
import { API_BASE_URL } from "./Config";

const COLORS = ["#bac8ff", "#3d53db", "#2a3bb7", "#1a2793", "#1a2793"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]); // Active boards
  const [closedBoards, setClosedBoards] = useState([]); // Closed boards
  const [pieData, setPieData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [error, setError] = useState("");
  const [showClosedBoards, setShowClosedBoards] = useState(false); // Toggle closed boards visibility

  // Fetch active and closed boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const activeResponse = await fetch(`${API_BASE_URL}/boards`, {
          method: "GET",
          credentials: "include",
        });

        if (!activeResponse.ok) {
          throw new Error("Failed to fetch active boards");
        }

        const activeData = await activeResponse.json();
        const activeBoards = activeData.boards;

        setBoardData(activeBoards);

        const pieData = [
          { name: "Total Boards", value: activeBoards.length },
          {
            name: "Started",
            value: activeBoards.filter(
              (board) => board.status === "started"
            ).length,
          },
          {
            name: "In Progress",
            value: activeBoards.filter(
              (board) => board.status === "in-progress"
            ).length,
          },
          {
            name: "Done",
            value: activeBoards.filter((board) => board.status === "done")
              .length,
          },
        ];
        setPieData(pieData);
      } catch (error) {
        console.error("Error fetching active boards:", error);
      }
    };

    const fetchClosedBoards = async () => {
      try {
        const closedResponse = await fetch(`${API_BASE_URL}/closed-boards`, {
          method: "GET",
          credentials: "include",
        });

        if (!closedResponse.ok) {
          throw new Error("Failed to fetch closed boards");
        }

        const closedData = await closedResponse.json();
        setClosedBoards(closedData.boards);
      } catch (error) {
        console.error("Error fetching closed boards:", error);
      }
    };

    fetchBoards();
    fetchClosedBoards();
  }, []);

  const handleAddBoardClick = () => {
    navigate("/add-board");
  };

  const handleViewBoard = (boardId) => {
    navigate(`/tasks/${boardId}`);
  };

  const handleEditBoard = (board) => {
    setSelectedBoard(board);
    setUpdatedName(board.name);
    setUpdatedDescription(board.description);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!updatedName || !updatedDescription) {
      setError("Name and description are required");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/board/update/${selectedBoard._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedName,
            description: updatedDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to update board");
      }

      setBoardData((prevData) =>
        prevData.map((board) =>
          board._id === selectedBoard._id
            ? { ...board, name: updatedName, description: updatedDescription }
            : board
        )
      );

      setShowEditModal(false);
      setSelectedBoard(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseBoard = async (boardId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/board/close/${boardId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to close board");
      }
  
      // Remove the board from the active boards list
      setBoardData((prevData) =>
        prevData.filter((board) => board._id !== boardId)
      );
  
      // Fetch the updated closed boards and add the closed board to the list
      const closedBoard = await response.json();
      setClosedBoards((prevData) => [...prevData, closedBoard.updatedBoard]);
    } catch (err) {
      console.error("Error closing board:", err);
    }
  };
  

  const handleReopenBoard = async (boardId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/board/reopen/${boardId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to reopen board");
      }
  
      // Remove the board from the closed boards list
      setClosedBoards((prevData) =>
        prevData.filter((board) => board._id !== boardId)
      );
  
      // Fetch the updated active boards and add the reopened board to the list
      const reopenedBoard = await response.json();
      setBoardData((prevData) => [...prevData, reopenedBoard.updatedBoard]);
    } catch (err) {
      console.error("Error reopening board:", err);
    }
  };
  

  const handleDeleteBoard = async (boardId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/board/delete/${boardId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete board");
      }

      setClosedBoards((prevData) =>
        prevData.filter((board) => board._id !== boardId)
      );
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  return (
    <div className="dashboard-container p-4">
      <h2 className="dash-heading">Dashboard</h2>
      <p className="lead mb-4">
        Below is the overview of your boards. Manage your boards effectively.
      </p>

      {/* Statistics Section */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: "#fcfcfc", color: "#1a2793" }}>
            <div className="card-body text-center">
              <h6 className="stat-title">Total Boards</h6>
              <p className="h3 mb-0">{boardData.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: "#fcfcfc", color: "#1a2793" }}>
            <div className="card-body text-center">
              <h6 className="stat-title">Started</h6>
              <p className="h3 mb-0">
                {boardData.filter((board) => board.status === "started").length}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: "#fcfcfc", color: "#1a2793" }}>
            <div className="card-body text-center">
              <h6 className="stat-title">In Progress</h6>
              <p className="h3 mb-0">
                {boardData.filter((board) => board.status === "in-progress").length}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: "#fcfcfc", color: "#1a2793" }}>
            <div className="card-body text-center">
              <h6 className="stat-title">Done</h6>
              <p className="h3 mb-0">
                {boardData.filter((board) => board.status === "done").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Pie Chart */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Board Distribution</h5>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx={200}
                  cy={120}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Boards Table */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Boards Information</h5>
              <Table striped bordered hover>
                <thead className="board">
                  <tr>
                    <th>Board Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {boardData.map((board) => (
                    <tr key={board._id}>
                      <td>{board.name}</td>
                      <td>
                        <span className="dash-status">
                          {board.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <Button className="action-button" size="sm" onClick={() => handleViewBoard(board._id)}>
                            View
                          </Button>
                          <Button className="action-button" size="sm" onClick={() => handleEditBoard(board)}>
                            Edit
                          </Button>
                          <Button className="action-button" size="sm" onClick={() => handleCloseBoard(board._id)}>
                            Close
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
{/* Closed Boards Section */}
<div className="mt-4">
  <Button
    onClick={() => setShowClosedBoards(!showClosedBoards)}
    className="action-button" size="mm"
    
  >
    {showClosedBoards ? "Hide Closed Boards" : "Show Closed Boards"}
  </Button>
  {showClosedBoards && (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Closed Boards</h5>
        <Table striped bordered hover>
          <thead className="board">
            <tr>
              <th>Board Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {closedBoards.map((board) => (
              <tr key={board._id}>
                <td>{board.name}</td>
                <td>{board.description}</td>
                <td>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <Button
                      className="action-button"
                      size="sm"
                      variant="success"
                      onClick={() => handleReopenBoard(board._id)}
                    >
                      Reopen
                    </Button>
                    <Button
                      className="action-button"
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteBoard(board._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )}
</div>

      {/* Add Board Button */}
      <button className="floating-action-button" onClick={handleAddBoardClick}>
        +
      </button>

      {/* Edit Board Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Board Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
 
  );
};

export default Dashboard;
