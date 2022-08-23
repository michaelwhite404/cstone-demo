import { format } from "date-fns";
import React from "react";
import { ReimbursementModel } from "../../../../../src/types/models";
import TableWrapper from "../../../components/TableWrapper";

interface ReimbursementTableProps {
  reimbursements: ReimbursementModel[];
}

export default function ReimbursementTable({ reimbursements }: ReimbursementTableProps) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-6">Date</th>
            <th>Purpose</th>
            <th>Amount</th>
            <th>Approval</th>
          </tr>
        </thead>
        <tbody className="text-gray-400 text-sm">
          {reimbursements.map((reimbursement, i) => (
            <tr
              key={reimbursement._id}
              className={i !== reimbursements.length - 1 ? "border-b border-gray-200" : ""}
            >
              <td className="pl-6 py-1.5 w-40">{format(new Date(reimbursement.date), "P")}</td>
              <td className="text-gray-700 font-medium w-2/5">
                <div className="whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[240px]">
                  {reimbursement.purpose}
                </div>
              </td>
              <td>
                {(reimbursement.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td>{reimbursement.approval ? "DONE" : "Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
