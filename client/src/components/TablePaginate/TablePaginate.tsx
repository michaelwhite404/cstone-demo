import { TableInstance, usePagination, UsePaginationInstanceProps, useTable } from "react-table";
import "./TablePaginate.sass";

export default function TablePaginate({ columns, data, pageSize = 10 }: any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize },
    },
    usePagination
  ) as TableInstance & UsePaginationInstanceProps<object>;
  return (
    <div>
      <table className="table-wrapper table-paginate" {...getTableProps()}>
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
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div></div>
    </div>
  );
}
