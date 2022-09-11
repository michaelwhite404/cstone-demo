import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useDocTitle } from "../../../hooks";
import { LeaveModel } from "../../../../../src/types/models";
import { Outlet, useParams } from "react-router-dom";
import Detail from "./Detail";
import AddLeave from "./AddLeave";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import Tabs2 from "../../../components/Tabs2";
import MyLeaves from "./MyLeaves";

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
      {loaded && <MyLeaves leaves={leaves.filter((l) => l.user._id === user._id)} />}
      <AddLeave open={modalOpen} setOpen={setModalOpen} setLeaves={setLeaves} />
      <Outlet context={{ open: slideOpen, setOpen: setSlideOpen, selected }} />
    </div>
  );
}

Leaves.Detail = Detail;

export default Leaves;
