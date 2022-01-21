import classNames from "classnames";
import React, { ReactNode } from "react";
import ErrorLogRow from "./ErrorLogRow";

function ErrorLog({ children }: { children: ReactNode }) {
  return (
    <div className="device-checkout-history-container">
      <div className={classNames("device-checkout-history-wrapper")}>{children}</div>
    </div>
  );
}

ErrorLog.Row = ErrorLogRow;

export default ErrorLog;
