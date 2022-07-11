import { ArrowLeftIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { TimesheetModel } from "../../../../src/types/models";
import Badge from "../../components/Badge/Badge";
import BadgeColor from "../../components/Badge/BadgeColor";
import "./ShowEntry.sass";
import "react-circular-progressbar/dist/styles.css";
import ProgressProvider from "./ProgressProvider";

const badgeObj: { [x: string]: BadgeColor } = {
  Approved: "emerald",
  Pending: "yellow",
  Rejected: "red",
};

export default function ShowEntry(props: ShowEntryProps) {
  return (
    <div className="p-7">
      <div className="flex justify-between align-center">
        <div className="flex align-center">
          <span className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <ArrowLeftIcon className="w-4" />
          </span>
          <span className="text-xl font-semibold ml-4">Timesheet Entry</span>
        </div>
        <Badge color={badgeObj[props.entry.status]} text={props.entry.status} />
      </div>
      <div className="mt-10 grid gap-8">
        <div className="col-span-2">
          <div className="show-entry-label">Description</div>
          <div>{props.entry.description}</div>
        </div>
        <div className="col-span-2">
          <div className="show-entry-label">Date</div>
          <div>{format(new Date(props.entry.timeStart), "PPPP")}</div>
        </div>
        <div>
          <div className="show-entry-label">Time Start</div>
          <div>{format(new Date(props.entry.timeStart), "p")}</div>
        </div>
        <div>
          <div className="show-entry-label">Time End</div>
          <div>{format(new Date(props.entry.timeEnd), "p")}</div>
        </div>
        <div className="col-span-2">
          <div className="show-entry-label">Department</div>
          <div>{props.entry.department.name}</div>
        </div>
        <div className="col-span-2">
          <div className="show-entry-label">Hours</div>
          <div className="w-28 h-28 mt-2">
            <ProgressProvider valueStart={0} valueEnd={props.entry.hours!}>
              {(value) => (
                <CircularProgressbarWithChildren
                  minValue={0}
                  maxValue={8}
                  value={value}
                  styles={buildStyles({
                    pathColor: "#2972e7",
                    trailColor: "#f6f6f6",
                  })}
                >
                  <div className="text-3xl font-bold relative right-1">{props.entry.hours}</div>
                  <div className="relative text-gray-400">/8</div>
                </CircularProgressbarWithChildren>
              )}
            </ProgressProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShowEntryProps {
  entry: TimesheetModel;
}
