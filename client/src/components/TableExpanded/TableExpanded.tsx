import { Fragment, useCallback } from "react";
import { Column, useExpanded, useTable, UseTableRowProps } from "react-table";

interface TableExpandedProps<T> {
  columns: Column[];
  data: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  enableRowsPicker?: boolean;
}

interface Row<D extends object = {}> extends UseTableRowProps<D> {
  isExpanded?: boolean;
}

export default function TableExpanded<T extends object = {}>({
  columns,
  data,
}: TableExpandedProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows: rs,
    prepareRow,
    visibleColumns,
    // state /* : { expanded }, */,
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
    },
    useExpanded // We can useExpanded to track the expanded state
    // for sub components too!
  );

  const rows: Row<T>[] = rs;

  const renderRowSubComponent = useCallback(
    ({ original }) => (
      <pre
        style={{
          fontSize: "10px",
        }}
      >
        <code>{JSON.stringify({ values: original.updates }, null, 2)}</code>
      </pre>
    ),
    []
  );

  return (
    <>
      {/* <pre>
        <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
      </pre> */}
      <table className="table-wrapper" {...getTableProps()}>
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
              // Use a React.Fragment here so the table markup is still valid
              <Fragment {...row.getRowProps()}>
                <tr>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ original: row.original })}
                      {console.log(row.original)}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <br />
    </>
  );
}
