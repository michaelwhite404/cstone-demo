import { InputGroup } from "@blueprintjs/core";
import pluralize from "pluralize";
import React from "react";
import {
  useTable,
  useBlockLayout,
  useGlobalFilter,
  TableInstance,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from "react-table";
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
  const [width, height] = useWindowSize();
  /* const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  ); */

  // const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      // defaultColumn,
    },
    useBlockLayout,
    useGlobalFilter
  ) as TableInstance & UseGlobalFiltersInstanceProps<object>;

  const { globalFilter } = state as UseGlobalFiltersState<object>;

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
          {row.cells.map((cell, i) => {
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
    <div className="table-wrapper">
      <div className="table-toolbox">
        <InputGroup
          className="search"
          leftIcon="search"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div {...getTableProps()} className="table" style={{ width: width - 308 }}>
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
          <FixedSizeList
            height={height - 227}
            itemCount={rows.length}
            itemSize={42}
            width={width - 308}
          >
            {RenderRow}
          </FixedSizeList>
        </div>
      </div>
      <div className="table-bottom">
        <span className="table-footer-results">
          Showing {pluralize("Result", rows.length, true)}
        </span>
      </div>
    </div>
  );
}
