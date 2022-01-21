import React from "react";
import DevicePane from "../DevicePane";
import ErrorLog from "../ErrorLog";

function ErrorLogSection() {
  return (
    <DevicePane heading="Error History">
      <ErrorLog>
        <ErrorLog.Row />
        <ErrorLog.Row />
        <ErrorLog.Row />
      </ErrorLog>
    </DevicePane>
  );
}
export default ErrorLogSection;
