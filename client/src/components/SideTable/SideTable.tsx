// @ts-nocheck
import { useState, useEffect } from "react";
import { Row, useExpanded, useGroupBy, useTable } from "react-table";
import CreateTextbookButton from "../../pages/TextbooksTest/CreateTextbookButton";
import FadeIn from "../FadeIn";
import PageHeader from "../PageHeader";
import classNames from "classnames";
import "./SideTable.sass";

export default function SideTable<T = any>({
  columns,
  data,
  rowComponent: Component,
  groupBy,
  onSelectionChange,
}: {
  columns: {
    id?: string;
    Header: string;
    accessor?: string | ((original: T) => string);
  }[];
  data: any[];
  rowComponent: (props: any) => JSX.Element;
  groupBy: string | string[];
  onSelectionChange?: (seletion: T) => void;
}) {
  const [tableSelected, setTableSelected] = useState<Row>();
  const group = typeof groupBy === "string" ? [groupBy] : groupBy;
  const instance = useTable(
    //@ts-ignore
    { data, columns, initialState: { groupBy: group } },
    useGroupBy,
    useExpanded
    // useRowSelect
  );
  const { rows } = instance;
  console.log(rows);

  useEffect(() => {
    onSelectionChange && onSelectionChange(tableSelected?.original);
  }, [onSelectionChange, tableSelected]);

  const handleSelect = (subRow: any) => {
    setTableSelected(subRow);
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
          {rows.map((row) => (
            <div className="side-table-group" key={row.groupByVal}>
              <div className="side-table-header">{row.groupByVal}</div>
              <ul className="side-table-list">
                {row.subRows.map((subRow) => (
                  <li
                    className={classNames("side-table-row", {
                      "highlight-row": tableSelected?.id === subRow.id,
                    })}
                    key={subRow.id}
                    onClick={() => handleSelect(subRow)}
                  >
                    <Component {...subRow.values} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </FadeIn>
      </div>
    </aside>
  );
}
