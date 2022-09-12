import { LeaveDocument } from "@@types/models";
import { Leave } from "@models";
import { io } from "@server";
import { chat } from "@utils";
import { format } from "date-fns";

const URL =
  process.env.NODE_ENV! === "development"
    ? "http://localhost:3000"
    : "https://app.cornerstone-schools.org";

class LeaveEvent {
  async submit(leave: LeaveDocument) {
    leave = await Leave.populate(leave, "user sendTo");
    // Do not send submit notifications to self
    if (leave.sendTo._id.toString() === leave.user._id.toString()) return;
    const sockets = await io.fetchSockets();
    const foundSocket = sockets.find((socket) => leave.sendTo.email === socket.data.user?.email);
    if (foundSocket) io.to(foundSocket.id).emit("submittedLeave", leave);
    if (leave.sendTo.space) {
      const sectionsWidgets = [
        {
          keyValue: {
            topLabel: "Submitted By",
            content: leave.user.fullName,
          },
        },
        {
          keyValue: {
            topLabel: "Reason",
            content: leave.reason,
          },
        },
      ];
      if (leave.comments)
        sectionsWidgets.push({
          keyValue: {
            topLabel: "Comments",
            content: leave.comments,
          },
        });
      sectionsWidgets.push(
        {
          keyValue: {
            topLabel: "Dates Requested",
            content: `${format(new Date(leave.dateStart), "P")} → ${format(
              new Date(leave.dateEnd),
              "P"
            )}`,
          },
        },
        {
          keyValue: {
            topLabel: "Status",
            content: '<font color="#ffc566">Pending</font>',
          },
        }
      );
      const response = await chat.spaces.messages.create({
        parent: leave.sendTo.space,
        requestBody: {
          text: `${leave.user.fullName} created a leave request.`,
          cards: [
            {
              header: {
                title: "Leave Request",
                imageUrl: "https://i.ibb.co/gTPJqV1/Leave-Blue.png",
              },
              sections: [
                { widgets: sectionsWidgets },
                {
                  widgets: [
                    {
                      buttons: [
                        {
                          textButton: {
                            text: "APPROVE",
                            onClick: {
                              action: {
                                actionMethodName: "FINALIZE_LEAVE",
                                parameters: [
                                  { key: "leaveId", value: leave._id.toString() },
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
                                actionMethodName: "FINALIZE_LEAVE",
                                parameters: [
                                  { key: "leaveId", value: leave._id.toString() },
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
                                url: `${URL}/requests/leaves#${leave._id}`,
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
      leave.message = response.data.name!;
      await leave.save();
    }
  }
}

export const leaveEvent = new LeaveEvent();
