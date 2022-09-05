import { Switch } from "@headlessui/react";
import classNames from "classnames";
import React, { useState } from "react";

export default function DepartmentSettings() {
  const [availableForTickets, setAvailableForTickets] = useState(false);

  return (
    <ul className="mt-2 divide-y divide-gray-200">
      <Switch.Group as="li" className="flex items-center justify-between py-4">
        <div className="flex flex-col">
          <Switch.Label as="p" className="text-sm font-medium text-gray-900 mb-1" passive>
            Available for Tickets
          </Switch.Label>
          <Switch.Description className="text-sm text-gray-500">
            Should this department be available to accept ticket requests?
          </Switch.Description>
        </div>
        <Switch
          checked={availableForTickets}
          onChange={setAvailableForTickets}
          className={classNames(
            availableForTickets ? "bg-indigo-500" : "bg-gray-200",
            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              availableForTickets ? "translate-x-5" : "translate-x-0",
              "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          />
        </Switch>
      </Switch.Group>
    </ul>
  );
}
