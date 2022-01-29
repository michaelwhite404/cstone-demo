import {
  AcademicCapIcon,
  BookOpenIcon,
  DesktopComputerIcon,
  HomeIcon,
} from "@heroicons/react/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Students", href: "/students", icon: AcademicCapIcon },
  { name: "Textbooks", href: "/textbooks", icon: BookOpenIcon },
  { name: "Devices", href: "/devices", icon: DesktopComputerIcon },
];

export default navigation;
