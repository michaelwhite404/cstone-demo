import { useEffect, useRef } from "react";

export function CalendarWeek() {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Set the container scroll position based on the current time.
  //   const currentMinute = new Date().getHours() * 60;
  //   if (container.current && containerNav.current && containerOffset.current) {
  //     container.current.scrollTop =
  //       ((container.current.scrollHeight -
  //         containerNav.current.offsetHeight -
  //         containerOffset.current.offsetHeight) *
  //         currentMinute) /
  //       1440;
  //   }
  // }, []);

  const times = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ];

  return (
    <div ref={container} className="flex flex-auto flex-col overflow-auto bg-white">
      <div
        style={{ width: "165%" }}
        className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
      >
        <div
          ref={containerNav}
          className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
        >
          <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
            <button type="button" className="flex flex-col items-center pt-2 pb-3">
              M{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                10
              </span>
            </button>
            <button type="button" className="flex flex-col items-center pt-2 pb-3">
              T{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                11
              </span>
            </button>
            <button type="button" className="flex flex-col items-center pt-2 pb-3">
              W{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                12
              </span>
            </button>
            <button type="button" className="flex flex-col items-center pt-2 pb-3">
              T{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                13
              </span>
            </button>
            <button type="button" className="flex flex-col items-center pt-2 pb-3">
              F{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                14
              </span>
            </button>
            <button type="button" className="flex flex-col items-center pt-2 pb-3">
              S{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                15
              </span>
            </button>
            <button type="button" className="flex flex-col items-center pt-2 pb-3">
              S{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                16
              </span>
            </button>
          </div>

          <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
            <div className="col-end-1 w-14" />
            <div className="flex items-center justify-center py-3">
              <span>
                Mon{" "}
                <span className="items-center justify-center font-semibold text-gray-900">10</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Tue{" "}
                <span className="items-center justify-center font-semibold text-gray-900">11</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span className="flex items-baseline">
                Wed{" "}
                <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                  12
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Thu{" "}
                <span className="items-center justify-center font-semibold text-gray-900">13</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Fri{" "}
                <span className="items-center justify-center font-semibold text-gray-900">14</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Sat{" "}
                <span className="items-center justify-center font-semibold text-gray-900">15</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Sun{" "}
                <span className="items-center justify-center font-semibold text-gray-900">16</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-auto">
          <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
          <div className="grid flex-auto grid-cols-1 grid-rows-1">
            {/* Horizontal lines */}
            <div
              className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
              style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
            >
              <div ref={containerOffset} className="row-end-1 h-7"></div>
              {times.map((time) => (
                <>
                  <div>
                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      {time}
                    </div>
                  </div>
                  <div />
                </>
              ))}
            </div>

            {/* Vertical lines */}
            <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className={`col-start-${i + 1} row-span-full ${i === 7 ? "w-8" : ""}`} />
              ))}
            </div>

            {/* Events */}
            <ol
              className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
              style={{ gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto" }}
            >
              <li
                className="relative mt-px flex sm:col-start-3"
                style={{ gridRow: "74 / span 12" }}
              >
                <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100 cursor-pointer">
                  <p className="order-1 font-semibold text-blue-700">Breakfast</p>
                  <p className="text-blue-500 group-hover:text-blue-700">
                    <time dateTime="2022-01-12T06:00">6:00 AM</time>
                  </p>
                </div>
              </li>
              <li
                className="relative mt-px flex sm:col-start-3"
                style={{ gridRow: "92 / span 30" }}
              >
                <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100 cursor-pointer">
                  <p className="order-1 font-semibold text-pink-700">Flight to Paris</p>
                  <p className="text-pink-500 group-hover:text-pink-700">
                    <time dateTime="2022-01-12T07:30">7:30 AM</time>
                  </p>
                </div>
              </li>
              <li
                className="relative mt-px hidden sm:col-start-6 sm:flex"
                style={{ gridRow: "122 / span 24" }}
              >
                <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200 cursor-pointer">
                  <p className="order-1 font-semibold text-gray-700">
                    Meeting with design team at Disney
                  </p>
                  <p className="text-gray-500 group-hover:text-gray-700">
                    <time dateTime="2022-01-15T10:00">10:00 AM</time>
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
