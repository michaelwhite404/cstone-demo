import Tabs from "../../components/Tabs";
import { useDocTitle } from "../../hooks";
import Sessions from "./Sessions";

const tabs = [
  { name: "Sessions", href: "#", current: true },
  { name: "Students", href: "#", current: false },
];

export default function LionsDen() {
  useDocTitle("Lions Den | Cornerstone App");

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Lions Den</h1>
      </div>
      {/* Tabs */}
      <div className="hidden sm:block mb-6">
        <nav className="" aria-label="Tabs">
          <Tabs>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.name} name={tab.name} current={tab.current} />
            ))}
          </Tabs>
        </nav>
      </div>
      <Sessions />
    </div>
  );
}
