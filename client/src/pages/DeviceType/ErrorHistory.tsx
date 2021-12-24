import { Icon } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UseExpandedRowProps } from "react-table";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import { ErrorLogModel } from "../../../../src/types/models/errorLogTypes";
import Badge from "../../components/Badge/Badge";
import BadgeColor from "../../components/Badge/BadgeColor";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import TableExpanded from "../../components/TableExpanded/TableExpanded";
import { APIError, APIErrorLogResponse } from "../../types/apiResponses";
import "./ErrorHistory.sass";

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
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }: { row: { original: ErrorLogModel } }) => {
          return <Badge color={statusColor[original.status]} text={original.status} />;
        },
        width: 40,
      },
      {
        Header: "Title",
        accessor: "title",
        width: 40,
      },
      {
        Header: "Error Created Date",
        accessor: "createdAt",
        Cell: ({ row: { original } }: { row: { original: ErrorLogModel } }) => {
          return new Date(original.createdAt).toLocaleString();
        },
        width: 40,
      },
      {
        Header: "Description",
        accessor: "description",
        width: 40,
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander]", // It needs an ID
        Cell: ({ row }: { row: UseExpandedRowProps<object> }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <div>
            <span {...row.getToggleRowExpandedProps()}>
              <Icon icon={`chevron-${row.isExpanded ? "down" : "right"}`} size={18} color="black" />
            </span>
          </div>
        ),
        width: 40,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const data = useMemo(() => errors, [errors]);

  const statusColor: { [x: string]: BadgeColor } = {
    Fixed: "emerald",
    Broken: "red",
    "In Repair": "yellow",
    Unfixable: "fuchsia",
  };

  const updateText = (original: ErrorLogModel, index: number) =>
    original.final && index + 1 === original.updates.length
      ? "Final Update"
      : `Update ${index + 1}`;

  const renderRowSubComponent = useCallback(
    ({ original }: { original: ErrorLogModel }) => (
      <div className="error-info">
        <div className="error-basic-info">
          <div className="error-left">
            <div>Title: {original.title}</div>
            <div>Description: {original.description}</div>
          </div>
          <div className="error-right">
            <Badge color={statusColor[original.status]} text={original.status} />
          </div>
          <br />
        </div>
        <div style={{ color: "black" }}>
          {original.updates.length === 0 ? "There are no updates to show" : "Updates"}
        </div>
        <br />
        <div className="error-updates">
          {original.updates.map((update, i) => (
            <div className="error-single-update">
              <div className="error-left">
                <div> {`${updateText(original, i)}: ${update.description}`} </div>
                <div>{new Date(update.createdAt).toLocaleString()}</div>
              </div>
              <div className="error-right">
                <Badge color={statusColor[update.status]} text={update.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div>
      <PaneHeader>Error History</PaneHeader>
      {errors.length > 0 ? (
        <TableExpanded
          columns={columns}
          data={data}
          renderRowSubComponent={renderRowSubComponent}
          className="error-history-table"
        />
      ) : (
        "There is no data to display"
      )}
    </div>
  );
}
