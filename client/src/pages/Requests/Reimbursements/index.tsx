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
  const [approvals, setApprovals] = useState<RM[]>([]);
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
      const data = reimbursements.reduce(
        (prevVal, nextVal) => {
          const r = {
            ...nextVal,
            selected: false,
            status: nextVal.approval
              ? nextVal.approval.approved
                ? "Approved"
                : "Rejected"
              : ("Pending" as RM["status"]),
          };
          if (r.user._id === user._id) prevVal.reimbursements.push(r);
          if (r.sendTo._id === user._id) prevVal.approvals.push(r);
          return prevVal;
        },
        {
          reimbursements: [] as RM[],
          approvals: [] as RM[],
        }
      );
      setReimbursements(data.reimbursements);
      setApprovals(data.approvals);
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
          <PrimaryButton
            className="w-full sm:w-auto"
            text="+ Create Reimbursement"
            onClick={() => setModalOpen(true)}
          />
        </div>
      </div>
      {isLeader && (
        <div className="sm:mt-0 mt-3">
          <Tabs2
            tabs={[
              { name: "My Reimbursements", value: "MY_REIMBURSEMENTS" },
              { name: "Approvals", value: "APPROVALS" },
            ]}
            value={pageState}
            onChange={(tab) => setPageState(tab.value)}
          />
        </div>
      )}
      {pageState === "MY_REIMBURSEMENTS" ? (
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
      ) : (
        <div>Approvals</div>
      )}
    </div>
  );
}
