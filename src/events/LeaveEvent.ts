import { LeaveDocument } from "@@types/models";
import { Leave } from "@models";
import { io } from "@server";

class LeaveEvent {
  async submit(leave: LeaveDocument) {
    leave = await Leave.populate(leave, "user sendTo");
    // Do not send submit notifications to self
    if (leave.sendTo._id.toString() === leave.user._id.toString()) return;
    const sockets = await io.fetchSockets();
    const foundSocket = sockets.find((socket) => leave.sendTo.email === socket.data.user?.email);
    if (foundSocket) io.to(foundSocket.id).emit("submittedLeave", leave);
  }

  async finalize(leave: LeaveDocument) {
    leave = (await Leave.findById(leave).populate("user sendTo").select("+message"))!;
    if (!leave) return;
    const sendingEmails: string[] = [leave.sendTo.email, leave.user.email];
    const sockets = await io.fetchSockets();
    const sendSockets = sockets.filter((socket) => sendingEmails.includes(socket.data.user?.email));
    sendSockets.forEach((socket) => io.to(socket.id).emit("finalizeLeave", leave));
  }
}

export const leaveEvent = new LeaveEvent();
