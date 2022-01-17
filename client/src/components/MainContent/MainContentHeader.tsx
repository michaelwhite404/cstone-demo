import React, { ReactNode } from "react";

export default function MainContentHeader({ children }: { children?: ReactNode }) {
  return <div className="main-content-header">{children}</div>;
}
