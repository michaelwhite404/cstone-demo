import { Button, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { XCircleIcon } from "@heroicons/react/solid";

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

interface Props {
  booksToAdd: PreBook[];
  changeBook: (index: number, key: keyof PreBook, value: string) => void;
  deleteBook: (index: number) => void;
}

export default function AddBooksTable({ booksToAdd, changeBook, deleteBook }: Props) {
  return (
    <table>
      <colgroup>
        {[10, 20, 32, 32, 6].map((w) => (
          <col span={1} style={{ width: `${w}%` }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {["", "Book #", "Quality", "Status", ""].map((h) => (
            <th className="sticky-header">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {booksToAdd.map((book, index) => (
          <TableRow
            book={book}
            key={`book-index-${index}`}
            index={index}
            changeBook={changeBook}
            deleteBook={deleteBook}
          />
        ))}
      </tbody>
    </table>
  );
}

function TableRow({
  index,
  book,
  changeBook,
  deleteBook,
}: {
  index: number;
  book: PreBook;
  changeBook: (index: number, key: keyof PreBook, value: string) => void;
  deleteBook: (index: number) => void;
}) {
  const handleDelete = () => deleteBook(index);

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
      <td className="add-input">
        {index > 0 && <Button icon="trash" minimal intent="danger" onClick={handleDelete} />}
      </td>
    </tr>
  );
}
