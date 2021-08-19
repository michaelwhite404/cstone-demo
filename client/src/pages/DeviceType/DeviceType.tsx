import axios from "axios";
import pluralize from "pluralize";
import React, { useEffect, useMemo, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import Table from "../../components/Table/Table";
import useWindowSize from "../../hooks/useWindowSize";
// import DEVICE_COLUMNS from "./DeviceColumns";

export default function DeviceType() {
  const { deviceType } = useRouteMatch<{ deviceType: string }>().params;
  const [width] = useWindowSize();
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name", width: (width - 619) / 4 },
      { Header: "Brand", accessor: "brand", width: (width - 619) / 4 },
      { Header: "Serial Number", accessor: "serialNumber", width: 275, minWidth: 275 },
      { Header: "MAC Address", accessor: "macAddress", width: (width - 619) / 4 },
      { Header: "Status", accessor: "status", width: (width - 619) / 4 },
    ],
    [width]
  );
  const data = useMemo(() => devices, [devices]);
  useEffect(() => {
    getDevicesByType();

    async function getDevicesByType() {
      const res = await axios.get("/api/v2/devices", {
        params: {
          deviceType: pluralize.singular(deviceType),
          sort: "name",
          limit: 2000,
        },
      });
      setDevices(res.data.data.devices);
    }
  }, [deviceType]);

  return (
    <div>
      <h1 style={{ textTransform: "capitalize", marginBottom: "8px" }}>{deviceType}</h1>
      <span
        style={{ color: "lightblue", fontWeight: 500 }}
      >{`Check ${deviceType} in and out`}</span>
      <div className="table-wrapper" style={{ marginTop: "10px" }}>
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}
