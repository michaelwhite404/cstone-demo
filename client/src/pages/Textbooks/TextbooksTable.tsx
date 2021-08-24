// @ts-nocheck
import React, { useEffect } from "react";
import { useExpanded, useGroupBy, useRowSelect, useTable } from "react-table";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";

export default function TextbooksTable({
  columns,
  data,
  setSelected,
  setOpen,
  canCheckOut,
}: {
  columns: {
    Header: string;
    accessor: string;
  }[];
  data: any[];
  setSelected: React.Dispatch<React.SetStateAction<TextbookModel[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  canCheckOut: TextbookModel[];
}) {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        // @ts-ignore
        groupBy: ["textbookSet.title"],
        sortBy: ["textbookSet.title, bookNumber"],
      },
    },
    useGroupBy,
    useExpanded,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div style={{ padding: row.canExpand ? "0 25px" : "0 15px 0 35px" }}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    flatRows,
    rows,
    prepareRow,
    // @ts-ignore
    state: { selectedRowIds },
  } = tableInstance;

  const getSelected = (): TextbookModel[] => {
    const arr = [];
    for (const id in selectedRowIds) {
      arr.push(flatRows[id].original);
    }
    return arr;
  };

  const selected = getSelected();

  useEffect(() => {
    setSelected(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowIds]);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th {...column.getHeaderProps()}>
                      {
                        // Render the header
                        column.render("Header")
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      // For educational purposes, let's color the
                      // cell depending on what type it is given
                      // from the useGroupBy hook
                      {...cell.getCellProps()}
                      style={{
                        background: cell.isGrouped
                          ? "#0aff0082"
                          : cell.isAggregated
                          ? "#ffa50078"
                          : cell.isPlaceholder
                          ? "#ff000042"
                          : "white",
                      }}
                      // colSpan={cell.isGrouped ? headerGroups.headers.length -1 : undefined}
                    >
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                          </span>{" "}
                          {cell.render("Cell")} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
      {canCheckOut.length > 0 && (
        <button onClick={() => setOpen(true)}>Check Out {canCheckOut.length} Textbooks</button>
      )}
    </>
  );
}

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});
