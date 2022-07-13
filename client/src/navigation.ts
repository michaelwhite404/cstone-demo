import {
  AcademicCapIcon,
  BookOpenIcon,
  DesktopComputerIcon,
  HomeIcon,
  TableIcon,
} from "@heroicons/react/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Students", href: "/students", icon: AcademicCapIcon },
  { name: "Textbooks", href: "/textbooks", icon: BookOpenIcon },
  { name: "Devices", href: "/devices", icon: DesktopComputerIcon },
  { name: "Timesheet", href: "/timesheet", icon: TableIcon },
];

export default navigation;
