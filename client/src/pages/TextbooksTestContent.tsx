import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { TextbookSetModel } from "../../../src/types/models/textbookSetTypes";
import { TextbookModel } from "../../../src/types/models/textbookTypes";
import TextbookStatusBadge from "../components/Badges/TextbookStatusBadge";
import TextbookQualityBadge from "../components/Badges/TextbookQualityBadge";
import TablePaginate from "../components/TablePaginate/TablePaginate";
import { APITextbooksResponse } from "../types/apiResponses";
import { numberToGrade } from "../utils/grades";
import PrimaryButton from "../components/PrimaryButton/PrimaryButton";
import { PanelActions } from "@blueprintjs/core/lib/esm/components/panel-stack2/panelTypes";
import AddBookPanel from "./AddBookPanel";

export default function TextbooksTestContent({
  textbook,
  ...props
}: { textbook: TextbookSetModel } & PanelActions) {
  const [books, setBooks] = useState<TextbookModel[]>([]);

  useEffect(() => {
    getBooks();

    async function getBooks() {
      const res = await axios.get<APITextbooksResponse>(`/api/v2/textbooks/${textbook._id}/books`);
      setBooks(res.data.data.books);
    }
  }, [textbook._id]);

  const columns = useMemo(
    () => [
      { Header: "Book #", accessor: "bookNumber" },
      {
        Header: "Quality",
        accessor: "quality",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => (
          <TextbookQualityBadge quality={original.quality} />
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => (
          <TextbookStatusBadge status={original.status} />
        ),
      },
      {
        Header: "Student",
        accessor: "lastUser.fullName",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => {
          return original?.status === "Checked Out" && original.lastUser
            ? `${original.lastUser.fullName} (${numberToGrade(original.lastUser.grade)})`
            : "";
        },
      },
    ],
    []
  );
  const data = useMemo(() => books, [books]);

  const addBookPanel = () =>
    props.openPanel({
      props: {},
      renderPanel: AddBookPanel,
      title: "Panel 2",
    });

  return (
    <div className="main-content-inner-wrapper">
      <div className="main-content-header">
        <span style={{ fontWeight: 500, fontSize: 16 }}>{textbook.title}</span>
        <PrimaryButton onClick={addBookPanel}>+ Add Book</PrimaryButton>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <TablePaginate columns={columns} data={data} pageSize={50} enableRowsPicker={false} />
      </div>
    </div>
  );
}
