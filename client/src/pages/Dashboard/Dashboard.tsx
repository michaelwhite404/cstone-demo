import React from "react";
import { Link } from "react-router-dom";
import { useDocTitle } from "../../hooks";

export default function Dashboard() {
  useDocTitle("Dashboard | Cornerstone App");
  return (
    <div>
      <div className="page-header">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Dashboard</h1>
        <div className="device-wrapper">
          <div className="device-grid-container">
            <Link className="device-item" to="/students">
              <div>
                <div className="device-heading">Students</div>
                <div>View, edit and filter students</div>
              </div>
            </Link>
            <Link className="device-item" to="/devices">
              <div>
                <div className="device-heading">Devices</div>
                <div>View, manage and edit devices.</div>
              </div>
            </Link>
            <Link className="device-item" to="/textbooks">
              <div>
                <div className="device-heading">Textbooks</div>
                <div>View, manage and and checkout textbooks</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
