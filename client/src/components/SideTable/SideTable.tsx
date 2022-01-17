//@ts-nocheck
import { useExpanded, useGroupBy, useTable } from "react-table";
import CreateTextbookButton from "../../pages/TextbooksTest/CreateTextbookButton";
import FadeIn from "../FadeIn";
import PageHeader from "../PageHeader";
import Badge from "../Badge/Badge";
import classnames from "classnames";

export default function SideTable({
  columns,
  data,
}: {
  columns: {
    id?: string;
    Header: string;
    accessor?: string | ((original: any) => string);
  }[];
  data: any[];
}) {
  const instance = useTable(
    //@ts-ignore
    { data, columns, initialState: { groupBy: ["firstLetter"] } },
    useGroupBy,
    useExpanded
  );
  const { rows } = instance;

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
            <div className="letter-group" key={row.groupByVal}>
              <div className="letter-header">{row.groupByVal}</div>
              <ul className="letter-list">
                {row.subRows.map((subRow) => (
                  <li key={subRow.id}>
                    <div className={classnames("book-set")}>
                      <span className="flex">
                        <span
                          style={{
                            fontWeight: 500,
                            marginRight: "0.5rem",
                            maxWidth: 230,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {subRow.values.title}
                        </span>
                        <Badge text={subRow.values.count.toString()} color="blue" noDot />
                      </span>
                      <div className="book-subject">{subRow.values.class}</div>
                    </div>
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
