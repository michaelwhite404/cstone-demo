import { Drawer, Toaster } from "@blueprintjs/core";
import axios from "axios";
import capitalize from "capitalize";
import pluralize from "pluralize";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import Badge from "../../components/Badge/Badge";
import BadgeColor from "../../components/Badge/BadgeColor";
import Table from "../../components/Table/Table";
import { useDocTitle, useWindowSize } from "../../hooks";
import { grades } from "../../utils/grades";
import DeviceContent from "./DeviceContent";

export default function DeviceType() {
  const { deviceType } = useRouteMatch<{ deviceType: string }>().params;
  useDocTitle(`${capitalize(deviceType)} | Cornerstone App`);
  const toasterRef = useRef<Toaster>(null);
  const [width] = useWindowSize();
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | undefined>(undefined);

  const statusColor: { [x: string]: BadgeColor } = {
    Available: "emerald",
    "Checked Out": "red",
    Broken: "yellow",
    "Not Available": "blue",
  };

  const updateDevice = (id: string, newDevice: DeviceModel) => {
    const copiedDevices = [...devices];
    const index = copiedDevices.findIndex((device) => device._id === id);
    copiedDevices[index] = newDevice;
    setDevices(copiedDevices);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: (width - 619) / 5,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }) => {
          return (
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`/device-logos/${original.brand}-Logo.png`}
                alt={`${original.brand} Logo`}
                style={{ width: 30, marginRight: 10 }}
              />
              <span className="device-name" onClick={() => setSelectedDevice(original)}>
                {original.name}
              </span>
            </span>
          );
        },
      },
      { Header: "Brand", accessor: "brand", width: (width - 619) / 5 },
      { Header: "Serial Number", accessor: "serialNumber", width: 275, minWidth: 275 },
      { Header: "MAC Address", accessor: "macAddress", width: (width - 619) / 5 },
      {
        Header: "Status",
        accessor: "status",
        width: (width - 619) / 5,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }) => {
          const { status } = original;

          return <Badge color={statusColor[status]} text={original.status} />;
        },
      },
      {
        Header: "Student",
        accessor: "lastUser",
        width: (width - 619) / 5,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }) => {
          return original.status === "Checked Out" && original.lastUser
            ? `${original.lastUser?.fullName} (${grades[original.lastUser?.grade]})`
            : "";
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="page-header">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>{deviceType}</h1>
      </div>
      <Table columns={columns} data={data} sortBy="name" />
      <Drawer
        isOpen={selectedDevice ? true : false}
        onClose={() => setSelectedDevice(undefined)}
        usePortal
        size="70%"
        hasBackdrop
        canEscapeKeyClose={false}
        canOutsideClickClose={true}
        title={
          <div>
            {selectedDevice?.name}{" "}
            {<Badge color={statusColor[selectedDevice?.status!]} text={selectedDevice?.status!} />}
          </div>
        }
      >
        {selectedDevice && (
          <DeviceContent
            device={selectedDevice}
            setSelectedDevice={setSelectedDevice}
            updateDevice={updateDevice}
            toasterRef={toasterRef}
          />
        )}
      </Drawer>
      <Toaster position="top-right" ref={toasterRef} />
    </div>
  );
}
