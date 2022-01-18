import { InputGroup } from "@blueprintjs/core";
import axios from "axios";
import pluralize, { singular } from "pluralize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import EmptyState from "../../components/EmptyState/EmptyState";
import MainContent from "../../components/MainContent";
import PageHeader from "../../components/PageHeader";
import SideTable from "../../components/SideTable/SideTable";
import { useWindowSize } from "../../hooks";
import { grades } from "../../utils/grades";
import DeviceData from "./DeviceData";

export default function DeviceType2() {
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const { deviceType } = useParams<{ deviceType: string }>();
  const [pageState, setPageState] = useState<"blank" | "device">("blank");
  const [selected, setSelected] = useState<DeviceModel>();
  const width = useWindowSize()[0];
  const [filter, setFilter] = useState("");

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
      { Header: "Name", accessor: "name" },
      { Header: "Brand", accessor: "brand" },
      { Header: "Serial Number", accessor: "serialNumber" },
      { Header: "MAC Address", accessor: "macAddress" },
      { Header: "Status", accessor: "status" },
      { Header: "Student", accessor: (original: DeviceModel): string => getLastUser(original) },
    ],
    []
  );

  const handleSelection = (device: DeviceModel) => {
    setPageState("device");
    setSelected(device);
  };
  const handleBack = () => {
    setPageState("blank");
    setSelected(undefined);
  };

  return (
    <>
      <div style={{ display: "flex", height: "100%" }}>
        {!(width < 768 && pageState !== "blank") && (
          <SideTable<DeviceModel>
            data={data}
            columns={columns}
            rowComponent={FakeComp}
            groupBy="brand"
            onSelectionChange={handleSelection}
            selected={selected?._id || ""}
            filterValue={filter}
          >
            <div className="side-table-top">
              <PageHeader text={deviceType} />
              <InputGroup
                className="search"
                leftIcon="search"
                placeholder="Search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              {/* <p>Search directory of many books</p> */}
              {/**border-radius: 8px;
    box-shadow: 0px 0px 2px 1px #c6c6c6; */}
            </div>
          </SideTable>
        )}
        <MainContent>
          {pageState === "blank" && (
            <EmptyState fadeIn>
              <div style={{ fontWeight: 500, textAlign: "center" }}>
                Select a {singular(deviceType)}
              </div>
            </EmptyState>
          )}
          {pageState === "device" && selected && (
            <DeviceData device={selected} onBack={handleBack} />
          )}
        </MainContent>
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
