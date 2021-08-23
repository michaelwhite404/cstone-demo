import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";
import { useDocTitle } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import TextbooksTable from "./TextbooksTable";

export default function Textbooks() {
  useDocTitle("Textbooks | Cornerstone App");
  const [textbooks, setTextbooks] = useState<TextbookModel[]>([])

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "textbookSet.title"},
      { Header: "Book #", accessor: "bookNumber" },
      { Header: "Quality", accessor: "quality" },
      { Header: "Status", accessor: "status" },
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
            active: true
          }
        })
        setTextbooks(res.data.data.books)
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data)
      }
    }
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Textbooks</h1>
      </div>
     <TextbooksTable columns={columns} data={data} />
    </div>
  );
}
