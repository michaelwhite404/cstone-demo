import { Drawer } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";
import { useDocTitle } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import CheckoutTable from "./CheckoutTable";
import TextbooksTable from "./TextbooksTable";
import "./Table.sass";
import BadgeColor from "../../components/Badge/BadgeColor";
import Badge from "../../components/Badge/Badge";
import { numberToGrade } from "../../utils/grades";
import TableToolbox from "../../components/Table/TableToolbox";

export default function Textbooks() {
  useDocTitle("Textbooks | Cornerstone App");
  const [textbooks, setTextbooks] = useState<TextbookModel[]>([]);
  const [selected, setSelected] = useState<TextbookModel[]>([]);
  const [open, setOpen] = useState(false);

  const canCheckOut = selected.filter((t) => t.status === "Available");

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "textbookSet.title",
        Cell: ({ value }: any) => {
          return <span className="set-name">{value}</span>;
        },
      },
      { Header: "Book #", accessor: "bookNumber" },
      {
        Header: "Quality",
        accessor: "quality",
        Cell: ({ row: { original } }: { row: { original?: TextbookModel } }) => {
          const quality = original?.quality;
          const statusColor: { [x: string]: BadgeColor } = {
            Excellent: "teal",
            Good: "lime",
            Acceptable: "sky",
            Poor: "fuchsia",
            Lost: "gray",
          };
          return quality ? <Badge color={statusColor[quality]} text={quality} /> || "" : null;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }: { row: { original?: TextbookModel } }) => {
          const status = original?.status;
          const statusColor: { [x: string]: BadgeColor } = {
            Available: "emerald",
            "Checked Out": "red",
            Replaced: "yellow",
            "Not Available": "blue",
          };
          return status ? <Badge color={statusColor[status]} text={status} /> || "" : null;
        },
      },
      {
        Header: "Student",
        accessor: "lastUser.fullName",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => {
          return original?.status === "Checked Out"
            ? `${original.lastUser.fullName} (${numberToGrade(original.lastUser.grade)})`
            : "";
        },
      },
    ],
    []
  );
  const data = useMemo(() => textbooks, [textbooks]);

  useEffect(() => {
    getTextbooks();

    async function getTextbooks() {
      try {
        const res = await axios.get("/api/v2/textbooks/books", {
          params: {
            sort: "textbookSet,bookNumber",
            active: true,
          },
        });
        setTextbooks(res.data.data.books);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Textbooks</h1>
      </div>
      <div className="table-wrapper">
        <TableToolbox></TableToolbox>
        <TextbooksTable
          columns={columns}
          data={data}
          setSelected={setSelected}
          setOpen={setOpen}
          canCheckOut={canCheckOut}
        />
      </div>
      <Drawer
        position="bottom"
        size="70%"
        usePortal
        isOpen={open}
        onClose={() => setOpen(false)}
        hasBackdrop
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        title="Check Out"
      >
        <CheckoutTable data={canCheckOut} />
      </Drawer>
    </div>
  );
}
