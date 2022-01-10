import { Button, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { PanelActions } from "@blueprintjs/core/lib/esm/components/panel-stack2/panelTypes";
import { XCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { TextbookSetModel } from "../../../../../src/types/models/textbookSetTypes";
import { TextbookModel } from "../../../../../src/types/models/textbookTypes";

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

interface AddBookProps extends PanelActions {
  textbook: TextbookSetModel;
  books: TextbookModel[];
}

const defaultPreBook = (bookNumber: number): PreBook => ({
  passed: true,
  bookNumber,
  quality: "Excellent",
  status: "Available",
});

export default function AddBookPanel({ textbook, books, ...props }: AddBookProps) {
  const [booksToAdd, setBooksToAdd] = useState<PreBook[]>([
    defaultPreBook(books[books.length - 1].bookNumber + 1),
  ]);

  const changeBook = (index: number, key: keyof PreBook, value: string) => {
    const copiedBooks = booksToAdd.map((book) => ({ ...book, passed: true }));
    const book = copiedBooks.find((_, i) => i === index)!;
    if (key === "bookNumber") {
      book.bookNumber = Number(value);
      if (book.bookNumber === 0 || isNaN(book.bookNumber)) {
        book.passed = false;
      }
    } else {
      // @ts-ignore
      book[key] = value;
    }
    copiedBooks[index] = book;
    findDuplicateIndexes(copiedBooks);
    setBooksToAdd(copiedBooks);
  };

  const findDuplicateIndexes = (preBooks: PreBook[]) => {
    const obj: { [x: number]: number[] } = {};
    const dupeIndexes: number[] = [];
    preBooks.forEach((book, index) => {
      obj[book.bookNumber] ? obj[book.bookNumber].push(index) : (obj[book.bookNumber] = [index]);
    });

    for (const num in obj) if (obj[num].length > 1) dupeIndexes.push(...obj[num]);
    preBooks.forEach(
      (book, index) => (book.passed = !dupeIndexes.includes(index) && book.passed === true)
    );
  };

  const addRow = () =>
    setBooksToAdd((books) => [...books, defaultPreBook(books[books.length - 1].bookNumber + 1)]);

  return (
    <div className="main-content-inner-wrapper">
      <div className="main-content-header">
        <span style={{ fontWeight: 500, fontSize: 16 }}>Add {textbook.title} Book</span>
      </div>
      <div
        style={{
          width: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <table>
          <colgroup>
            <col span={1} style={{ width: "10%" }} />
            <col span={1} style={{ width: "30%" }} />
            <col span={1} style={{ width: "30%" }} />
            <col span={1} style={{ width: "30%" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="sticky-header"></th>
              <th className="sticky-header">Book Number</th>
              <th className="sticky-header">Quality</th>
              <th className="sticky-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {booksToAdd.map((book, index) => (
              <TableRow
                book={book}
                key={`book-index-${index}`}
                index={index}
                changeBook={changeBook}
              />
            ))}
          </tbody>
        </table>
        <div style={{ padding: 20 }}>
          <Button onClick={addRow} icon="add" text="Add Another Book" />
        </div>
      </div>

      <div className="main-content-footer">
        <div className="bp3-dialog-footer-actions">
          <Button text="Cancel" onClick={props.closePanel} />
          <Button text="Submit" intent="primary" disabled />
        </div>
      </div>
    </div>
  );
}

function TableRow({
  index,
  book,
  changeBook,
}: {
  index: number;
  book: PreBook;
  changeBook: (index: number, key: keyof PreBook, value: string) => void;
}) {
  return (
    <tr key={`book-index-${index}`}>
      <td style={{ textAlign: "center" }} className="add-input">
        {!book.passed && <XCircleIcon color="#c50f0f" width={25} />}
      </td>
      <td className="add-input">
        <InputGroup
          value={`${book.bookNumber}`}
          style={{ width: 50 }}
          onChange={(e) => changeBook(index, "bookNumber", e.target.value)}
          className="add-input"
        />
      </td>
      <td className="add-input">
        <HTMLSelect
          options={["Excellent", "Good", "Acceptable", "Poor", "Lost"]}
          value={book.quality}
          onChange={(e) => changeBook(index, "quality", e.target.value)}
          className="add-input"
        />
      </td>
      <td className="add-input">
        <HTMLSelect
          options={["Available", "Replaced", "Not Available"]}
          value={book.status}
          onChange={(e) => changeBook(index, "status", e.target.value)}
          className="add-input"
        />
      </td>
    </tr>
  );
}
