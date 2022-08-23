import { Divider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReimbursementModel } from "../../../../../src/types/models";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import AddReimbursement from "./AddReimbursement";
import ReimbursementList from "./ReimbursementList";
import ReimbursementTable from "./ReimbursementTable";

export default function Reimbursements() {
  const [reimbursements, setReimbursements] = useState<ReimbursementModel[]>([]);
  useEffect(() => {
    const fetchReimbursements = async () => {
      const res = await axios.get("/api/v2/reimbursements");
      setReimbursements(res.data.data.reimbursements);
    };

    fetchReimbursements();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
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
      <div>
        <div className="hidden sm:block">
          <ReimbursementTable reimbursements={reimbursements} />
        </div>
        <div className="sm:hidden block">
          <ReimbursementList reimbursements={reimbursements} />
        </div>
      </div>
      <AddReimbursement open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}
