import { Column, useExpanded, useTable, UseTableRowProps } from "react-table";

interface TableExpandedProps<T> {
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
              <>
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
