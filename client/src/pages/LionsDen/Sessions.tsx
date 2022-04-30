import { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "sassy-datepicker";
import LabeledInput from "../../components/Inputs/LabeledInput";

export default function Sessions() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLLabelElement>(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const DateInput = forwardRef((props, ref) => (
    <LabeledInput
      label="Date"
      value={date.toLocaleDateString()}
      onFocus={() => setOpen(true)}
      readOnly
      style={{ cursor: "pointer" }}
    />
  ));

  // @ts-ignore
  const handleClickOutside = (event) => {
    // @ts-ignore
    if (inputRef.current & inputRef.current?.contains(event.target)) {
      return setOpen(true);
    }
    // @ts-ignore
    if (pickerRef.current && !pickerRef.current?.contains(event.target)) {
      setOpen(false);
    }
  };

  const onDateSelect = (date: Date) => {
    setDate(date);
    setOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        position: "relative",
      }}
    >
      <DateInput ref={inputRef} />
      {open && (
        <DatePicker
          ref={pickerRef}
          value={date.toLocaleDateString()}
          onChange={onDateSelect}
          maxDate={new Date()}
          style={{ position: "absolute", top: "100%" }}
        />
      )}
    </div>
  );
}
