import axios from "axios";
import React, { useEffect, useState } from "react";
import { EmployeeModel, TimesheetModel } from "../../../../../src/types/models";
import BackButton from "../../../components/BackButton";
import FadeIn from "../../../components/FadeIn";
import MainContent from "../../../components/MainContent";
import { end, start } from "../../../utils/startEnd";
import EntriesTable from "./EntriesTable";
import MonthYearPicker from "./MonthYearPicker";

export default function UserPage(props: Props) {
  const [entries, setEntries] = useState<TimesheetModel[]>([]);
  const [date, setDate] = useState(new Date());
  const { selected, onBack } = props;
  useEffect(() => {
    const getUserEntries = async () => {
      const res = await axios.get(`/api/v2/timesheets/`, {
        params: {
          employee: selected._id,
          sort: "timeStart",
          "timeStart[gte]": start(date, "month"),
          "timeStart[lte]": end(date, "month"),
        },
      });
      setEntries(res.data.data.timesheetEntries);
    };
    getUserEntries();
  }, [date, selected]);

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>Go back</span>
          </div>
        </MainContent.Header>
        <div className="overflow-y-scroll flex-grow">
          <div className="p-3">
            <div className="flex justify-end">
              <MonthYearPicker date={date} setDate={setDate} />
            </div>
            <EntriesTable entries={entries} />
          </div>
        </div>
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}

interface Props {
  onBack: () => void;
  selected: EmployeeModel;
}
