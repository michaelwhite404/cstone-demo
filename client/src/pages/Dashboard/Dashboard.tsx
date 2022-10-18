import { Link } from "react-router-dom";
import { EmployeeModel } from "../../../../src/types/models";
import { useAuth, useDocTitle } from "../../hooks";

const links = [
  {
    to: "/students",
    heading: "Students",
    text: "View, edit and filter students",
    show: () => true,
  },
  { to: "/devices", heading: "Devices", text: "View, manage and edit devices.", show: () => true },
  {
    to: "/textbooks",
    heading: "Textbooks",
    text: "View, manage and and checkout textbooks",
    show: () => true,
  },
  {
    to: "/lions-den",
    heading: "Aftercare",
    text: "View sessions from Aftercare",
    show: (user: EmployeeModel) =>
      user.departments && user.departments.find((dept) => dept.name === "Aftercare") ? true : false,
  },
];

const getLinks = (user: EmployeeModel) => links.filter((resource) => resource.show(user));

export default function Dashboard() {
  useDocTitle("Dashboard | School App");
  const user = useAuth().user!;
  const links = getLinks(user);

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
