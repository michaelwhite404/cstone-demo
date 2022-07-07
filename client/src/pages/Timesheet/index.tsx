import axios from "axios";
import { startOfMonth, endOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { TimesheetModel } from "../../../../src/types/models";
import { useAuth, useDocTitle } from "../../hooks";
import CalendarEvent from "../../types/calendarEvent";
import Month from "../../types/month";
import Calendar from "./Calendar";

export default function Timesheet() {
  useDocTitle("Timesheet | Cornerstone App");
  const { user } = useAuth();
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<{ month: Month; year: number }>({
    month: /*format(new Date(), "LLLL") */ "December",
    year: /* new Date().getFullYear() */ 2021,
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const getTimesheetData = async () => {
      const res = await axios.get("/api/v2/timesheets", {
        params: {
          "timeStart[gte]": startOfMonth(new Date(`${date.month} ${date.year}`)),
          "timeStart[lte]": endOfMonth(new Date(`${date.month} ${date.year}`)),
          employeeId: user?._id,
        },
      });
      const entries = res.data.data.timesheetEntries as TimesheetModel[];
      const events: CalendarEvent[] = entries.map((entry) => ({
        id: entry._id,
        description: entry.description,
      }));
      setEvents(events);
      console.log(res.data.data);
    };
    getTimesheetData();
  }, [date.month, date.year, user?._id]);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Timesheet</h1>
      </div>
      <Calendar.Month month={date.month} year={date.year} events={events} />
    </div>
  );
}

type CalendarView = "day" | "week" | "month" | "year";
