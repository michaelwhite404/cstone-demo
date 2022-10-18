import { ReimbursementDocument } from "@@types/models";
import { Reimbursement } from "@models";
import { io } from "@server";

class ReimbursementEvent {
  async submit(reimbursement: ReimbursementDocument) {
    reimbursement = await Reimbursement.populate(reimbursement, "user sendTo");
    // Do not send submit notifications to self
    if (reimbursement.sendTo._id.toString() === reimbursement.user._id.toString()) return;
    const sockets = await io.fetchSockets();
    const foundSocket = sockets.find(
      (socket) => reimbursement.sendTo.email === socket.data.user?.email
    );
    if (foundSocket) io.to(foundSocket.id).emit("submittedReimbursement", reimbursement);
  }

  async finalize(reimbursement: ReimbursementDocument) {
    reimbursement = (await Reimbursement.findById(reimbursement)
      .populate("user sendTo")
      .select("+message"))!;
    if (!reimbursement) return;
    const sendingEmails: string[] = [reimbursement.sendTo.email, reimbursement.user.email];
    const sockets = await io.fetchSockets();
    const sendSockets = sockets.filter((socket) => sendingEmails.includes(socket.data.user?.email));
    sendSockets.forEach((socket) => io.to(socket.id).emit("finalizeReimbursement", reimbursement));
  }
}

export const reimbursementEvent = new ReimbursementEvent();
