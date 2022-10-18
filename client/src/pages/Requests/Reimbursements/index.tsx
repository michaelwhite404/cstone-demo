import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReimbursementApproval, ReimbursementModel } from "../../../../../src/types/models";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import Tabs2, { TabOption } from "../../../components/Tabs2";
import { useAuth, useDocTitle, useSocket } from "../../../hooks";
import { APIReimbursementResponse } from "../../../types/apiResponses";
import AddReimbursement from "./AddReimbursement";
import Approvals from "./Approvals";
import Detail from "./Detail";
import MyReimbursements from "./MyReimbursements";

export interface RM extends ReimbursementModel {
  selected: boolean;
  status: "Approved" | "Rejected" | "Pending";
}

type PageState = "MY_REIMBURSEMENTS" | "APPROVALS" | "ALL";

export default function Reimbursements() {
  const [pageState, setPageState] = useState<PageState>("MY_REIMBURSEMENTS");
  useDocTitle("Reimbursement Requests | School App");
  const [reimbursements, setReimbursements] = useState<RM[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const user = useAuth().user!;
  const socket = useSocket();

  const getStatus = (approval?: ReimbursementApproval) =>
    approval ? (approval.approved ? "Approved" : "Rejected") : ("Pending" as RM["status"]);

  const fetchReimbursements = async (): Promise<RM[]> => {
    const reimbursementId = location.hash.replace("#", "");
    reimbursementId &&
      window.history.replaceState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    const reimbursements = (await axios.get("/api/v2/reimbursements")).data.data
      .reimbursements as ReimbursementModel[];
    const r = reimbursements.map((r) => ({
      ...r,
      selected: r._id === reimbursementId,
      status: getStatus(r.approval),
    }));
    setReimbursements(r);
    const selected = r.find((re) => re.selected);
    if (selected) {
      selected.sendTo._id === user._id &&
        selected.user._id !== user._id &&
        setPageState("APPROVALS");
      setSlideOpen(true);
    }
    setLoaded(true);
    return r;
  };

  useEffect(() => {
    fetchReimbursements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleFinalize = (finalized: ReimbursementModel) => {
      const index = reimbursements.findIndex((r) => r._id === finalized._id);
      if (index === -1) return;
      const copy = [...reimbursements];
      const status = getStatus(finalized.approval);
      copy[index].approval = finalized.approval;
      copy[index].status = status;
      setReimbursements(copy);
    };

    const handleSubmitted = (reimbursement: ReimbursementModel) => {
      const copy = [...reimbursements];
      copy.unshift({ ...reimbursement, selected: false, status: "Pending" });
      setReimbursements(copy);
    };

    socket?.on("finalizeReimbursement", handleFinalize);
    socket?.on("submittedReimbursement", handleSubmitted);
    return () => {
      socket?.off("finalizeReimbursement", handleFinalize);
      socket?.off("submittedReimbursement", handleSubmitted);
    };
  }, [reimbursements, socket, user]);

  const selected = reimbursements.find((r) => r.selected);

  const select = (r: RM) => {
    const copy = [...reimbursements];
    const index = copy.findIndex((record) => record._id === r._id);
    if (index === -1) return;
    copy[index].selected = true;
    setReimbursements(copy);
    setSlideOpen(true);
  };

  const finalizeReimbursement = async (id: string, approved: boolean) => {
    const res = await axios.post<APIReimbursementResponse>(`/api/v2/reimbursements/${id}/approve`, {
      approved,
    });
    return res.data.data.reimbursement;
  };

  const isLeader = user.departments?.some((d) => d.role === "LEADER");

  const tabs: TabOption<PageState>[] = [
    { name: "My Reimbursements", value: "MY_REIMBURSEMENTS" },
    {
      name: "Approvals",
      value: "APPROVALS",
      count: reimbursements.filter((r) => r.sendTo._id === user._id && !r.approval).length,
    },
  ];
  if (user.departments?.some((d) => d.name === "Finance" && d.role === "LEADER")) {
    tabs.push({ name: "All", value: "ALL" });
  }

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="sm:flex sm:justify-between  sm:align-center">
        <div className="page-header">
          <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>
            Reimbursement Requests
          </h1>
          <p>View and create reimbursement requests</p>
        </div>
        <div className="flex justify-end sm:block sm:mt-4">
          <PrimaryButton
            className="w-full sm:w-auto"
            text="+ Create Reimbursement"
            onClick={() => setModalOpen(true)}
          />
        </div>
      </div>
      {isLeader && (
        <div className="sm:mt-0 mt-3">
          <Tabs2 tabs={tabs} value={pageState} onChange={(tab) => setPageState(tab.value)} />
        </div>
      )}
      {loaded && (
        <>
          {pageState === "MY_REIMBURSEMENTS" && (
            <MyReimbursements
              reimbursements={reimbursements.filter((r) => r.user._id === user._id)}
              select={select}
            />
          )}

          {pageState === "APPROVALS" && (
            <Approvals
              reimbursements={reimbursements.filter((r) => r.sendTo?._id === user._id)}
              setReimbursements={setReimbursements}
              select={select}
              finalizeReimbursement={finalizeReimbursement}
            />
          )}
          {pageState === "ALL" && (
            <Approvals
              reimbursements={reimbursements}
              setReimbursements={setReimbursements}
              select={select}
              finalizeReimbursement={finalizeReimbursement}
            />
          )}
        </>
      )}
      <AddReimbursement
        open={modalOpen}
        setOpen={setModalOpen}
        setReimbursements={setReimbursements}
      />
      <Detail
        open={slideOpen}
        setOpen={setSlideOpen}
        setReimbursements={setReimbursements}
        reimbursement={selected}
        user={user}
        finalizeReimbursement={finalizeReimbursement}
        getStatus={getStatus}
      />
    </div>
  );
}
