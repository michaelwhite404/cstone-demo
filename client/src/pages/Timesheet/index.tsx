import { DotsHorizontalIcon } from "@heroicons/react/solid";
import axios from "axios";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useEffect, useState } from "react";
import { TimesheetModel } from "../../../../src/types/models";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useAuth, useDocTitle } from "../../hooks";
import { CalendarEvent } from "../../types/calendar";
import Month from "../../types/month";
import Calendar from "./Calendar";

export default function Timesheet() {
  useDocTitle("Timesheet | Cornerstone App");
  const { user } = useAuth();
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(new Date("December 1, 2021"));
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const { month, day, year } = {
    month: format(date, "LLLL") as Month,
    day: date.getDate(),
    year: date.getFullYear(),
  };

  useEffect(() => {
    const getTimesheetData = async () => {
      const res = await axios.get("/api/v2/timesheets", {
        params: {
          "timeStart[gte]": startOfMonth(new Date(`${month} ${year}`)),
          "timeStart[lte]": endOfMonth(new Date(`${month} ${year}`)),
          employeeId: user?._id,
        },
      });
      const entries = res.data.data.timesheetEntries as TimesheetModel[];
      const events: CalendarEvent[] = entries.map((entry) => ({
        id: entry._id,
        description: entry.description,
        date: new Date(entry.timeStart),
        timeLabel: `${entry.hours} ${entry.hours === 1 ? "Hr" : "Hrs"}`,
      }));
      setEvents(events);
    };
    getTimesheetData();
  }, [month, year, user?._id]);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Timesheet</h1>
      </div>
      <header className="flex justify-between align-center mb-4">
        <div className="font-medium ">
          {month} {year}
        </div>
        <div className="flex md:space-x-3 align-center space-x-4">
          <Calendar.DatePick view={view} setDate={setDate} />
          <div className="space-x-3 align-center hidden md:flex">
            <Calendar.View view={view} setView={setView} />
            <div className="h-6 w-px bg-gray-300" />
            <PrimaryButton text="Add Entry" />
          </div>
          <button className="-mx-2 flex md:hidden items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>
      <Calendar.Month month={month} year={year} events={events} />
    </div>
  );
}

type CalendarView = "day" | "week" | "month" | "year";
