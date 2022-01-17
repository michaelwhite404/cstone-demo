//@ts-nocheck
import { useState } from "react";
import { useExpanded, useGroupBy, useTable } from "react-table";
import CreateTextbookButton from "../../pages/TextbooksTest/CreateTextbookButton";
import FadeIn from "../FadeIn";
import PageHeader from "../PageHeader";
import "./SideTable.sass";

export default function SideTable({
  columns,
  data,
  rowComponent: Component,
  groupBy,
}: {
  columns: {
    id?: string;
    Header: string;
    accessor?: string | ((original: any) => string);
  }[];
  data: any[];
  rowComponent: (props: any) => JSX.Element;
  groupBy: string | string[];
}) {
  const [selected, setSelected] = useState();
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

  const handleSelect = (subRow: any) => {
    setSelected(subRow);
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
                    className="side-table-row"
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
