import { ChevronRightIcon } from "@heroicons/react/solid";
import { PlusCircleIcon, RefreshIcon, BanIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { useAuth } from "../../hooks";

const items = [
  {
    name: "Create Student",
    description: "Create a new student",
    href: "#",
    iconColor: "bg-blue-500",
    icon: PlusCircleIcon,
  },
  {
    name: "Reset Passwords",
    description: "Reset the passwords of a students or all students in a class",
    href: "#",
    iconColor: "bg-purple-500",
    icon: RefreshIcon,
  },
  {
    name: "Deactive Students",
    description: "Remove students from the active roster",
    href: "#",
    iconColor: "bg-red-500",
    icon: BanIcon,
  },
];

export default function EmptyState() {
  const { user } = useAuth();
  return (
    <main className="main-content">
      <div className="w-full h-full flex items-center justify-center flex-col">
        <div className="px-5">
          <h2 className="text-lg font-medium text-gray-900">Students</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a student or pick from one of the options below
          </p>
          <ul className="mt-6 border-t border-b border-gray-200 divide-y divide-gray-200">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                <div className="relative group py-4 flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span
                      className={classNames(
                        item.iconColor,
                        "inline-flex items-center justify-center h-10 w-10 rounded-lg"
                      )}
                    >
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      <a href={item.href}>
                        <span className="absolute inset-0" aria-hidden="true" />
                        {item.name}
                      </a>
                    </div>
                    <p className="text-sm text-gray-500 m-0">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <ChevronRightIcon
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
