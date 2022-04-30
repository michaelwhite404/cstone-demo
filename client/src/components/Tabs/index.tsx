import classNames from "classnames";
import { ReactNode } from "react";
import "./Tabs.sass";

export default function Tabs({ children }: { children?: ReactNode }) {
  return <div className="tabs">{children}</div>;
}

function Tab({ name, current }: { name: string; current?: boolean }) {
  const className = classNames("tab", { current });
  return (
    <div className={className} aria-current={current ? "page" : undefined}>
      {name}
    </div>
  );
}

Tabs.Tab = Tab;
