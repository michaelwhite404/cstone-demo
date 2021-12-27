import {
  TableInstance,
  usePagination,
  UsePaginationInstanceProps,
  UsePaginationState,
  useTable,
} from "react-table";
import PaginationNumbers from "./PaginationNumbers";
import "./TablePaginate.sass";

interface Column {
  Header: string;
  accessor: string;
  Cell?: ({ row: { original } }: { row: { original: any } }) => any;
}

interface TablePaginationProps<T> {
  columns: Column[];
  data: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  enableRowsPicker?: boolean;
}

const defaultPageSizes = [10, 25, 50, 100];

export default function TablePaginate<T>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = defaultPageSizes,
  enableRowsPicker = true,
}: TablePaginationProps<T>) {
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
    // pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state, //: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      // @ts-ignore
      data,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize },
    },
    usePagination
  ) as TableInstance & UsePaginationInstanceProps<object>;

  const cState = state as UsePaginationState<any>;
  const showingText = () => {
    const start = cState.pageIndex * cState.pageSize + 1;
    const end = Math.min((cState.pageIndex + 1) * cState.pageSize, data.length);
    return `Showing ${start} - ${end} of ${data.length}`;
  };
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
      <div className="table-pagination-toolbar">
        <div className="pagination-toolbar-item">
          {enableRowsPicker && (
            <>
              Rows per page:
              <select onChange={(e) => setPageSize(Number(e.target.value))}>
                {pageSizeOptions.map((o) => (
                  <option key={`${o}-rows`}>{o}</option>
                ))}
              </select>
            </>
          )}
        </div>
        <span className="showing-text pagination-toolbar-item">{showingText()}</span>
        <PaginationNumbers
          currentPage={cState.pageIndex + 1}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
          gotoPage={gotoPage}
        />
      </div>
    </div>
  );
}
