import capitalize from "capitalize";
import React from "react";
import { StudentDevice } from "../../../../src/types/models";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import TableWrapper from "../../components/TableWrapper";

interface Props {
  devices: StudentDevice[];
}

export default function StudentDevicesTable({ devices }: Props) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-4 ">Name</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Quality</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device._id}>
              <td className="pl-4 pr-6 py-2.5 font-medium whitespace-nowrap">{device.name}</td>
              <td>{device.brand}</td>
              <td>{capitalize(device.deviceType)}</td>
              <td>
                <DeviceStatusBadge status={device.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
