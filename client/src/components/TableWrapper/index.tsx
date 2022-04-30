import { ReactNode } from "react";
import "./TableWrapper.sass";

export default function TableWrapper({ children }: { children: ReactNode }) {
  return <div className="table-wrapper">{children}</div>;
}
