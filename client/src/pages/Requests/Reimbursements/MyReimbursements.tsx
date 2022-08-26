import React from "react";
import { RM } from ".";
import AddReimbursement from "./AddReimbursement";
import ReimbursementList from "./ReimbursementList";
import ReimbursementTable from "./ReimbursementTable";

interface Props {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MyReimbursements(props: Props) {
  const { reimbursements, select, modalOpen, setModalOpen } = props;
  return (
    <>
      <div>
        <div className="hidden sm:block">
          <ReimbursementTable reimbursements={reimbursements} select={select} />
        </div>
        <div className="sm:hidden block">
          <ReimbursementList reimbursements={reimbursements} select={select} />
        </div>
      </div>
      <AddReimbursement open={modalOpen} setOpen={setModalOpen} />
    </>
  );
}
