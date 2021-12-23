import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { UseExpandedRowProps } from "react-table";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import { ErrorLogModel } from "../../../../src/types/models/errorLogTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import TableExpanded from "../../components/TableExpanded/TableExpanded";
import { APIError, APIErrorLogResponse } from "../../types/apiResponses";

interface ErrorHistoryProps {
  device: DeviceModel;
}

export default function ErrorHistory({ device }: ErrorHistoryProps) {
  const [errors, setErrors] = useState<ErrorLogModel[]>([]);

  useEffect(() => {
    getErrors();

    async function getErrors() {
      try {
        const res = await axios.get<APIErrorLogResponse>("/api/v2/devices/errors", {
          params: { device: device._id },
        });
        setErrors(res.data.data.errorLogs);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, [device._id]);

  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }: { row: UseExpandedRowProps<object> }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? "👇" : "👉"}</span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        /* Cell: ({ row: { original } }: { row: { original: CheckoutLogModel } }) => {
          let text = "";
          original.checkedIn
            ? original.error
              ? (text = "Checked In /w Error")
              : (text = "Checked In")
            : (text = "Checked Out");
          return <Badge color={statusColor[text]} text={text} />;
        }, */
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Error Created Date",
        accessor: "createdAt",
        Cell: ({ row: { original } }: { row: { original: ErrorLogModel } }) => {
          return new Date(original.createdAt).toLocaleString();
        },
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],
    []
  );

  const data = useMemo(() => errors, [errors]);

  return (
    <div>
      <PaneHeader>Error History</PaneHeader>
      <TableExpanded columns={columns} data={data} />
    </div>
  );
}
