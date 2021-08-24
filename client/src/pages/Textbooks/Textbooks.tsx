import { Drawer } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";
import { useDocTitle } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import CheckoutTable from "./CheckoutTable";
import TextbooksTable from "./TextbooksTable";

export default function Textbooks() {
  useDocTitle("Textbooks | Cornerstone App");
  const [textbooks, setTextbooks] = useState<TextbookModel[]>([]);
  const [selected, setSelected] = useState<TextbookModel[]>([]);
  const [open, setOpen] = useState(false);

  const canCheckOut = selected.filter((t) => t.status === "Available");

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "textbookSet.title" },
      { Header: "Book #", accessor: "bookNumber" },
      { Header: "Quality", accessor: "quality" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Student",
        accessor: "lastUser.fullName",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => {
          return original?.status === "Checked Out" ? original.lastUser.fullName : "";
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
      <TextbooksTable
        columns={columns}
        data={data}
        setSelected={setSelected}
        setOpen={setOpen}
        canCheckOut={canCheckOut}
      />
      <Drawer
        position="bottom"
        size="50%"
        usePortal
        isOpen={open}
        onClose={() => setOpen(false)}
        hasBackdrop
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        title="Check Out"
      >
        <div
          style={{
            width: "100%",
            height: "calc(100% - 30px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <CheckoutTable data={canCheckOut} />
        </div>
        {/* {selected.map((t) => `${t.textbookSet.title} (Book ${t.bookNumber})`)} */}
      </Drawer>
    </div>
  );
}
