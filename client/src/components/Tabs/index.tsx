import classNames from "classnames";
import { ReactNode } from "react";
import "./Tabs.sass";

export default function Tabs({ children }: { children?: ReactNode }) {
  return <div className="tabs">{children}</div>;
}

interface TabProps {
  name: string;
  current?: boolean;
  onClick?: () => void;
}

function Tab({ name, current, onClick }: TabProps) {
  const className = classNames("tab", { current });
  return (
    <div
      className={className}
      aria-current={current ? "page" : undefined}
      onClick={() => onClick?.()}
    >
      {name}
    </div>
  );
}

Tabs.Tab = Tab;
