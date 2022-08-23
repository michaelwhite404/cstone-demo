import { format } from "date-fns";
import React from "react";
import { ReimbursementModel } from "../../../../../src/types/models";
import TableWrapper from "../../../components/TableWrapper";

interface ReimbursementListProps {
  reimbursements: ReimbursementModel[];
}

export default function ReimbursementList({ reimbursements }: ReimbursementListProps) {
  return (
    <TableWrapper>
      <div className="sticky-header px-4 py-2">
        <span className="show-entry-label">Requests</span>
      </div>
      <ul>
        {reimbursements.map((reimbursement, i) => (
          <li key={reimbursement._id}>
            <div
              className={`flex justify-between align-center p-3 ${
                i !== reimbursements.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div>
                <div className="font-medium">{reimbursement.purpose}</div>
                <div className="text-gray-400 text-xs">
                  {format(new Date(reimbursement.date), "P")}
                </div>
              </div>
              <div className="text-gray-500">
                {(reimbursement.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </TableWrapper>
  );
}
