import axios from "axios";
import pluralize from "pluralize";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import PageHeader from "../../components/PageHeader";
import SideTable from "../../components/SideTable/SideTable";
import { grades } from "../../utils/grades";

export default function DeviceType2() {
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const { deviceType } = useParams<{ deviceType: string }>();

  const getDevicesByType = useCallback(async () => {
    const res = await axios.get("/api/v2/devices", {
      params: {
        deviceType: pluralize.singular(deviceType),
        sort: "name",
        limit: 2000,
      },
    });
    setDevices(res.data.data.devices);
  }, [deviceType]);

  useEffect(() => {
    getDevicesByType();
  }, [getDevicesByType]);

  const data = useMemo(() => devices, [devices]);
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      { Header: "Brand", accessor: "brand" },
      { Header: "Serial Number", accessor: "serialNumber", width: 275, minWidth: 275 },
      { Header: "MAC Address", accessor: "macAddress" },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Student",
        accessor: (original: DeviceModel): string => {
          return getLastUser(original);
        },
      },
    ],
    []
  );

  return (
    <>
      <div style={{ display: "flex", height: "100%" }}>
        <SideTable
          data={data}
          columns={columns}
          rowComponent={FakeComp}
          groupBy="brand"
          // onSelectionChange={handleSetClick}
          // selected={selected?._id || ""}
        >
          <div className="side-table-top">
            <PageHeader text={deviceType} />
            {/* <p>Search directory of many books</p> */}
          </div>
        </SideTable>
      </div>
    </>
  );
}

function FakeComp(device: DeviceModel) {
  const { name, status, serialNumber, macAddress } = device;
  const lastUser = getLastUser(device);
  return (
    <div style={{ padding: "15px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        {name}
        <DeviceStatusBadge status={status} />
      </div>
      <div style={{ color: "#9ca3af", marginBottom: 8, fontSize: 13 }}>
        <div>Serial Number: {serialNumber}</div>
        <div>MAC Address: {macAddress}</div>
      </div>
      {lastUser && <div style={{ fontSize: 13 }}>Student: {lastUser}</div>}
    </div>
  );
}

const getLastUser = (device: DeviceModel) => {
  return device.status === "Checked Out" && device.lastUser
    ? `${device.lastUser?.fullName} (${grades[device.lastUser?.grade]})`
    : "";
};
