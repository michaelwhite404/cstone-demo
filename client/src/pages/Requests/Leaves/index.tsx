import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useDocTitle } from "../../../hooks";
import { LeaveModel } from "../../../../../src/types/models";
import TableWrapper from "../../../components/TableWrapper";
import { Link, Outlet, useParams } from "react-router-dom";
import Detail from "./Detail";
import BadgeColor from "../../../components/Badge/BadgeColor";
import Badge from "../../../components/Badge/Badge";
import AddLeave from "./AddLeave";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";

function Leaves() {
  useDocTitle("Leave Requests | Cornerstone App");
  const params = useParams<"leaveId">();
  const [leaves, setLeaves] = useState<LeaveModel[]>([]);
  const [slideOpen, setSlideOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const selected = leaves.find((leave) => leave._id === params.leaveId);
  useEffect(() => {
    const getLeaves = async () => {
      const res = await axios.get("/api/v2/leaves");
      setLeaves(res.data.data.leaves);
    };

    getLeaves();
  }, []);

  useEffect(() => {
    params.leaveId ? setSlideOpen(true) : setSlideOpen(false);
  }, [params]);

  const badgeObj: { [x: string]: BadgeColor } = {
    Approved: "emerald",
    Pending: "yellow",
    Rejected: "red",
  };

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="sm:flex sm:justify-between  sm:align-center">
        <div className="page-header">
          <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Leave Requests</h1>
          <p>View and create leave requests</p>
        </div>
        <div className="flex justify-end sm:block sm:mt-4">
          <PrimaryButton text="+ Create Leave" onClick={() => setModalOpen(true)} />
        </div>
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
                        <div className="pr-6 md:w-[350px]">
                          <Link to={`/requests/leaves/${leave._id}`} state={{ fromLeaves: true }}>
                            <div className="text-gray-900 font-medium">{leave.reason}</div>
                          </Link>
                          {leave.comments && (
                            <div className="hidden md:block whitespace-nowrap overflow-hidden overflow-ellipsis">
                              {leave.comments}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex">
                          {format(new Date(leave.dateStart), "P")}
                          <ArrowNarrowRightIcon className="mx-2 w-4" />
                          {format(new Date(leave.dateEnd), "P")}
                        </div>
                      </td>
                      <td>
                        <Badge color={badgeObj[status]} text={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrapper>
        </div>
        <div className="block sm:hidden">
          <TableWrapper>
            <div className="sticky-header px-4 py-2">
              <span className="show-entry-label">Requests</span>
            </div>
            <ul className="bg-white">
              {leaves.map((leave) => {
                const status = leave.approval
                  ? leave.approval.approved
                    ? "Approved"
                    : "Rejected"
                  : "Pending";
                return (
                  <li key={leave._id}>
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
                            <Badge color={badgeObj[status]} text={status} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </TableWrapper>
        </div>
      </div>
      <AddLeave open={modalOpen} setOpen={setModalOpen} setLeaves={setLeaves} />
      <Outlet context={{ open: slideOpen, setOpen: setSlideOpen, selected }} />
    </div>
  );
}

Leaves.Detail = Detail;

export default Leaves;
