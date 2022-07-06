import { useDocTitle } from "../../hooks";
import { Month } from "./Calendar";

export default function Timesheet() {
  useDocTitle("Timesheet | Cornerstone App");
  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Timesheet</h1>
      </div>
      <Month month="July" year={2022} />
    </div>
  );
}
