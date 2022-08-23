import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import React, { Fragment, useCallback, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { LeaveModel } from "../../../../../src/types/models";
import Badge from "../../../components/Badge/Badge";
import BadgeColor from "../../../components/Badge/BadgeColor";
import FadeIn from "../../../components/FadeIn";

interface OutletContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: LeaveModel | undefined;
}

export default function Detail() {
  const { open, setOpen, selected } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = useCallback(
    async (from?: string) => {
      if (from === "back" && !(location.state as any)?.fromLeaves) {
        return navigate(-1);
      }
      setOpen(false);
      if ((location.state as any)?.fromLeaves) {
        return setTimeout(() => {
          navigate(-1);
        }, 500);
      }
      return setTimeout(() => {
        navigate("/requests/leaves");
      }, 500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, setOpen]
  );

  const onBackButtonEvent = useCallback(
    (e: PopStateEvent) => {
      e.preventDefault();
      handleClose("back");
    },
    [handleClose]
  );

  useEffect(() => {
    // @ts-ignore
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, [onBackButtonEvent]);

  const badgeObj: { [x: string]: BadgeColor } = {
    Approved: "emerald",
    Pending: "yellow",
    Rejected: "red",
  };

  const status = selected?.approval
    ? selected?.approval.approved
      ? "Approved"
      : "Rejected"
    : "Pending";

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => handleClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white px-7 pb-6 shadow-xl">
                    <div className="flex justify-between align-center sticky top-0 bg-white pt-7 pb-2">
                      <div className="flex align-center">
                        <span
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                          onClick={() => handleClose()}
                        >
                          <ArrowLeftIcon className="w-4" />
                        </span>
                        <span className="text-xl font-semibold ml-4">{selected?.reason}</span>
                      </div>
                      <Badge color={badgeObj[status]} text={status} />
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="absolute inset-0">
                        {selected && (
                          <div className="mt-10 grid gap-8 grid-cols-2">
                            <div>
                              <FadeIn delay={125}>
                                <div className="show-entry-label">Date Start</div>
                                <div>{format(new Date(selected.dateStart), "P")}</div>
                              </FadeIn>
                            </div>
                            <div>
                              <FadeIn delay={125}>
                                <div className="show-entry-label">Date End</div>
                                <div>{format(new Date(selected.dateEnd), "P")}</div>
                              </FadeIn>
                            </div>
                            {selected.comments && (
                              <div className="col-span-2">
                                <FadeIn delay={125}>
                                  <div className="show-entry-label">Comments</div>
                                  <div>{selected.comments}</div>
                                </FadeIn>
                              </div>
                            )}
                            {/* {selected.approval && (
                              <>
                                <div className="col-span-2">
                                  <FadeIn>
                                    <div className="show-entry-label">{props.entry.status} At</div>
                                    <div>{format(new Date(props.entry.finalizedAt), "PPPp")}</div>
                                  </FadeIn>
                                </div>
                                <div className="col-span-2">
                                  <FadeIn>
                                    <div className="show-entry-label">{props.entry.status} By</div>
                                    <div>{props.entry.finalizedBy.fullName}</div>
                                  </FadeIn>
                                </div>
                              </>
                            )} */}
                          </div>
                        )}
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
