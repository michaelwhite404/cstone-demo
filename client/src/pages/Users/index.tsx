import React from "react";
import Tabs from "../../components/Tabs";

export default function Users() {
  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Users</h1>
        <p>Manage the team and account permissions here</p>
      </div>
      <div className="mt-4">
        <Tabs>
          <Tabs.Tab current>Users</Tabs.Tab>
          <Tabs.Tab>Departments</Tabs.Tab>
          <Tabs.Tab>Groups</Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
}
