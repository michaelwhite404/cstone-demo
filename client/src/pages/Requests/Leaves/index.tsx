import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useDocTitle } from "../../../hooks";
import { LeaveModel } from "../../../../../src/types/models";
import TableWrapper from "../../../components/TableWrapper";
import { Link, Outlet, useParams } from "react-router-dom";
import Detail from "./Detail";

function Leaves() {
  useDocTitle("Leave Requests | Cornerstone App");
  const params = useParams();
  const [leaves, setLeaves] = useState<LeaveModel[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const getLeaves = async () => {
      const res = await axios.get("/api/v2/leaves");
      setLeaves(res.data.data.leaves);
    };

    getLeaves();
  }, []);

  useEffect(() => {
    params.leaveId ? setOpen(true) : setOpen(false);
  }, [params]);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="page-header">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Leave Requests</h1>
      </div>
      <div>
        <div className="hidden sm:block">
          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th className="pl-6">Leave</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-400 text-sm">
                {leaves.map((leave) => {
                  const status = leave.approval
                    ? leave.approval.approved
                      ? "Approved"
                      : "Rejected"
                    : "Pending";
                  return (
                    <tr key={leave._id}>
                      <td className="pl-6 py-2 w-[35%]">
                        <div>
                          <Link to={`/requests/leaves/${leave._id}`} state={{ fromLeaves: true }}>
                            <div className="text-gray-900 font-medium">{leave.reason}</div>
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="flex">
                          {format(new Date(leave.dateStart), "P")}
                          <ArrowNarrowRightIcon className="mx-2 w-4" />
                          {format(new Date(leave.dateEnd), "P")}
                        </div>
                      </td>
                      <td>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrapper>
        </div>
      </div>
      <Outlet context={{ open, setOpen }} />
      {/* <Detail open={open} setOpen={setOpen} /> */}
    </div>
  );
}

Leaves.Detail = Detail;

export default Leaves;
