import { Button, Label, Switch } from "@blueprintjs/core";
import { useState } from "react";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";
import BackButton from "../../components/BackButton";
import LabeledInput from "../../components/Inputs/LabeledInput";
import LabeledNumbericInput from "../../components/Inputs/LabeledNumbericInput";
import LabeledSelect from "../../components/Inputs/LabeledSelect";
import { grades } from "../../utils/grades";
import AddBooksTable from "./AddBooksTable";

interface AddTextbookProps {
  setPageState: React.Dispatch<React.SetStateAction<"blank" | "view" | "add">>;
}

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

const defaultPreBook = (bookNumber: number, passed = true): PreBook => ({
  passed,
  bookNumber,
  quality: "Excellent",
  status: "Available",
});

export default function AddTextbook(props: AddTextbookProps) {
  const [data, setData] = useState({ title: "", class: "", grade: 0, num: 1 });
  const [booksToAdd, setBooksToAdd] = useState<PreBook[]>([defaultPreBook(1)]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value }: any = e.target;
    if (name === "grade") value = +value;
    setData({ ...data, [name]: value });
  };
  const handleNumberChange = (valueAsNumber: number) => {
    setData({ ...data, num: valueAsNumber });

    const number = booksToAdd[booksToAdd.length - 1].bookNumber + 1;
    const add = [...booksToAdd, defaultPreBook(number, number > 0)];
    findDuplicateIndexes([], add);
    setBooksToAdd(add);
  };

  const inputs = [
    {
      label: "Textbook Name",
      Component: LabeledInput,
      width: 50,
      props: { required: true, value: data.title, name: "title", onChange: handleDataChange },
    },
    {
      label: "Class",
      Component: LabeledInput,
      width: 50,
      props: { required: true, value: data.class, name: "class", onChange: handleDataChange },
    },
    {
      label: "Grade",
      Component: LabeledSelect,
      width: 23,
      props: {
        required: true,
        options: grades.map((g, i) => ({ label: g, value: i })),
        value: data.grade,
        name: "grade",
        onChange: handleDataChange,
      },
    },
    {
      label: "# of Books To Add",
      Component: LabeledNumbericInput,
      width: 47,
      props: {
        // style: { width: "100px" },
        required: true,
        value: data.num,
        name: "num",
        onValueChange: handleNumberChange,
        min: 1,
        allowNumericCharactersOnly: true,
        fill: true,
      },
    },
  ];

  const changeBook = (index: number, key: keyof PreBook, value: string) => {
    const copiedBooks = booksToAdd.map((book) => ({ ...book, passed: true }));
    const book = copiedBooks.find((_, i) => i === index)!;
    if (key === "bookNumber") {
      const castValue = Number(value);
      book.bookNumber = isNaN(castValue) ? 0 : castValue;
      if (book.bookNumber <= 0) book.passed = false;
    } else {
      // @ts-ignore
      book[key] = value;
    }
    copiedBooks[index] = book;
    findDuplicateIndexes([], copiedBooks);
    setBooksToAdd(copiedBooks);
  };

  const findDuplicateIndexes = (originalBooks: TextbookModel[], preBooks: PreBook[]) => {
    const mergedArray = [
      ...originalBooks.map((b) => b.bookNumber),
      ...preBooks.map((b) => b.bookNumber),
    ];
    const dupes = mergedArray.filter((item, index) => mergedArray.indexOf(item) !== index);
    preBooks.forEach((book) => {
      if (book.bookNumber <= 0) book.passed = false;
      book.passed = !dupes.includes(book.bookNumber) && book.passed === true;
    });
  };

  const deleteBook = (index: number) => setBooksToAdd((b) => b.filter((_, i) => i !== index));
  const submittable = booksToAdd.filter((book) => book.passed === false).length === 0;

  const handleBack = () => props.setPageState("view");
  return (
    <div className="main-content-inner-wrapper">
      <div className="main-content-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={handleBack} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>Create New Textbook</span>
        </div>
      </div>
      <div>
        <div style={{ padding: 20 }}>
          <div className="flex flex-wrap">
            {inputs.map(({ label, Component, width, props }) => (
              <div style={{ width: `${width}%`, padding: "0 15px" }}>
                {/**@ts-ignore */}
                <Component label={label} {...props} />
              </div>
            ))}
            <div>
              <Label>
                <span style={{ fontWeight: 500 }}>Lock</span>
                <Switch large />
              </Label>
            </div>
          </div>
        </div>
        <div>
          <AddBooksTable booksToAdd={booksToAdd} changeBook={changeBook} deleteBook={deleteBook} />
        </div>
      </div>
      <div className="main-content-footer">
        <div className="bp3-dialog-footer-actions">
          <Button text="Cancel" onClick={handleBack} />
          <Button
            text="Create Textbook"
            intent="primary"
            disabled={true}
            // onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
