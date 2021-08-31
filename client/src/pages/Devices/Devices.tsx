import { Link } from "react-router-dom";
import { useDocTitle } from "../../hooks";
import "./Devices.sass";

export default function Devices() {
  useDocTitle("Devices | Cornerstone App");
  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Devices</h1>
      </div>
      <div className="device-wrapper">
        <div className="device-grid-container">
          <Link className="device-item" to="/devices/chromebooks">
            <img src="/icons/chrome-icon.png" alt="Chrome Icon" />
            <div>
              <div className="device-heading">Chromebooks</div>
              <div>View, edit, check in and check out Chromebooks</div>
            </div>
          </Link>
          <Link className="device-item" to="/devices/tablets">
            <img src="/icons/tablet-icon.png" alt="Tablet Icon" />
            <div>
              <div className="device-heading">Tablets</div>
              <div>View, edit, check in and check out tablets</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
