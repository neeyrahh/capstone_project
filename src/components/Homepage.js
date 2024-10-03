import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
// import { useEmployeeData } from "./EmployeeData";

const COLORS = ['#2996ff', '#e8651d', '#ff0000b3', '#861de8e3', '#9a1de8'];

const Homepage = () => {
  // const { loading, error, data } = useEmployeeData();

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Database Connection Error!</p>;
  // }

  return (
    <div className="container mt-5">
      <div className="text-left mb-5">
        <h1>Dashboard</h1>
        <p className="lead">Below is the overview of your task,Manage your task effectively.</p>
      </div>
      
     
      <div className="row mb-4">
        <div className="col-md-12 d-flex pb-4">
          <div className="card shadow-sm flex-fill" style={{ backgroundColor: '#b4b4b41c', color: '#212529', border: 'none'}}>
            <div className="card-body d-flex flex-column align-items-left">
              <h5 className="card-title text-left">Task  Statistics</h5>
              <div className="row w-120">
                <div className="col-md-3 mb-3 card-body d-flex flex-column align-items-left">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#1d84e8b3', color: '#ffffff', border:'none' }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Total Employees</h6>
                      {/* <p className="stat-val">{data.totalEmployees}</p> */}
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3 card-body d-flex flex-column align-items-left">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#e8651dba', color: '#ffffff', border:'none' }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Departments</h6>
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#ff00008f', color: '#ffffff', border:'none' }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Upcoming Retirements</h6>
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#861de8a6', color: '#ffffff', border:'none' }}>
                    <div className="card-body text-center">
                      <h6 className="card-title">Active Employees</h6>
                      <p className="stat-val">2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex mb-6">
          <div className="card shadow-sm flex-fill" style={{ backgroundColor: '#b4b4b41c', color: '#212529', border:'none' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title text-left">Employee Distribution by Department</h5>
              <PieChart width={400} height={300}>
                <Pie
                  // data={data.departmentDistribution}
                  cx={200}
                  cy={120}
                  stroke="0"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {/* {data.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))} */}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow-sm" style={{ backgroundColor: '#b4b4b41c', color: '#212529', border:'none' }}>
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <ul className="list-group">
                {/* {data.recentActivity.map((activity, index) => (
                  <li key={index} className="list-group-item" style={{ backgroundColor: '#b4b4b400', color: '#212121' }}>{activity}</li>
                ))} */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
