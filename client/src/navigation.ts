import {
  AcademicCapIcon,
  BookOpenIcon,
  DesktopComputerIcon,
  HomeIcon,
} from "@heroicons/react/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
  { name: "Students", href: "/students", icon: AcademicCapIcon, current: false },
  { name: "Textbooks", href: "/textbooks", icon: BookOpenIcon, current: false },
  { name: "Devices", href: "/devices", icon: DesktopComputerIcon, current: false },
];

export default navigation;
