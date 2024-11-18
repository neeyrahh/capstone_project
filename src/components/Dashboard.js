import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const COLORS = ["#2996ff", "#e8651d", "#ff0000b3", "#861de8e3", "#9a1de8"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // Fetch boards from the API using fetch
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/boards", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch boards");
        }

        const data = await response.json();
        const boards = data.boards;

        // Set the board data
        setBoardData(boards);

        // Prepare PieChart data
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

  // Function to handle click event for adding a new board
  const handleAddBoardClick = () => {
    navigate("/add-board"); // Redirects to AddBoardForm component
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p className="lead">Below is the overview of your boards. Manage your boards effectively.</p>

      {/* Existing dashboard content for board statistics */}
      <div className="row mb-4">
        <div className="col-md-12 d-flex pb-4">
          <div
            className="card shadow-sm flex-fill"
            style={{
              backgroundColor: "#b4b4b41c",
              color: "#212529",
              border: "none",
            }}
          >
            <div className="card-body d-flex flex-column align-items-left">
              <h5 className="card-title text-left">Board Statistics</h5>
              <div className="row w-120">
                <div className="col-md-3 mb-3">
                  <div
                    className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
                    style={{
                      backgroundColor: "#1d84e8b3",
                      color: "#ffffff",
                      border: "none",
                    }}
                  >
                    <div className="card-body text-center">
                      <h6 className="card-title">Total Boards</h6>
                      <p className="stat-val">{boardData.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div
                    className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
                    style={{
                      backgroundColor: "#e8651dba",
                      color: "#ffffff",
                      border: "none",
                    }}
                  >
                    <div className="card-body text-center">
                      <h6 className="card-title">Started</h6>
                      <p className="stat-val">
                        {
                          boardData.filter((board) => board.status === "started")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div
                    className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
                    style={{
                      backgroundColor: "#ff00008f",
                      color: "#ffffff",
                      border: "none",
                    }}
                  >
                    <div className="card-body text-center">
                      <h6 className="card-title">In Progress</h6>
                      <p className="stat-val">
                        {
                          boardData.filter(
                            (board) => board.status === "in-progress"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div
                    className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center"
                    style={{
                      backgroundColor: "#861de8a6",
                      color: "#ffffff",
                      border: "none",
                    }}
                  >
                    <div className="card-body text-center">
                      <h6 className="card-title">Done</h6>
                      <p className="stat-val">
                        {
                          boardData.filter((board) => board.status === "done")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart and Boards Information Table Side by Side */}
        <div className="col-md-12 d-flex mb-4">
          {/* Pie Chart */}
          <div className="col-md-6 d-flex pe-3">
            <div
              className="card shadow-sm flex-fill"
              style={{
                backgroundColor: "#b4b4b41c",
                color: "#212529",
                border: "none",
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 className="card-title text-left">Board Distribution</h5>
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

          {/* Boards Information Table */}
          <div className="col-md-6 d-flex ps-3">
            <div
              className="card shadow-sm flex-fill"
              style={{
                backgroundColor: "#f4f5f7",
                color: "#212529",
                border: "none",
              }}
            >
              <div className="card-body">
                <h5 className="card-title">Boards Information</h5>
                <div className="table-responsive">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Board Name</th>
                        <th>Status</th>
                        <th>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardData.map((board) => (
                        <tr key={board._id}>
                          <td>{board.name}</td>
                          <td>{board.status}</td>
                          <td>{board.owner_id}</td>
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

      {/* Floating Action Button for Adding a New Board */}
      <button className="floating-action-button" onClick={handleAddBoardClick}>
        +
      </button>
    </div>
  );
};

export default Dashboard;
