import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useDocTitle, useSocket } from "../../../hooks";
import { LeaveApproval, LeaveModel } from "../../../../../src/types/models";
import Detail from "./Detail";
import AddLeave from "./AddLeave";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import Tabs2 from "../../../components/Tabs2";
import MyLeaves from "./MyLeaves";
import { APILeaveResponse } from "../../../types/apiResponses";

type PageState = "MY_LEAVES" | "APPROVALS";
const getStatus = (approval?: LeaveApproval): Leave["status"] =>
  approval ? (approval.approved ? "Approved" : "Rejected") : "Pending";

export interface Leave extends LeaveModel {
  selected: boolean;
  status: "Approved" | "Rejected" | "Pending";
}

function Leaves() {
  useDocTitle("Leave Requests | Cornerstone App");
  const [pageState, setPageState] = useState<PageState>("MY_LEAVES");
  const [loaded, setLoaded] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [slideOpen, setSlideOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const user = useAuth().user!;
  const socket = useSocket();

  useEffect(() => {
    const getLeaves = async () => {
      setLoaded(false);
      const leaves = (await axios.get("/api/v2/leaves")).data.data.leaves as LeaveModel[];
      const l = leaves.map((leave) => ({
        ...leave,
        selected: false,
        status: getStatus(leave.approval),
      }));
      setLeaves(l);
      setLoaded(true);
    };

    getLeaves();
  }, []);

  useEffect(() => {
    const handleFinalize = (finalized: LeaveModel) => {
      const index = leaves.findIndex((r) => r._id === finalized._id);
      if (index === -1) return;
      const copy = [...leaves];
      const status = getStatus(finalized.approval);
      copy[index].approval = finalized.approval;
      copy[index].status = status;
      setLeaves(copy);
    };

    const handleSubmitted = (leave: LeaveModel) => {
      const copy = [...leaves];
      copy.unshift({ ...leave, selected: false, status: "Pending" });
      setLeaves(copy);
    };

    socket?.on("finalizeLeave", handleFinalize);
    socket?.on("submittedLeave", handleSubmitted);
    return () => {
      socket?.off("finalizeLeave", handleFinalize);
      socket?.off("submittedLeave", handleSubmitted);
    };
  }, [leaves, socket, user]);

  const isLeader = user.departments?.some((d) => d.role === "LEADER");
  const selected = leaves.find((leave) => leave.selected);

  const select = (r: Leave) => {
    const copy = [...leaves];
    const index = copy.findIndex((record) => record._id === r._id);
    if (index === -1) return;
    copy[index].selected = true;
    setLeaves(copy);
    setSlideOpen(true);
  };

  const finalizeLeave = async (id: string, approved: boolean) => {
    const res = await axios.post<APILeaveResponse>(`/api/v2/leaves/${id}/approve`, { approved });
    return res.data.data.leave;
  };

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
                count: leaves.filter((r) => r.sendTo._id === user._id && !r.approval).length,
              },
            ]}
            value={pageState}
            onChange={(tab) => setPageState(tab.value)}
          />
        </div>
      )}
      {loaded && (
        <>
          {pageState === "MY_LEAVES" && (
            <MyLeaves leaves={leaves.filter((l) => l.user._id === user._id)} select={select} />
          )}
          {loaded && pageState === "APPROVALS" && (
            <MyLeaves leaves={leaves.filter((l) => l.sendTo._id === user._id)} select={select} />
          )}
        </>
      )}
      <AddLeave open={modalOpen} setOpen={setModalOpen} setLeaves={setLeaves} />
      <Detail
        open={slideOpen}
        setOpen={setSlideOpen}
        selected={selected}
        setLeaves={setLeaves}
        user={user}
        finalizeLeave={finalizeLeave}
        getStatus={getStatus}
      />
    </div>
  );
}

Leaves.Detail = Detail;

export default Leaves;
