import * as Icon from "@heroicons/react/outline";
import { EmployeeModel } from "../../src/types/models";

const navigation = [
  { name: "Dashboard", href: "/", icon: Icon.HomeIcon, show: () => true },
  { name: "Students", href: "/students", icon: Icon.AcademicCapIcon, show: () => true },
  { name: "Textbooks", href: "/textbooks", icon: Icon.BookOpenIcon, show: () => true },
  { name: "Devices", href: "/devices", icon: Icon.DesktopComputerIcon, show: () => true },
  { name: "Tickets", href: "/tickets", icon: Icon.TicketIcon, show: () => true },
  {
    name: "Timesheet",
    href: "/timesheet",
    icon: Icon.TableIcon,
    show: (user: EmployeeModel) => Boolean(user.timesheetEnabled),
  },
  {
    name: "Users",
    href: "/users",
    icon: Icon.UserIcon,
    show: (user: EmployeeModel) => ["Admin", "Super Admin"].includes(user.role),
  },
];

const createUserNavigation = (user: EmployeeModel) =>
  navigation.filter((resource) => resource.show(user));

export { createUserNavigation };
