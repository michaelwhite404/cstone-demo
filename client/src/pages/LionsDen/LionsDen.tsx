import React from "react";
import Tabs from "../../components/Tabs";
import { useDocTitle } from "../../hooks";

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
      <div className="hidden sm:block">
        <nav className="" aria-label="Tabs">
          <Tabs>
            {tabs.map((tab) => (
              <Tabs.Tab name={tab.name} current={tab.current} />
              // <div
              //   key={tab.name}
              //   className="tab"

              // >

              // </div>
              // <a
              //   key={tab.name}
              //   href={tab.href}
              //   // className={}
              //   aria-current={tab.current ? "page" : undefined}
              // >
              //   {tab.name}
              // </a>
            ))}
          </Tabs>
        </nav>
      </div>
    </div>
  );
}
