import { Outlet } from "react-router-dom";
import Div100vh from "react-div-100vh";
import { useEffect } from "react";
import DevTag from "./components/DevTag";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import { useAuth, useSocket, useToasterContext, useWindowSize } from "./hooks";
import { ReimbursementApproval, ReimbursementModel } from "../../src/types/models";

export default function AppContainer() {
  const [width] = useWindowSize();
  const socket = useSocket();
  const user = useAuth().user!;
  const { showToaster } = useToasterContext();

  useEffect(() => {
    const getReimbursementStatus = (approval?: ReimbursementApproval) =>
      approval ? (approval.approved ? "Approved" : "Rejected") : "Pending";

    socket?.on("finalizeReimbursement", (finalized: ReimbursementModel) => {
      if (user._id === finalized.user._id && user._id !== finalized.sendTo._id) {
        const status = getReimbursementStatus(finalized.approval);
        showToaster(
          `Your reimbursement request for '${finalized.purpose}' has been ${status.toLowerCase()}`,
          status === "Approved" ? "success" : "danger"
        );
      }
    });
    socket?.on("submittedReimbursement", (reimbursement: ReimbursementModel) => {
      // @ts-ignore
      showToaster("You have received a reimbusement request", "none", "envelope");
    });

    return () => {
      socket?.off("finalizeReimbursement");
      socket?.off("submittedReimbursement");
    };
  }, [showToaster, socket, user._id]);

  return (
    <Div100vh className="app-container">
      {width > 992 ? <Sidebar /> : <Topbar />}
      <div
        className="main-area-container"
        style={{
          backgroundColor: "#f9fcff",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </div>
      {process.env.NODE_ENV === "development" && <DevTag />}
    </Div100vh>
  );
}
