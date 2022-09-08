import { CheckIcon, XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { format } from "date-fns";
import { RM } from ".";
import { EmployeeModel } from "../../../../../src/types/models";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";
import { useChecker2 } from "../../../hooks";

interface Props {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
  user: EmployeeModel;
}

const headings = ["Purpose", "Date", "Amount", "Submitted By", "Status"];

export default function Approvals({ reimbursements, select, user }: Props) {
  const approvals = reimbursements.filter((r) => r.sendTo?._id === user._id);
  const { pending, finalized } = approvals.reduce(
    (prev, reimbursement) => {
      reimbursement.approval
        ? prev.finalized.push(reimbursement)
        : prev.pending.push(reimbursement);
      return prev;
    },
    { pending: [] as RM[], finalized: [] as RM[] }
  );
  const { allSelected, checkboxRef, data, toggleAll, selectedData, setSelectedData } =
    useChecker2(pending);

  return (
    <div>
      <div>
        <div className="mt-4 sm:h-14 sm:flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Pending ({data.length})</span>
          <div
            className={`${
              selectedData.length ? "sm:block flex" : "hidden"
            } space-x-3  pt-2 sm:pt-0`}
          >
            <button
              type="button"
              className="w-full sm:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Approve {allSelected ? "All" : ""}
            </button>
            <button
              type="button"
              className="w-full sm:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <XIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Reject {allSelected ? "All" : ""}
            </button>
          </div>
        </div>
        <TableWrapper>
          <table className="table-auto">
            <thead>
              <tr>
                <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8 border-b">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    ref={checkboxRef}
                    checked={allSelected && reimbursements.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                {headings.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((reimbursement) => {
                const selected = selectedData.includes(reimbursement);
                return (
                  <tr
                    className={classNames(
                      { "bg-indigo-50": selected },
                      { "hover:bg-gray-100": !selected }
                    )}
                    key={reimbursement._id}
                  >
                    <td className="relative w-12 px-6 sm:w-16 sm:px-8 pl-4 py-2.5 border-b border-gray-300">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        value={reimbursement._id}
                        checked={selected}
                        onChange={(e) =>
                          setSelectedData(
                            e.target.checked
                              ? [...selectedData, reimbursement]
                              : selectedData.filter((r) => r !== reimbursement)
                          )
                        }
                      />
                    </td>

                    <td
                      onClick={() => select(reimbursement)}
                      className="py-2.5 border-b border-gray-300 font-medium text-blue-500 cursor-pointer"
                    >
                      {reimbursement.purpose}
                    </td>
                    <td className="py-2.5 border-b border-gray-300">
                      {format(new Date(reimbursement.date), "P")}
                    </td>
                    <td className="py-2.5  border-b border-gray-300 text-gray-400 ">
                      {(reimbursement.amount / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td className="py-2.5 border-b border-gray-300 text-gray-400">
                      {reimbursement.user.fullName}
                    </td>
                    <td className="py-2.5 border-b border-gray-300 text-gray-400">
                      <ApprovalBadge status={reimbursement.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrapper>
      </div>
      <div>
        <div className="mt-4 sm:h-14 sm:flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Finalized ({finalized.length})</span>
        </div>
        <TableWrapper>
          <table className="table-auto">
            <thead>
              <tr>
                {headings.map((h, i) => (
                  <th className={classNames({ "pl-8": i === 0 })} key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finalized.map((reimbursement) => {
                return (
                  <tr className={"hover:bg-gray-100"} key={reimbursement._id}>
                    <td
                      onClick={() => select(reimbursement)}
                      className="py-2.5 border-b border-gray-300 pl-8 font-medium text-blue-500 cursor-pointer"
                    >
                      {reimbursement.purpose}
                    </td>
                    <td className="py-2.5 border-b border-gray-300">
                      {format(new Date(reimbursement.date), "P")}
                    </td>
                    <td className="py-2.5 border-b border-gray-300 text-gray-400 ">
                      {(reimbursement.amount / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td className="py-2.5 border-b border-gray-300 text-gray-400">
                      {reimbursement.user.fullName}
                    </td>
                    <td className="py-2.5 border-b border-gray-300 text-gray-400">
                      <ApprovalBadge status={reimbursement.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </div>
  );
}
