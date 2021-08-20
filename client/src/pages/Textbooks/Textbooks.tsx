import { useDocTitle } from "../../hooks";

export default function Textbooks() {
  useDocTitle("Textbooks | Cornerstone App");

  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Textbooks</h1>
      </div>
    </div>
  );
}
