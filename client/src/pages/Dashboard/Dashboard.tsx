import { Link } from "react-router-dom";
import { useDocTitle } from "../../hooks";

const links = [
  { to: "/students", heading: "Students", text: "View, edit and filter students" },
  { to: "/devices", heading: "Devices", text: "View, manage and edit devices." },
  { to: "/textbooks", heading: "Textbooks", text: "View, manage and and checkout textbooks" },
  { to: "/lions-den", heading: "Lions Den", text: "View sessions from Lions' Den" },
];

export default function Dashboard() {
  useDocTitle("Dashboard | Cornerstone App");
  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="page-header">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Dashboard</h1>
      </div>
      <div className="device-wrapper">
        <div className="device-grid-container">
          {links.map(({ to, heading, text }) => (
            <Link key={heading} className="device-item" to={to}>
              <div>
                <div className="device-heading">{heading}</div>
                <div>{text}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
