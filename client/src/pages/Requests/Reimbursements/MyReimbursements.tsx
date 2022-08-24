import React from "react";
import { RM } from ".";
import AddReimbursement from "./AddReimbursement";
import Detail from "./Detail";
import ReimbursementList from "./ReimbursementList";
import ReimbursementTable from "./ReimbursementTable";

interface Props {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  slideOpen: boolean;
  setSlideOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReimbursements: React.Dispatch<React.SetStateAction<RM[]>>;
  selected: RM | undefined;
}

export default function MyReimbursements(props: Props) {
  const {
    reimbursements,
    select,
    modalOpen,
    setModalOpen,
    slideOpen,
    setSlideOpen,
    setReimbursements,
    selected,
  } = props;
  return (
    <>
      <div>
        <div className="hidden sm:block">
          <ReimbursementTable reimbursements={reimbursements} select={select} />
        </div>
        <div className="sm:hidden block">
          <ReimbursementList reimbursements={reimbursements} />
        </div>
      </div>
      <AddReimbursement open={modalOpen} setOpen={setModalOpen} />
      <Detail
        open={slideOpen}
        setOpen={setSlideOpen}
        setReimbursements={setReimbursements}
        reimbursement={selected}
      />
    </>
  );
}
