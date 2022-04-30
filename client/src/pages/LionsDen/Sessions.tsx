import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import DatePicker from "sassy-datepicker";
import LabeledInput from "../../components/Inputs/LabeledInput";
import TablePaginate from "../../components/TablePaginate/TablePaginate";

export default function Sessions() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const inputRef = useRef<HTMLLabelElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSessions();

    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const getSessions = async () => {
    const res = await axios.get("/api/v2/aftercare/attendance", {
      params: { "signOutDate[gte]": "04-23-2022", "signOutDate[lte]": "04-24-2022" },
    });
    setEntries(res.data.data.entries);
  };

  const DateInput = forwardRef((props, ref) => {
    return (
      <LabeledInput
        label="Date"
        value={date.toLocaleDateString()}
        onFocus={() => setOpen(true)}
        readOnly
        style={{
          cursor: "pointer",
          boxShadow: open ? "inset 0 0 0 2px #2196f3" : undefined,
          padding: "20px 15px",
          borderRadius: 8,
        }}
      />
    );
  });

  // @ts-ignore
  const handleClickOutside = (event) => {
    if (inputRef.current && inputRef.current?.contains(event.target)) {
      return setOpen(true);
    }

    if (pickerRef.current && !pickerRef.current?.contains(event.target)) {
      setOpen(false);
    }
  };

  const onDateSelect = (date: Date) => {
    setDate(date);
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Student",
        accessor: "student.fullName",
      },
      {
        Header: "Time",
        accessor: "signOutDate",
        Cell: ({ row: { original } }: { row: { original: any } }) => {
          return new Date(original.signOutDate).toLocaleTimeString();
        },
      },
      {
        Header: "Signature",
        accessor: "signature",
        Cell: ({ row: { original } }: { row: { original: any } }) => {
          return <img src={`/images/${original.signature}`} alt="signature" width={100} />;
        },
      },
    ],
    []
  );

  const data = useMemo(() => entries, [entries]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          position: "relative",
          zIndex: 99999999,
        }}
      >
        <DateInput ref={inputRef} />
        {open && (
          <DatePicker
            ref={pickerRef}
            selected={date}
            onChange={onDateSelect}
            maxDate={new Date()}
            style={{ position: "absolute", top: "100%" }}
          />
        )}
      </div>
      <div>
        <TablePaginate data={data} columns={columns} />
      </div>
    </div>
  );
}
