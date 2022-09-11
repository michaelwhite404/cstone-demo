import React from "react";
import { LeaveModel } from "../../../../../src/types/models";
import EmptyState from "./EmptyState";
import MyLeavesList from "./MyLeavesList";
import MyLeavesTable from "./MyLeavesTable";

interface Props {
  leaves: LeaveModel[];
}

export default function MyLeaves(props: Props) {
  const { leaves } = props;
  return (
    <>
      {leaves.length > 0 ? (
        <div>
          <div className="hidden sm:block">
            <MyLeavesTable leaves={leaves} />
          </div>
          <div className="sm:hidden block">
            <MyLeavesList leaves={leaves} />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}
