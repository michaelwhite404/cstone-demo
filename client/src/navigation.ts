import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  DesktopComputerIcon,
  HomeIcon,
} from "@heroicons/react/outline";

interface NavigationItem {
  /** Name of the navigation item */
  name: string;
  /** Path of the navigation item */
  href: string;
  /** Navigation item icon */
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Students", href: "/students", icon: AcademicCapIcon },
  { name: "Textbooks", href: "/textbooks", icon: BookOpenIcon },
  { name: "Devices", href: "/devices", icon: DesktopComputerIcon },
  { name: "Timesheet", href: "/timesheet", icon: ClockIcon },
];

export default navigation;
