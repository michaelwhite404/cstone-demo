import { EmployeeDocument, TicketDocument } from "@@types/models";
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

  async assign() {}

  async comment() {}

  async close() {}
}

export const ticketEvent = new TicketEvent();
