import { useEffect, useState } from "react";
import axios from "axios";
import SessionsTable from "./SessionsTable";
import "./Sessions.sass";
import DateSelector from "../../components/DateSelector";
import SessionStat from "./SessionStat";

export default function Sessions() {
  const [entries, setEntries] = useState<any[]>([]);

  const getSessions = async (date: Date) => {
    const res = await axios.get(
      `/api/v2/aftercare/attendance/year/${date.getFullYear()}/month/${
        date.getMonth() + 1
      }/day/${date.getDate()}`
    );
    setEntries(res.data.data.entries);
  };

  useEffect(() => {
    getSessions(new Date());
  }, []);

  return (
    <div>
      <div className="session-stats-container">
        <SessionStat label="Total Students" value={entries.length} disable={!entries.length} />
        <SessionStat
          label="Drop Ins"
          value={entries.filter((e) => e.dropIn).length}
          disable={!entries.length}
        />
        <DateSelector onChange={getSessions} />
      </div>
      <div>
        {entries.length > 0 ? (
          <SessionsTable entries={entries} />
        ) : (
          <span>There is no data to display</span>
        )}
      </div>
    </div>
  );
}
