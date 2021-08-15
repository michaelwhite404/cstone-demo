import axios from "axios";
import pluralize from "pluralize";
import React, { useEffect, useMemo, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTable } from "react-table";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import Table from "../../components/Table";
import DEVICE_COLUMNS from "./DeviceColumns";

export default function DeviceType() {
  const { deviceType } = useRouteMatch<{ deviceType: string }>().params;
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const columns = useMemo(() => DEVICE_COLUMNS, []);
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

  // @ts-ignore
  const tableInstance = useTable({ columns, data });

  return <Table tableInstance={tableInstance} />;
}
