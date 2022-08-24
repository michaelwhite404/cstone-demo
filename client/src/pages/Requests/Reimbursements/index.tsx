import axios from "axios";
import { useEffect, useState } from "react";
import { ReimbursementModel } from "../../../../../src/types/models";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import Tabs2 from "../../../components/Tabs2";
import { useAuth } from "../../../hooks";
import MyReimbursements from "./MyReimbursements";

export interface RM extends ReimbursementModel {
  selected: boolean;
  status: "Approved" | "Rejected" | "Pending";
}

type PageState = "MY_REIMBURSEMENTS" | "APPROVALS";

export default function Reimbursements() {
  const [pageState, setPageState] = useState<PageState>("MY_REIMBURSEMENTS");
  const [reimbursements, setReimbursements] = useState<RM[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);
  const user = useAuth().user!;
  useEffect(() => {
    const fetchReimbursements = async () => {
      const reimbursements = (await axios.get("/api/v2/reimbursements")).data.data
        .reimbursements as ReimbursementModel[];
      const r = reimbursements.map((r) => ({
        ...r,
        selected: false,
        status: r.approval
          ? r.approval.approved
            ? "Approved"
            : "Rejected"
          : ("Pending" as RM["status"]),
      }));
      setReimbursements(r);
    };

    fetchReimbursements();
  }, []);

  const selected = reimbursements.find((r) => r.selected);

  const select = (r: RM) => {
    const copy = [...reimbursements];
    const index = copy.findIndex((record) => record._id === r._id);
    if (index === -1) return;
    copy[index].selected = true;
    setReimbursements(copy);
    setSlideOpen(true);
  };

  const isLeader = user.departments?.some((d) => d.role === "LEADER");

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
          <PrimaryButton text="+ Create Reimbursement" onClick={() => setModalOpen(true)} />
        </div>
      </div>
      {isLeader && (
        <Tabs2
          tabs={[
            { name: "My Reimbursements", current: true },
            { name: "Approvals", current: false },
          ]}
        />
      )}
      <MyReimbursements
        reimbursements={reimbursements}
        select={select}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        slideOpen={slideOpen}
        setSlideOpen={setSlideOpen}
        setReimbursements={setReimbursements}
        selected={selected}
      />
    </div>
  );
}
