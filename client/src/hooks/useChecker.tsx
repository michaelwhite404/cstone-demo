import { Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

interface CheckerRow<T> {
  rowId: string;
  original: T;
  checked: boolean;
  Checkbox: () => JSX.Element;
}

interface IUseChecker<T> {
  rows: CheckerRow<T>[];
  checked: T[];
  CheckAllBox: () => JSX.Element;
}

type CheckboxStates = "unchecked" | "checked" | "indeterminate";

export default function useChecker<T>(
  data: T[],
  onChange?: (checked: T[]) => void
): IUseChecker<T> {
  const [state, setState] = useState<CheckerRow<T>[]>([]);
  const [main, setMain] = useState<CheckboxStates>("unchecked");

  const checked = state.filter((s) => s.checked).map((s) => s.original);

  const toggleCheck = (rowId: string) => {
    const stateCopy = [...state];
    const index = stateCopy.findIndex((row) => row.rowId === rowId);
    if (index > -1) {
      stateCopy[index].checked = !stateCopy[index].checked;
    }
    setState(stateCopy);
  };

  const mainCheckboxClick = () => {
    if (main === "checked") {
      switchAll(false);
      return setMain("unchecked");
    }
    switchAll(true);
    setMain("checked");
  };
  const switchAll = (checked: boolean) => setState([...rows].map((row) => ({ ...row, checked })));

  useEffect(() => {
    const initializeRows = () => {
      const rows = data.map((row) => {
        const rowId = uuid();
        return {
          rowId,
          original: row,
          checked: false,
        };
      });
      //@ts-ignore
      setState(rows);
    };

    initializeRows();
  }, [data]);

  useEffect(() => {
    const numChecked = state.filter((r) => r.checked).length;
    if (numChecked === 0) return setMain("unchecked");
    if (numChecked === state.length) return setMain("checked");
    setMain("indeterminate");
    onChange?.(checked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const rows: CheckerRow<T>[] = state.map((r) => {
    return {
      ...r,
      Checkbox: () => <Checkbox checked={r.checked} onChange={() => toggleCheck(r.rowId)} />,
    };
  });

  const CheckAllBox = () => (
    <Checkbox
      onClick={mainCheckboxClick}
      indeterminate={main === "indeterminate"}
      checked={main === "checked"}
    />
  );

  return { rows, checked, CheckAllBox };
}
