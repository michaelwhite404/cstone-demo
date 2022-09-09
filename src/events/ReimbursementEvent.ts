import { ReimbursementDocument } from "@@types/models";
import { Employee, Reimbursement } from "@models";
import { chat } from "@utils";
import { format } from "date-fns";

const URL =
  process.env.NODE_ENV! === "development"
    ? "http://localhost:8080"
    : "https://app.cornerstone-schools.org";

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
                subtitle: reimbursement.purpose,
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
                    {
                      keyValue: {
                        topLabel: "Status",
                        content: '<font color="#ffc566">Pending</font>',
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
                            text: "APPROVE",
                            onClick: {
                              action: {
                                actionMethodName: "FINALIZE_TIMESHEET",
                                parameters: [
                                  { key: "reimbursementId", value: reimbursement._id.toString() },
                                  { key: "approved", value: "true" },
                                ],
                              },
                            },
                          },
                        },
                        {
                          textButton: {
                            text: "REJECT",
                            onClick: {
                              action: {
                                actionMethodName: "FINALIZE_TIMESHEET",
                                parameters: [
                                  { key: "reimbursementId", value: reimbursement._id.toString() },
                                  { key: "approved", value: "false" },
                                ],
                              },
                            },
                          },
                        },
                        {
                          textButton: {
                            text: "OPEN IN APP",
                            onClick: {
                              openLink: {
                                url: `http://localhost:3000/requests/reimbursements#${reimbursement._id}`,
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

  async finalize(reimbursement: ReimbursementDocument) {
    reimbursement = (await Reimbursement.findById(reimbursement).select("+message"))!;
    if (!reimbursement || !reimbursement.message) return;
    await chat.spaces.messages.update({
      name: reimbursement.message,
      updateMask: "cards",
      requestBody: {
        cards: [
          {
            header: {
              title: "Reimbursement Request",
              subtitle: reimbursement.purpose,
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
                  {
                    keyValue: {
                      topLabel: "Status",
                      content: reimbursement.approval!.approved
                        ? '<font color="#00A602">Approved</font>'
                        : '<font color="#DC143C">Rejected</font>',
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
                              url: `http://localhost:3000/requests/reimbursements#${reimbursement._id}`,
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
  }
}

export const reimbursementEvent = new ReimbursementEvent();
