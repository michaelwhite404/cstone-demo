import { Menu } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { ChevronDownIcon } from "@heroicons/react/solid";
import capitalize from "capitalize";
import { useToggle } from "../../../hooks";
import { CalendarView } from "../../../types/calendar";

const views: CalendarView[] = ["day", "week", "month", "year"];

export function CalendarViewDropdown(props: ViewProps) {
  const [open, toggle] = useToggle(false);
  return (
    <Popover2
      content={<CalendarViewMenu {...props} close={toggle} />}
      placement="bottom-end"
      className="menu-popover"
      isOpen={open}
    >
      <button
        className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={toggle}
      >
        {capitalize(props.view)} View
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </Popover2>
  );
}

interface ViewProps {
  view: CalendarView;
  setView: SetState<CalendarView>;
}

type SetState<A> = React.Dispatch<React.SetStateAction<A>>;

interface MenuProps extends ViewProps {
  close: () => void;
}

const CalendarViewMenu = (props: MenuProps) => {
  const handleItemClick = (view: CalendarView) => {
    props.setView(view);
    props.close();
  };

  return (
    <Menu
      className="focus:outline-none right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      style={{ minWidth: 0, padding: "4px 0", borderRadius: 8 }}
    >
      {views.map((view) => (
        <li key={view}>
          <button
            className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
            onClick={() => handleItemClick(view)}
          >
            {capitalize(view)} View
          </button>
        </li>
      ))}
    </Menu>
  );
};
