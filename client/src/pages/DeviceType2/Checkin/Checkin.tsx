import { ReactNode } from "react";
import CheckinForm from "./CheckinForm";
import CheckinErrorForm from "./CheckinErrorForm";
import "./Checkin.sass";
import CheckinButton from "./CheckinButton";

function Checkin({ children }: { children: ReactNode }) {
  return <div className="device-checkin-container">{children}</div>;
}

Checkin.Form = CheckinForm;
Checkin.ErrorForm = CheckinErrorForm;
Checkin.Button = CheckinButton;

export default Checkin;
