import classNames from "classnames";
import React, { ReactNode } from "react";

export default function MainContentFooter({
  children,
  align,
}: {
  children?: ReactNode;
  align: "left" | "center" | "right";
}) {
  const className = classNames("main-content-footer", { [`mcf-${align}`]: align });

  return <div className={className}>{children}</div>;
}
