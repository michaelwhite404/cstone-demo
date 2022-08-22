import { Divider } from "@mui/material";
import React, { useState } from "react";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import AddReimbursement from "./AddReimbursement";

export default function Reimbursements() {
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
        <Divider />
      </div>
      <AddReimbursement open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}
