import { EmployeeDocument, TicketAssignUpdateDocument, TicketDocument } from "@@types/models";
import { Ticket } from "@models";
import { chat } from "@utils";
import capitalize from "capitalize";

const URL =
  process.env.NODE_ENV! === "development"
    ? "http://localhost:3000"
    : "https://app.cornerstone-schools.org";

class TicketEvent {
  async submit(ticket: TicketDocument) {
    ticket = await Ticket.populate(ticket, { path: "assignedTo submittedBy" });
    const assignedTo = ticket.assignedTo as EmployeeDocument[];
    const spaces = assignedTo.filter((e) => e.space).map((e) => e.space) as string[];
    spaces.forEach(async (space) => {
      await chat.spaces.messages.create({
        parent: space,
        requestBody: {
          text: `${ticket.submittedBy.fullName} has submitted a ticket`,
          cards: [
            {
              header: {
                title: "New Ticket",
                subtitle: `#${ticket.ticketId}`,
                imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    { keyValue: { topLabel: "Title", content: ticket.title } },
                    { keyValue: { topLabel: "Description", content: ticket.description } },
                    {
                      keyValue: {
                        topLabel: "Priority",
                        content: capitalize(ticket.priority.toLowerCase()),
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
                                url: `${URL}/tickets/${ticket.ticketId}`,
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
    });
  }

  update() {}

  async assign(update: TicketAssignUpdateDocument) {
    const ticket = await Ticket.findById(update.ticket).populate({
      path: "assignedTo submittedBy",
    });
    if (!ticket) return;

    const user = (ticket.assignedTo as EmployeeDocument[]).find(
      (user) => user._id.toString() === update.assign.toString()
    );
    if (!user || !user.space) return;
    await chat.spaces.messages.create({
      parent: user.space,
      requestBody: {
        text: `You have been assigned to a ticket`,
        cards: [
          {
            header: {
              title: "Assigned Ticket",
              subtitle: `#${ticket.ticketId}`,
              imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
            },
            sections: [
              {
                widgets: [
                  { keyValue: { topLabel: "Title", content: ticket.title } },
                  { keyValue: { topLabel: "Description", content: ticket.description } },
                  {
                    keyValue: {
                      topLabel: "Priority",
                      content: capitalize(ticket.priority.toLowerCase()),
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
                              url: `${URL}/tickets/${ticket.ticketId}`,
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

  async comment() {}

  async close() {}
}

export const ticketEvent = new TicketEvent();
