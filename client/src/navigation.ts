import {
  AcademicCapIcon,
  BookOpenIcon,
  DesktopComputerIcon,
  HomeIcon,
  TableIcon,
} from "@heroicons/react/outline";
import { EmployeeModel } from "../../src/types/models";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, show: () => true },
  { name: "Students", href: "/students", icon: AcademicCapIcon, show: () => true },
  { name: "Textbooks", href: "/textbooks", icon: BookOpenIcon, show: () => true },
  { name: "Devices", href: "/devices", icon: DesktopComputerIcon, show: () => true },
  {
    name: "Timesheet",
    href: "/timesheet",
    icon: TableIcon,
    show: (user: EmployeeModel) => Boolean(user.timesheetEnabled),
  },
];

const createUserNavigation = (user: EmployeeModel) =>
  navigation.filter((resource) => resource.show(user));

export { createUserNavigation };
