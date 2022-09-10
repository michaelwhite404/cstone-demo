import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useAuth, useDocTitle } from "../../../hooks";
import { LeaveModel } from "../../../../../src/types/models";
import TableWrapper from "../../../components/TableWrapper";
import { Link, Outlet, useParams } from "react-router-dom";
import Detail from "./Detail";
import BadgeColor from "../../../components/Badge/BadgeColor";
import Badge from "../../../components/Badge/Badge";
import AddLeave from "./AddLeave";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import Tabs2 from "../../../components/Tabs2";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";

type PageState = "MY_LEAVES" | "APPROVALS";

function Leaves() {
  const [pageState, setPageState] = useState<PageState>("MY_LEAVES");
  const [loaded, setLoaded] = useState(false);
  useDocTitle("Leave Requests | Cornerstone App");
  const params = useParams<"leaveId">();
  const [leaves, setLeaves] = useState<LeaveModel[]>([]);
  const [slideOpen, setSlideOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const user = useAuth().user!;
  const selected = leaves.find((leave) => leave._id === params.leaveId);
  useEffect(() => {
    const getLeaves = async () => {
      setLoaded(false);
      const res = await axios.get("/api/v2/leaves");
      setLeaves(res.data.data.leaves);
      setLoaded(true);
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

  const isLeader = user.departments?.some((d) => d.role === "LEADER");

  return (
    <div className="relative h-[100vh]" style={{ padding: "10px 25px 25px" }}>
      <div className="sm:flex sm:justify-between  sm:align-center">
        <div className="page-header">
          <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Leave Requests</h1>
          <p>View and create leave requests</p>
        </div>
        <div className="flex justify-end sm:block sm:mt-4">
          <PrimaryButton
            className="w-full sm:w-auto"
            text="+ Create Leave"
            onClick={() => setModalOpen(true)}
          />
        </div>
      </div>
      {isLeader && (
        <div className="sm:mt-0 mt-3">
          <Tabs2
            tabs={[
              { name: "My Leaves", value: "MY_LEAVES" },
              {
                name: "Approvals",
                value: "APPROVALS",
                // count: leaves.filter((r) => r.sendTo._id === user._id && !r.approval).length,
              },
            ]}
            value={pageState}
            onChange={(tab) => setPageState(tab.value)}
          />
        </div>
      )}
      {loaded && leaves.length > 0 && (
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
                  {leaves.map((leave, i) => {
                    const status = leave.approval
                      ? leave.approval.approved
                        ? "Approved"
                        : "Rejected"
                      : "Pending";
                    return (
                      <tr
                        key={leave._id}
                        className={i !== leaves.length - 1 ? "border-b border-gray-200" : ""}
                      >
                        <td className="pl-6 py-2 w-[35%]">
                          <div className="pr-6 md:w-[350px]">
                            <Link to={`/requests/leaves/${leave._id}`} state={{ fromLeaves: true }}>
                              <div className="text-blue-500 font-medium">{leave.reason}</div>
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
                          <ApprovalBadge status={status} />
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
      )}
      {loaded && leaves.length === 0 && (
        <div className="flex justify-center w-full lg:absolute">
          <div className="flex align-center justify-center flex-col mt-8 py-5">
            <img
              className="w-[80%] lg:w-[70%] xl:w-[50%] opacity-70"
              src="/Sick_Leave_Illustration.png"
              alt="Sick Leave"
            />
            <div className="lg:text-lg text-md font-medium text-center mt-2 text-gray-500">
              You don't have any leave requests so far
            </div>
          </div>
        </div>
      )}
      <AddLeave open={modalOpen} setOpen={setModalOpen} setLeaves={setLeaves} />
      <Outlet context={{ open: slideOpen, setOpen: setSlideOpen, selected }} />
    </div>
  );
}

Leaves.Detail = Detail;

export default Leaves;
