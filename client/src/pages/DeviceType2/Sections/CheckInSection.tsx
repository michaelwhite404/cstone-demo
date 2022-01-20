import { useState } from "react";
import { DeviceModel } from "../../../../../src/types/models/deviceTypes";
import Checkin from "../Checkin";
import DevicePane from "../DevicePane";

export default function CheckInSection({ device }: { device?: DeviceModel }) {
  type CheckInState = "passed" | "error";
  const [radio, setRadio] = useState<CheckInState | undefined>(undefined);
  const [error, setError] = useState({
    title: "",
    description: "",
  });

  const handleRadioChange = (value: string) => setRadio(value as CheckInState);

  const handleInputChange = (name: string, value: string) => setError({ ...error, [name]: value });

  const submittable =
    radio === "passed" ||
    (radio === "error" && error.title.length > 0 && error.description.length > 0);

  const handleCheckin = () => {
    if (submittable) return;
  };

  return (
    <DevicePane heading="Check In">
      <Checkin>
        <div style={{ width: "65%" }}>
          <Checkin.Form device={device} radioValue={radio} onRadioChange={handleRadioChange} />
          {radio === "error" && (
            <Checkin.ErrorForm value={error} onInputChange={handleInputChange} />
          )}
        </div>
        <div style={{ width: "35%" }}></div>
      </Checkin>
    </DevicePane>
  );
}
