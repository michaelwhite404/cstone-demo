import { XIcon } from "@heroicons/react/solid";
import LabeledInput2 from "../../components/LabeledInput2";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

export default function AddEntry(props: AddEntryProps) {
  return (
    <div className="p-10">
      <div className="flex text-2xl font-semibold mb-6 justify-between">
        <span>New Time Entry</span>{" "}
        <XIcon
          className="text-blue-400 w-5 hover:text-blue-500 cursor-pointer"
          onClick={props.closeModal}
        />
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-4">
        <div className="col-span-2">
          <LabeledInput2 label="Description" name="description" />
        </div>
        <div className="col-span-2">
          <LabeledInput2 label="Department" name="department" />
        </div>
        <div className="col-span-2">
          <LabeledInput2 label="Date" name="date" />
        </div>
        <div>
          <LabeledInput2 label="Time Start" name="timeStart" />
        </div>
        <div>
          <LabeledInput2 label="Time End" name="timeEnd" />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <PrimaryButton text="Add" /*  disabled  */ />
      </div>
    </div>
  );
}

interface AddEntryProps {
  closeModal: () => void;
}
