import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Added for navigation

const COLORS = ["#2996ff", "#e8651d", "#ff0000b3", "#861de8e3", "#9a1de8"];
const data = [
  { name: "Total Task", value: 30 },
  { name: "Started", value: 20 },
  { name: "In-Progress", value: 25 },
  { name: "Done", value: 15 },
];

const Dashboard = () => {
  const navigate = useNavigate(); // Use navigate hook for routing

  // Function to handle click event for adding a new board
  const handleAddBoardClick = () => {
    navigate("/add-board"); // Redirects to AddBoardForm component
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p className="lead">Below is the overview of your tasks. Manage your tasks effectively.</p>

      {/* Existing dashboard content for task statistics */}
      <div className="row mb-4">
        <div className="col-md-12 d-flex pb-4">
          <div className="card shadow-sm flex-fill" style={{ backgroundColor: "#b4b4b41c", color: "#212529", border: "none" }}>
            <div className="card-body d-flex flex-column align-items-left">
              <h5 className="card-title text-left">Task Statistics</h5>
              <div className="row w-120">
                {/* Task Statistic Cards */}
                <div className="col-md-3 mb-3 card-body d-flex flex-column align-items-left">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: "#1d84e8b3", color: "#ffffff", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Total Task</h6>
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3 card-body d-flex flex-column align-items-left">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: "#e8651dba", color: "#ffffff", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Started</h6>
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: "#ff00008f", color: "#ffffff", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Inprogress</h6>
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: "#861de8a6", color: "#ffffff", border: "none" }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Done</h6>
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Distribution Pie Chart and Table Side by Side */}
        <div className="col-md-12 d-flex mb-4">
          <div className="col-md-6 d-flex pe-3">
            <div className="card shadow-sm flex-fill" style={{ backgroundColor: "#b4b4b41c", color: "#212529", border: "none" }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 className="card-title text-left">Task Distribution</h5>
                <PieChart width={400} height={300}>
                  <Pie data={data} cx={200} cy={120} stroke="0" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={2} dataKey="value">
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>

          {/* Task Distribution Table */}
          <div className="col-md-6 d-flex ps-3">
            <div className="card shadow-sm flex-fill" style={{ backgroundColor: "#f4f5f7", color: "#212529", border: "none" }}>
              <div className="card-body">
                <h5 className="card-title">Task Distribution Table</h5>
                <div className="table-responsive">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Task Type</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((task, index) => (
                      <tr key={index}>
                        <td>{task.name}</td>
                        <td><strong>{task.value}</strong></td>
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

      {/* Recent Activity */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow-sm" style={{ backgroundColor: "#b4b4b41c", color: "#212529", border: "none" }}>
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <ul className="list-group">
                {/* Add any dynamic or static activity logs here */}
              </ul>
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
