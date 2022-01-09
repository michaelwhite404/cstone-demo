import axios from "axios";
import React, { useEffect, useState } from "react";
import { TextbookSetModel } from "../../../src/types/models/textbookSetTypes";
import PageHeader from "../components/PageHeader";
import { APITextbookSetsResponse } from "../types/apiResponses";

interface LetterGroup {
  letter: string;
  children: TextbookSetModel[];
}

export default function TextbooksTest() {
  const [letterGroup, setLetterGroup] = useState<LetterGroup[]>([]);
  useEffect(() => {
    getTextbookSets();

    async function getTextbookSets() {
      const res = await axios.get<APITextbookSetsResponse>("/api/v2/textbooks", {
        params: {
          sort: "title",
        },
      });

      let groups = res.data.data.textbooks.reduce((r, e) => {
        let letter = e.title[0].toUpperCase();
        if (!r[letter]) r[letter] = { letter, children: [e] };
        else r[letter].children.push(e);
        return r;
      }, {} as { [letter: string]: LetterGroup });

      const letterGroup = Object.values(groups).sort((a, b) => {
        var nameA = a.letter;
        var nameB = b.letter;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      setLetterGroup(letterGroup);
    }
  }, []);

  return (
    <div className="flex" style={{ height: "100%" }}>
      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          width: "24rem",
          backgroundColor: "white",
          borderRight: "1px #e5e7eb solid",
          height: "100%",
        }}
      >
        <div>
          <PageHeader text="Textbooks" />
          <p>
            {/* Search directory of {textbookSets.map((s) => s.count).reduce((a, b) => a + b, 0)} books */}
          </p>
        </div>
        <div style={{ display: "flex" }}>Me</div>
      </aside>
    </div>
  );
}
