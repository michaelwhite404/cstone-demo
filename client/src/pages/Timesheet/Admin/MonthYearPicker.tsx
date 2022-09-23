import { Menu, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { add, format } from "date-fns";
import React, { Fragment } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthYearPicker(props: Props) {
  const { date, setDate } = props;
  const changeYear = (change: number) => setDate(add(date, { years: change }));

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        type="button"
        className="flex items-center rounded-md py-2 pr-2 text-sm font-medium text-gray-700 hover:bg-gray-50 pl-3 border border-gray-300 bg-white shadow-sm"
      >
        {format(date, "LLLL y")}
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-10 focus:outline-none absolute right-0 mt-3 w-72 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-3">
            <div className="flex justify-evenly mb-3">
              <button className="p-1.5 shadow rounded-lg" onClick={() => changeYear(-1)}>
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <div className="flex align-center font-medium">{props.date.getFullYear()}</div>
              <button className="p-1.5 shadow rounded-lg" onClick={() => changeYear(1)}>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 grid-rows-4 gap-2">
              {months.map((month, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <button
                      className="p-2 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      onClick={() =>
                        props.setDate(new Date(`${month} 1, ${props.date.getFullYear()}`))
                      }
                    >
                      {month}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

interface Props {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}
