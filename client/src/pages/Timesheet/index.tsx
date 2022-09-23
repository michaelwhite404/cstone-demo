import { Dialog, Drawer } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { TimesheetModel } from "../../../../src/types/models";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useAuth, useDocTitle, useToasterContext, useWindowSize } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import AddEntry from "./AddEntry";
import Calendar from "./Calendar";
import ShowEntry from "./ShowEntry";

type PageState = "CALENDAR";

export default function Timesheet() {
  useDocTitle("Timesheet | Cornerstone App");
  const [pageState, setPageState] = useState<PageState>("CALENDAR");
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimesheetModel>();
  const { showToaster } = useToasterContext();
  const [width] = useWindowSize();

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

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header flex justify-between align-center">
        <h1 style={{ marginBottom: "10px" }}>Timesheet</h1>
        <PrimaryButton text="+ Add Entry" onClick={() => setModalOpen(true)} />
      </div>
      {pageState === "CALENDAR" && (
        <Calendar showTimesheetEntry={showTimesheetEntry} date={date} setDate={setDate} />
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
        size={width >= 640 ? 480 : "90%"}
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        canOutsideClickClose
        className="sm:w-[480px] w-72"
      >
        {selectedEntry && (
          <ShowEntry entry={selectedEntry} closeDrawer={() => setDrawerOpen(false)} />
        )}
      </Drawer>
    </div>
  );
}

interface AddTimesheetData {
  description: string;
  department: string;
  timeStart: string;
  timeEnd: string;
}
