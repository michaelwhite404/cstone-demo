import { Button, Drawer, Toaster } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
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
import CheckinTable from "./CheckinTable";

export default function Textbooks() {
  useDocTitle("Textbooks | Cornerstone App");
  const [textbooks, setTextbooks] = useState<TextbookModel[]>([]);
  const [selected, setSelected] = useState<TextbookModel[]>([]);
  const [open, setOpen] = useState(false);
  const [pageStatus, setPageStatus] = useState<"Viewing" | "Check In" | "Check Out">("Viewing");
  const toasterRef = useRef<Toaster>(null);

  const canCheckOut = selected.filter((t) => t.status === "Available");
  const canCheckIn = selected.filter((t) => t.status === "Checked Out");

  const handleClose = () => {
    setOpen(false);
    setPageStatus("Viewing");
  };

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
          return original?.status === "Checked Out" && original.lastUser
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
        toasterRef.current?.show({
          message: `${(err as AxiosError<APIError>).response!.data}`,
          intent: "danger",
          icon: "cross",
        });
      }
    }
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Textbooks</h1>
      </div>
      <div className="table-wrapper">
        <TableToolbox>
          {canCheckOut.length > 0 && (
            <Button
              onClick={() => {
                setPageStatus("Check Out");
                setOpen(true);
              }}
              intent="primary"
              style={{ margin: "0 15px" }}
            >
              Check Out {canCheckOut.length} Textbooks
            </Button>
          )}
          {canCheckIn.length > 0 && (
            <Button
              onClick={() => {
                setPageStatus("Check In");
                setOpen(true);
              }}
              intent="primary"
            >
              Check In {canCheckIn.length} Textbooks
            </Button>
          )}
        </TableToolbox>
        <TextbooksTable columns={columns} data={data} setSelected={setSelected} />
      </div>
      <Drawer
        position="bottom"
        size="70%"
        usePortal
        isOpen={open}
        onClose={handleClose}
        hasBackdrop
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        title={pageStatus}
      >
        {pageStatus === "Check Out" && (
          <CheckoutTable
            data={canCheckOut}
            setOpen={setOpen}
            setTextbooks={setTextbooks}
            toasterRef={toasterRef}
          />
        )}
        {pageStatus === "Check In" && (
          <CheckinTable
            data={canCheckIn}
            setOpen={setOpen}
            setTextbooks={setTextbooks}
            toasterRef={toasterRef}
          />
        )}
      </Drawer>
      <Toaster position="top-right" ref={toasterRef} />
    </div>
  );
}
