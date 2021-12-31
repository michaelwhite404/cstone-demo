import { Icon } from "@blueprintjs/core";
import { useCallback, useMemo } from "react";
import { UseExpandedRowProps } from "react-table";
import { ErrorLogModel } from "../../../../src/types/models/errorLogTypes";
import DeviceErrorStatusBadge from "../../components/Badges/DeviceErrorStatusBadge";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import TableExpanded from "../../components/TableExpanded/TableExpanded";
import "./ErrorHistory.sass";

interface ErrorHistoryProps {
  errors: ErrorLogModel[];
}

export default function ErrorHistory({ errors }: ErrorHistoryProps) {
  const columns = useMemo(
    () => [
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }: { row: { original: ErrorLogModel } }) => {
          return <DeviceErrorStatusBadge status={original.status} />;
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
            <DeviceErrorStatusBadge status={original.status} />
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
                <DeviceErrorStatusBadge status={update.status} />
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
