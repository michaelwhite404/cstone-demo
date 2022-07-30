import { Dialog, Transition } from "@headlessui/react";
import { ClipboardIcon } from "@heroicons/react/outline";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";
import { EmployeeModel } from "../../../../src/types/models";
import { CreateUserArgs } from "./Users";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CreateUser from "./AddUser/CreateUser";

interface AddUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createUser: (data: CreateUserArgs) => Promise<EmployeeModel>;
}

export default function AddUser(props: AddUserProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [createdUser, setCreatedUser] = useState<EmployeeModel>();
  const close = () => props.setOpen(false);

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div>
                <AnimatePresence exitBeforeEnter initial={false}>
                  {step === 1 && (
                    <CreateUser
                      setOpen={props.setOpen}
                      createUser={props.createUser}
                      setStep={setStep}
                      setCreatedUser={setCreatedUser}
                    />
                  )}
                  {step === 2 && createdUser && (
                    <motion.div
                      key="step2_modal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        transition: { ease: "easeOut", duration: 0.3 },
                      }}
                    >
                      <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                        <div>
                          <div className="text-white px-6 pt-4 pb-2 bg-green-600">
                            <span className="font-medium text-xl">User Created!</span>
                            <p className="mt-1">The infomation for the new user is below</p>
                          </div>
                          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 lg:w-96">
                            <div className="flex mb-3">
                              <div className="sm:w-28 w-20 font-medium text-gray-700">Name</div>
                              <div>{createdUser.fullName}</div>
                            </div>
                            <div className="flex mb-8">
                              <div className="sm:w-28 w-20 font-medium text-gray-700">Email</div>
                              <div>{createdUser.email}</div>
                            </div>
                            <div className="flex align-center">
                              <div className="sm:w-28 w-20 font-medium text-gray-700">Password</div>
                              <div className="flex align-center justify-between flex-1">
                                {showPassword ? (
                                  <div>{createdUser.password}</div>
                                ) : (
                                  <div className="text-xl">
                                    {Array.from({ length: createdUser.password.length })
                                      .map(() => "•")
                                      .join("")}
                                  </div>
                                )}
                                <button
                                  className="ml-4 w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                                  onClick={() => setShowPassword((p) => !p)}
                                >
                                  {showPassword ? (
                                    <EyeOffIcon className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <EyeIcon className="w-5 h-5 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-center mt-6 mb-2">
                              <CopyToClipboard text={createdUser.password}>
                                <button className="flex items-center px-2 py-1 rounded text-blue-400 font-medium">
                                  <ClipboardIcon className="w-5 mr-2" />
                                  Copy Password
                                </button>
                              </CopyToClipboard>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                              type="button"
                              className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => {}}
                            >
                              Go to User
                            </button>
                            <button
                              type="button"
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                              onClick={close}
                            >
                              Stay on Page
                            </button>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
