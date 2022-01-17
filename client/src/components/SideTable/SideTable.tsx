// @ts-nocheck
import { useEffect, useState } from "react";
import { Row, useExpanded, useGroupBy, useTable } from "react-table";
import CreateTextbookButton from "../../pages/TextbooksTest/CreateTextbookButton";
import FadeIn from "../FadeIn";
import PageHeader from "../PageHeader";
import classNames from "classnames";
import "./SideTable.sass";

type BasicDoc = { _id: string; [x: string]: any };

export default function SideTable<T extends BasicDoc>({
  columns,
  data,
  rowComponent: Component,
  groupBy,
  onSelectionChange,
  selected,
}: {
  columns: {
    id?: string;
    Header: string;
    accessor?: string | ((original: T) => string);
  }[];
  data: any[];
  rowComponent: (props: any) => JSX.Element;
  groupBy: string | string[];
  onSelectionChange?: (_id: string) => void;
  selected?: string;
}) {
  const [tableSelected, setTableSelected] = useState("");
  const group = typeof groupBy === "string" ? [groupBy] : groupBy;
  const instance = useTable(
    //@ts-ignore
    { data, columns, initialState: { groupBy: group } },
    useGroupBy,
    useExpanded
    // useRowSelect
  );
  const { rows, prepareRow } = instance;

  useEffect(() => {
    selected !== undefined && setTableSelected(selected);
  }, [selected]);

  const handleClick = (subRow: Row<T>) => {
    if (selected === undefined) setTableSelected(subRow.original._id);
    onSelectionChange && onSelectionChange(subRow.original._id);
  };

  return (
    <aside className="side-table">
      <div className="side-table-top">
        <PageHeader text="Textbooks" />
        <p>Search directory of many books</p>
        <CreateTextbookButton fill />
      </div>
      <div className="side-table-content">
        <FadeIn>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div className="side-table-group" key={row.groupByVal}>
                <div className="side-table-header">{row.groupByVal}</div>
                <ul className="side-table-list">
                  {row.subRows.map((subRow) => (
                    <li
                      className={classNames("side-table-row", {
                        "highlight-row": tableSelected === subRow.original._id,
                      })}
                      key={subRow.id}
                      onClick={() => handleClick(subRow)}
                    >
                      <Component {...subRow.original} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </FadeIn>
      </div>
    </aside>
  );
}
