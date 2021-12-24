import { Column, useExpanded, useTable, UseTableRowProps } from "react-table";
import "./TableExpanded.sass";

interface TableExpandedProps<T> extends Pick<React.HTMLAttributes<HTMLTableElement>, "className"> {
  columns: Column[];
  data: T[];
  renderRowSubComponent: ({ original }: { original: any }) => JSX.Element;
}

interface Row<D extends object = {}> extends UseTableRowProps<D> {
  isExpanded?: boolean;
}

export default function TableExpanded<T extends object = {}>({
  columns,
  data,
  renderRowSubComponent,
  className = "",
}: TableExpandedProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows: rs,
    prepareRow,
    visibleColumns,
    // state
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
    },
    useExpanded
  );

  const rows: Row<T>[] = rs;

  return (
    <>
      <table className={"table-wrapper table-expanded " + className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <>
                <tr className="normal-row">
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr className="expanded-row">
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent({ original: row.original })}
                    </td>
                  </tr>
                ) : null}
              </>
            );
          })}
        </tbody>
      </table>
      <br />
    </>
  );
}
