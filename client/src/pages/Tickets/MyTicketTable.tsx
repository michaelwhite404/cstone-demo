import capitalize from "capitalize";
import React from "react";
import { Link } from "react-router-dom";
import { TicketModel } from "../../../../src/types/models";
import TableWrapper from "../../components/TableWrapper";

interface MyTicketTableProps {
  tickets: TicketModel[];
}
export default function MyTicketTable({ tickets }: MyTicketTableProps) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-6">Ticket #</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-400">
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td className="pl-6 py-2 font-light text-gray-300">
                <Link to={ticket.ticketId.toString()}>#{ticket.ticketId}</Link>
              </td>
              <td className="font-medium text-gray-700">{ticket.title}</td>
              <td>{capitalize(ticket.priority.toLowerCase())}</td>
              <td>{capitalize(ticket.status.toLowerCase())}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
