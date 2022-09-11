import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import { LeaveModel } from "../../../../../src/types/models";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";

interface Props {
  leaves: LeaveModel[];
}

export default function MyLeavesList(props: Props) {
  const { leaves } = props;
  return (
    <TableWrapper>
      <div className="sticky-header px-4 py-2">
        <span className="show-entry-label">Requests</span>
      </div>
      <ul className="bg-white">
        {leaves.map((leave, i) => {
          const status = leave.approval
            ? leave.approval.approved
              ? "Approved"
              : "Rejected"
            : "Pending";
          return (
            <li
              key={leave._id}
              className={i !== leaves.length - 1 ? "border-b border-gray-200" : ""}
            >
              <Link to={`/requests/leaves/${leave._id}`} state={{ fromLeaves: true }}>
                <div className="p-4 space-y-0.5">
                  <div className="text-gray-900 font-medium">{leave.reason}</div>
                  {leave.comments && (
                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {leave.comments}
                    </div>
                  )}
                  <div className="flex text-gray-400">
                    {format(new Date(leave.dateStart), "P")}
                    <ArrowNarrowRightIcon className="mx-2 w-4" />
                    {format(new Date(leave.dateEnd), "P")}
                  </div>
                  <div>
                    <div className="mt-2">
                      <ApprovalBadge status={status} />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </TableWrapper>
  );
}
