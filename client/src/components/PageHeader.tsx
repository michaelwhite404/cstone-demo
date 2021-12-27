import React, { ReactNode } from "react";

export default function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div className="page-header">
      <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>{children}</h1>
    </div>
  );
}
