import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Table, Button } from "react-bootstrap"; // Added Button import
import { useNavigate } from "react-router-dom";

const COLORS = ["#2996ff", "#e8651d", "#ff0000b3", "#861de8e3", "#9a1de8"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/boards", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch boards");
        }

        const data = await response.json();
        const boards = data.boards;

        setBoardData(boards);

        const pieData = [
          { name: "Total Boards", value: boards.length },
          {
            name: "Started",
            value: boards.filter((board) => board.status === "started").length,
          },
          {
            name: "In Progress",
            value: boards.filter((board) => board.status === "in-progress")
              .length,
          },
          {
            name: "Done",
            value: boards.filter((board) => board.status === "done").length,
          },
        ];
        setPieData(pieData);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  const handleAddBoardClick = () => {
    navigate("/add-board");
  };

  const handleViewBoard = (boardId) => {
    navigate(`/tasks/${boardId}`);
  };

  return (
    <div className="dashboard-container p-4">
      <h1 className="mb-3">Dashboard</h1>
      <p className="lead mb-4">Below is the overview of your boards. Manage your boards effectively.</p>

      <div className="row">
        {/* Statistics Cards */}
        <div className="col-12 mb-4">
          <div className="card shadow-sm" style={{ backgroundColor: "#b4b4b41c", border: "none" }}>
            <div className="card-body">
              <h5 className="card-title mb-4">Board Statistics</h5>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100" style={{ backgroundColor: "#1d84e8b3", color: "white", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Total Boards</h6>
                      <p className="stat-val h3 mb-0">{boardData.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100" style={{ backgroundColor: "#e8651dba", color: "white", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Started</h6>
                      <p className="stat-val h3 mb-0">
                        {boardData.filter((board) => board.status === "started").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100" style={{ backgroundColor: "#ff00008f", color: "white", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">In Progress</h6>
                      <p className="stat-val h3 mb-0">
                        {boardData.filter((board) => board.status === "in-progress").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100" style={{ backgroundColor: "#861de8a6", color: "white", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Done</h6>
                      <p className="stat-val h3 mb-0">
                        {boardData.filter((board) => board.status === "done").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Table */}
        <div className="col-12">
          <div className="row">
            {/* Pie Chart */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100" style={{ backgroundColor: "#b4b4b41c", border: "none" }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Board Distribution</h5>
                  <div className="d-flex justify-content-center">
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
            </div>

            {/* Boards Table */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100" style={{ backgroundColor: "#f4f5f7", border: "none" }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Boards Information</h5>
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
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
                              <span 
                                className={`status-badge status-${board.status.toLowerCase()}`}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.85em',
                                  backgroundColor: board.status === 'active' ? '#28a745' : 
                                                board.status === 'started' ? '#007bff' : 
                                                board.status === 'in-progress' ? '#ffc107' : 
                                                board.status === 'done' ? '#6c757d' : '#dc3545',
                                  color: 'white',
                                  display: 'inline-block'
                                }}
                              >
                                {board.status}
                              </span>
                            </td>
                            
                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewBoard(board._id)}
                                style={{
                                  backgroundColor: '#4CAF50',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '4px 12px',
                                  fontSize: '0.85em'
                                }}
                              >
                                View Tasks
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        className="floating-action-button" 
        onClick={handleAddBoardClick}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        +
      </button>
    </div>
  );
};

export default Dashboard;