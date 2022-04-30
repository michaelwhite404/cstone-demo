import { useEffect } from "react";
import axios from "axios";

import Tabs from "../../components/Tabs";
import { useDocTitle } from "../../hooks";
import Sessions from "./Sessions";

const tabs = [
  { name: "Sessions", href: "#", current: true },
  { name: "Students", href: "#", current: false },
];

export default function LionsDen() {
  useDocTitle("Lions Den | Cornerstone App");

  useEffect(() => {
    getSessions();
  });

  const getSessions = async () => {
    const res = await axios.get("/api/v2/aftercare/attendance", {
      params: { "signOutDate[gte]": "04-23-2022", "signOutDate[lte]": "04-24-2022" },
    });
    console.log(res.data.data);
  };

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Lions Den</h1>
      </div>
      {/* Tabs */}
      <div className="hidden sm:block">
        <nav className="" aria-label="Tabs">
          <Tabs>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.name} name={tab.name} current={tab.current} />
            ))}
          </Tabs>
        </nav>
      </div>
      <div>
        <Sessions />
      </div>
    </div>
  );
}
