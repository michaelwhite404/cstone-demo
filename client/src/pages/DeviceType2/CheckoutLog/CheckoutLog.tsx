import { ReactNode } from "react";
import CheckoutLogRow from "./CheckoutLogRow";
import "./CheckoutLog.sass";
import classNames from "classnames";

function CheckoutLog({ children, length }: { children: ReactNode; length: number }) {
  return (
    <div className="device-checkout-history-container">
      <div className={classNames("device-checkout-history-wrapper", { none: !length })}>
        {children}
      </div>
    </div>
  );
}

CheckoutLog.Row = CheckoutLogRow;

export default CheckoutLog;
