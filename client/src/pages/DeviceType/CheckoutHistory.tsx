import { useEffect, useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import { CheckoutLogModel } from "../../../../src/types/models/checkoutLogTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import axios, { AxiosError } from "axios";
import { APICheckoutLogResponse, APIError } from "../../types/apiResponses";

interface CheckoutHistoryProps {
  device: DeviceModel;
}

export default function CheckoutHistory({ device }: CheckoutHistoryProps) {
  const [checkouts, setCheckouts] = useState<CheckoutLogModel[]>([]);

  useEffect(() => {
    getCheckouts();

    async function getCheckouts() {
      try {
        const res = await axios.get<APICheckoutLogResponse>("/api/v2/devices/logs", {
          params: { device: device._id },
        });
        setCheckouts(res.data.data.deviceLogs);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, [device._id]);

  return (
    <div>
      <PaneHeader>Check Out History</PaneHeader>
      {checkouts.map((log) => (
        <div>
          <div>{log.checkedIn ? "true" : "false"}</div>
          <div>{log.deviceUser}</div>
          <div>{log.checkInDate}</div>
          <div>{log.checkOutDate}</div>
          <hr />
        </div>
      ))}
    </div>
  );
}
