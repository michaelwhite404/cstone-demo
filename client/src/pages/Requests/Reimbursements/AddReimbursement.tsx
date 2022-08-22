import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import { isBefore, isSameDay, startOfDay } from "date-fns";
import { ChangeEventHandler, Fragment, useState } from "react";
import DateSelector from "../../../components/DateSelector";
import LabeledInput2 from "../../../components/LabeledInput2";
import { useToasterContext } from "../../../hooks";
import { APIError } from "../../../types/apiResponses";
import stateList from "../../../utils/stateList";
import Dropzone from "./Dropzone";

interface AddLeaveProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const initialData = {
  date: startOfDay(new Date()),
  amount: 0,
  address: {
    street: "",
    city: "",
    state: "DC",
    zip: "",
  },
  purpose: "",
  dateNeeded: startOfDay(new Date()),
  specialInstructions: "",
};

export default function AddReimbursement(props: AddLeaveProps) {
  const [data, setData] = useState(initialData);
  const [file, setFile] = useState<File | null>(null);

  const { showToaster } = useToasterContext();
  const close = () => {
    props.setOpen(false);
    setData(initialData);
  };
  const submit = async () => {
    // try {
    //   const res = await axios.post("/api/v2", data);
    //   close();
    // } catch (err) {
    //   showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    // }
  };

  const submittable = false;

  // const handleDateChange = (date: Date, name: string) =>
  //   setData({ ...data, [name]: startOfDay(date) });
  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLSelectElement> = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setFile(e.target.files ? e.target.files[0] : null);

  const streetAddressChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setData({ ...data, address: { ...data.address, [e.target.name]: e.target.value } });
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className=" relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-5xl sm:w-full">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={close}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" onClick={close} />
                  </button>
                </div>
                <div className="text-white px-6 pt-4 pb-2 bg-blue-600 rounded-t-md">
                  <span className="font-medium text-xl">Add Reimbursement</span>
                  <p className="mt-1">
                    Enter the information below to create a reimbursement request.
                  </p>
                </div>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8">
                      <LabeledInput2 label="Check Payee" />
                    </div>
                    <div className="col-span-12">
                      <LabeledInput2 label="Street Address" />
                    </div>
                    <div className="col-span-6">
                      <LabeledInput2 label="City" />
                    </div>
                    <div className="col-span-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <div className="mt-1">
                          <select
                            name="state"
                            value={data.address.state}
                            onChange={streetAddressChange}
                            className="py-2 px-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md "
                            style={{ boxShadow: "0px 0px 2px #aeaeae" }}
                          >
                            {stateList.map((state) => (
                              <option key={state.value} value={state.value}>
                                {state.text}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <LabeledInput2 label="Zip" />
                    </div>
                    <div className="col-span-12">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Receipt
                        </label>
                        <Dropzone />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-md">
                  <button
                    type="button"
                    className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={submit}
                    disabled={!submittable}
                  >
                    Create Leave
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={close}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
