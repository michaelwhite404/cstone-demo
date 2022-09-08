import { ReimbursementDocument } from "@@types/models";
import { Employee, Reimbursement } from "@models";
import { chat } from "@utils";

class ReimbursementEvent {
  async submit(reimbursement: ReimbursementDocument) {
    reimbursement = await Reimbursement.populate(reimbursement, { path: "user" });
    const employee = await Employee.findById(reimbursement.sendTo);
    if (!employee) return;
    if (employee.space) {
      await chat.spaces.messages.create({
        parent: employee.space,
        requestBody: {
          text: `${reimbursement.user.fullName} has made a reimbursement request.`,
        },
      });
    }
  }
}

export const reimbursementEvent = new ReimbursementEvent();
