import React from "react";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList } from "react-window";
import useWindowSize from "../../hooks/useWindowSize";
import "./Table.sass";

// const totalAvailableWidth = window.innerWidth - 258;

export default function Table({
  columns,
  data,
}: {
  columns: {
    Header: string;
    accessor: string;
  }[];
  data: any[];
}) {
  const [width] = useWindowSize();
  /* const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  ); */

  // const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, totalColumnsWidth, prepareRow } =
    useTable(
      {
        columns,
        data,
        // defaultColumn,
      },
      useBlockLayout
    );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <div {...getTableProps()} className="table" style={{ width: width - 327 }}>
      <div className="header-row">
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => (
              <div {...column.getHeaderProps()} className="th">
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList height={550} itemCount={rows.length} itemSize={42} width={width - 327}>
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  );
}
