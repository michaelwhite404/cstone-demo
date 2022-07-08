import { Menu } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { CalendarView } from "../../../types/calendar";

export function CalendarViewDropdown(props: ViewProps) {
  return (
    <Popover2
      content={
        <Menu
          className="focus:outline-none right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          style={{ minWidth: 0, padding: "4px 0", borderRadius: 8 }}
        >
          <li>
            <button className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100">
              Day View
            </button>
          </li>
          <li>
            <button className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100">
              Week View
            </button>
          </li>
          <li>
            <button className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100">
              Month View
            </button>
          </li>
          <li>
            <button className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100">
              Year View
            </button>
          </li>
        </Menu>
      }
      placement="bottom-start"
      className="menu-popover"
    >
      <button className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
        Month View
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </Popover2>
  );
}

interface ViewProps {
  view: CalendarView;
}
