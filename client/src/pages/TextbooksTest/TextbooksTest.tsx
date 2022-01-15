import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import classnames from "classnames";
import { TextbookSetModel } from "../../../../src/types/models/textbookSetTypes";
import Badge from "../../components/Badge/Badge";
import PageHeader from "../../components/PageHeader";
import { APITextbookSetsResponse } from "../../types/apiResponses";
import "./TextbooksTest.sass";
import ContentPanels from "./ContentPanels";
import { Icon } from "@blueprintjs/core";
import AddTextbook from "./AddTextbook";
import { useWindowSize } from "../../hooks";
import FadeIn from "../../components/FadeIn";

interface LetterGroup {
  letter: string;
  children: TextbookSetModel[];
}
interface TextbookContextProps {
  getTextbookSets: () => Promise<void>;
}

export const TextbookContext = createContext<TextbookContextProps>({} as TextbookContextProps);
type PageState = "blank" | "view" | "add";

export default function TextbooksTest() {
  const [letterGroup, setLetterGroup] = useState<LetterGroup[]>([]);
  const [pageState, setPageState] = useState<PageState>("blank");
  const [selected, setSelected] = useState<TextbookSetModel>();
  const [width] = useWindowSize();

  useEffect(() => {
    getTextbookSets();
  }, []);
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

  const handleAddTextbookClick = () => {
    setPageState("add");
    setSelected(undefined);
  };

  const handleSetClick = (set: TextbookSetModel) => {
    pageState !== "view" && setPageState("view");
    setSelected(set);
  };

  return (
    <TextbookContext.Provider value={{ getTextbookSets }}>
      <div className="flex" style={{ height: "100%" }}>
        {!(width < 767 && pageState !== "blank") && (
          <aside className="side-table">
            <div className="side-table-top">
              <PageHeader text="Textbooks" />
              <p>Search directory of many books</p>
              <button
                className="create-textbook-button"
                onClick={handleAddTextbookClick}
                disabled={pageState === "add"}
              >
                <Icon icon="plus" color="#0566c3" style={{ marginRight: "0.5rem" }} />
                <span style={{ fontWeight: 500 }}>Create New Textbook</span>
              </button>
            </div>
            <div className="side-table-content">
              <FadeIn>
                {letterGroup.map((group) => (
                  <div className="letter-group" key={group.letter}>
                    <div className="letter-header">{group.letter}</div>
                    <ul className="letter-list">
                      {group.children.map((set) => (
                        <li onClick={() => handleSetClick(set)} key={set.slug}>
                          <div
                            className={classnames("book-set", {
                              selected: selected?._id === set._id,
                            })}
                          >
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
                                {set.title}
                              </span>
                              <Badge text={set.count.toString()} color="blue" noDot />
                            </span>
                            <div className="book-subject">{set.class}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </FadeIn>
            </div>
          </aside>
        )}
        <main className="main-content">
          {pageState === "view" && selected && (
            <ContentPanels
              textbook={selected}
              setSelected={setSelected}
              setPageState={setPageState}
            />
          )}
          {pageState === "add" && (
            <AddTextbook setPageState={setPageState} setSelected={setSelected} />
          )}
        </main>
      </div>
    </TextbookContext.Provider>
  );
}
