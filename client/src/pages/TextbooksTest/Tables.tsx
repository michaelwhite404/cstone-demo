import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { TextbookSetModel } from "../../../../src/types/models/textbookSetTypes";
import SideTable from "../../components/SideTable/SideTable";
import { APITextbookSetsResponse } from "../../types/apiResponses";
import TextbookSetRow from "./TextbookSetRow/TextbookSetRow";

export default function Tables() {
  const [selected, setSelected] = useState<TextbookSetModel>();

  const [textbookSets, setTextbookSets] = useState<TextbookSetModel[]>([]);

  const data = useMemo(() => textbookSets, [textbookSets]);
  const columns = useMemo(
    () => [
      {
        Header: "Class",
        accessor: "class",
      },
      {
        Header: "Count",
        accessor: "count",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "First Letter",
        id: "firstLetter",
        accessor: ({ title }: { title: string }) => title[0].toUpperCase(),
      },
    ],
    []
  );

  useEffect(() => {
    getTextbookSets();
  }, []);
  async function getTextbookSets() {
    const res = await axios.get<APITextbookSetsResponse>("/api/v2/textbooks", {
      params: {
        sort: "title",
      },
    });
    setTextbookSets(res.data.data.textbooks);
  }

  const handleSelectionChange = (set: TextbookSetModel) => {
    setSelected(set);
  };

  return (
    <SideTable<TextbookSetModel>
      data={data}
      columns={columns}
      rowComponent={TextbookSetRow}
      groupBy="firstLetter"
      onSelectionChange={handleSelectionChange}
    />
  );
}
