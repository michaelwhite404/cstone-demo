import { ReimbursementDocument } from "@@types/models";
import { Employee, Reimbursement } from "@models";
import { chat } from "@utils";
import { format } from "date-fns";

class ReimbursementEvent {
  async submit(reimbursement: ReimbursementDocument) {
    reimbursement = await Reimbursement.populate(reimbursement, { path: "user" });
    const employee = await Employee.findById(reimbursement.sendTo);
    if (!employee) return;
    if (employee.space) {
      const response = await chat.spaces.messages.create({
        parent: employee.space,
        requestBody: {
          text: `${reimbursement.user.fullName} created a reimbursement request.`,

          cards: [
            {
              header: {
                title: "Reimbursement Request",
                subtitle: reimbursement.user.fullName,
                imageUrl: "https://i.ibb.co/qMHwLwK/Reimbursement-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    {
                      keyValue: {
                        topLabel: "Payee Name",
                        content: reimbursement.payee,
                      },
                    },
                    {
                      keyValue: {
                        topLabel: "Purchase Date",
                        content: format(new Date(reimbursement.date), "P"),
                      },
                    },
                    {
                      keyValue: {
                        topLabel: "Amount",
                        content: (reimbursement.amount / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        }),
                      },
                    },
                  ],
                },
                {
                  widgets: [
                    {
                      buttons: [
                        {
                          textButton: {
                            text: "OPEN IN APP",
                            onClick: {
                              openLink: {
                                url: "https://app.cornerstone-schools.org/requests/reimbursements",
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
      reimbursement.message = response.data.name!;
      await reimbursement.save();
    }
  }
}

export const reimbursementEvent = new ReimbursementEvent();
