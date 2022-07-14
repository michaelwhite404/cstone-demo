import { Dialog, Drawer } from "@blueprintjs/core";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { TimesheetModel } from "../../../../src/types/models";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useAuth, useDocTitle, useToasterContext } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import { CalendarEvent, CalendarView } from "../../types/calendar";
import Month from "../../types/month";
import AddEntry from "./AddEntry";
import Calendar from "./Calendar";
import ShowEntry from "./ShowEntry";
import "./Calendar/Calendar.sass";
import { start, end } from "../../utils/startEnd";

export default function Timesheet() {
  useDocTitle("Timesheet | Cornerstone App");
  const { user } = useAuth();
  const [view, setView] = useState<CalendarView>("week");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimesheetModel>();
  const { showToaster } = useToasterContext();

  const { month, year } = getMDY(date);

  const addTimesheetEntry = async (data: AddTimesheetData) => {
    try {
      const res = await axios.post("/api/v2/timesheets", data);
      setDate(new Date(res.data.data.timesheetEntry.timeEnd));
      setModalOpen(false);
      showToaster("Entry added successfully", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const showTimesheetEntry = async (entryId: string) => {
    const res = await axios.get(`/api/v2/timesheets/${entryId}`);
    setSelectedEntry(res.data.data.timesheetEntry);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedEntry(undefined);
  };

  const getTimesheetData = useCallback(async () => {
    const res = await axios.get("/api/v2/timesheets", {
      params: {
        "timeStart[gte]": start(date, view),
        "timeStart[lte]": end(date, view),
        employeeId: user?._id,
      },
    });
    const entries = res.data.data.timesheetEntries as TimesheetModel[];
    const events: CalendarEvent[] = entries.map((entry) => ({
      id: entry._id,
      description: entry.description,
      date: new Date(entry.timeStart),
      timeLabel: `${entry.hours} ${entry.hours === 1 ? "Hr" : "Hrs"}`,
      timeStart: new Date(entry.timeStart).toISOString(),
      timeEnd: new Date(entry.timeEnd).toISOString(),
    }));
    setEvents(events);
  }, [date, user?._id, view]);

  useEffect(() => {
    getTimesheetData();
  }, [getTimesheetData]);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Timesheet</h1>
      </div>
      <header className="flex justify-between align-center mb-4">
        <div className="font-medium ">
          {view === "week" && formatWeekString(date)}
          {view === "month" && `${month} ${year}`}
        </div>
        <div className="flex md:space-x-3 align-center space-x-4">
          <Calendar.DatePick view={view} setDate={setDate} />
          <div className="space-x-3 align-center hidden md:flex">
            <Calendar.View view={view} setView={setView} />
            <div className="h-6 w-px bg-gray-300" />
            <PrimaryButton text="Add Entry" onClick={() => setModalOpen(true)} />
          </div>
          <button className="-mx-2 flex md:hidden items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>
      {view === "month" && (
        <Calendar.Month
          month={month}
          year={year}
          events={events}
          onEntryClick={showTimesheetEntry}
        />
      )}
      {view === "week" && (
        <Calendar.Week
          date={date}
          setDate={setDate}
          events={events}
          onEntryClick={showTimesheetEntry}
        />
      )}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        style={{ width: 400, background: "white", borderRadius: 12, padding: 0 }}
        canOutsideClickClose={false}
        portalClassName="z-40"
      >
        <AddEntry
          user={user}
          closeModal={() => setModalOpen(false)}
          addTimesheetEntry={addTimesheetEntry}
        />
      </Dialog>
      <Drawer
        portalClassName="z-40"
        size={"480px"}
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        canOutsideClickClose
        className="pass-along"
      >
        {selectedEntry && (
          <ShowEntry entry={selectedEntry} closeDrawer={() => setDrawerOpen(false)} />
        )}
      </Drawer>
    </div>
  );
}

const getMDY = (date: Date) => {
  return {
    month: format(date, "LLLL") as Month,
    day: date.getDate(),
    year: date.getFullYear(),
  };
};

const formatWeekString = (date: Date) => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return `${format(start, "PPP")} - ${format(end, "PPP")}`;
};

interface AddTimesheetData {
  description: string;
  department: string;
  timeStart: string;
  timeEnd: string;
}
