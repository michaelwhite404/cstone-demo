import classNames from "classnames";
import { format } from "date-fns";
import React from "react";
import { RM } from ".";
import TableWrapper from "../../../components/TableWrapper";
import { useChecker2 } from "../../../hooks";

interface Props {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
}

export default function Approvals({ reimbursements, select }: Props) {
  const { allSelected, checkboxRef, data, toggleAll, selectedData, setSelectedData } =
    useChecker2(reimbursements);

  return (
    <div>
      <div>
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
                <th>Date</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Submitted By</th>
                <th>Status</th>
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
                    <td className="py-2.5 border-b border-gray-300">
                      {format(new Date(reimbursement.date), "P")}
                    </td>
                    <td
                      onClick={() => select(reimbursement)}
                      className="py-2.5 border-b border-gray-300 text-gray-400 "
                    >
                      {reimbursement.purpose}
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
                      {reimbursement.status}
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
