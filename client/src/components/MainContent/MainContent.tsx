import React, { ReactNode } from "react";
import "./MainContent.sass";

export default function MainContent({ children }: { children?: ReactNode }) {
  return <main className="main-content">{children}</main>;
}
