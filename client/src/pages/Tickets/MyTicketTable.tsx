import capitalize from "capitalize";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { TicketModel } from "../../../../src/types/models";
import TableWrapper from "../../components/TableWrapper";

interface MyTicketTableProps {
  tickets: TicketModel[];
}
export default function MyTicketTable({ tickets }: MyTicketTableProps) {
  return (
    <TableWrapper>
      <div className="px-4 sm:px-8 p-2 grid grid-cols-[1fr_110px_70px] items-center bg-gray-50 border-b font-medium">
        <div className="uppercase text-gray-400 text-[12px] tracking-[1px]">Ticket</div>
        <div className="text-center uppercase text-gray-400 text-[12px] tracking-[1px]">
          Priority
        </div>
        <div className="text-center uppercase text-gray-400 text-[12px] tracking-[1px]">Status</div>
      </div>
      <div className="bg-white divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <div key={ticket._id}>
            <div className="hidden sm:block">
              <DesktopRow ticket={ticket} />
            </div>
            <div className="block sm:hidden">
              <MobileRow ticket={ticket} />
            </div>
          </div>
        ))}
      </div>
    </TableWrapper>
  );
}

const MobileRow = ({ ticket }: { ticket: TicketModel }) => {
  return (
    <Link
      to={`/tickets/${ticket.ticketId}`}
      className="px-4 sm:px-8 p-2 grid grid-cols-[1fr_110px_70px] items-center w-full"
    >
      <div>
        <div className="text-[16px] font-medium hover:text-blue-500">{ticket.title}</div>
        <div className="text-xs text-gray-400 mt-1">
          #{ticket.ticketId} opened on {formatDistanceToNow(new Date(ticket.createdAt))} ago by{" "}
          {ticket.submittedBy.fullName}
        </div>
      </div>
      <div className="text-center">{capitalize(ticket.priority.toLowerCase())}</div>
      <div className="text-center">{capitalize(ticket.status.toLowerCase())}</div>
    </Link>
  );
};

const DesktopRow = ({ ticket }: { ticket: TicketModel }) => {
  return (
    <div className="px-4 sm:px-8 p-2 grid grid-cols-[1fr_110px_70px] items-center w-full">
      <div>
        <Link
          to={`/tickets/${ticket.ticketId}`}
          className="text-[16px] font-medium hover:text-blue-500"
        >
          {ticket.title}
        </Link>
        <div className="text-xs text-gray-400 mt-1">
          #{ticket.ticketId} opened on {formatDistanceToNow(new Date(ticket.createdAt))} ago by{" "}
          {ticket.submittedBy.fullName}
        </div>
      </div>
      <div className="text-center">{capitalize(ticket.priority.toLowerCase())}</div>
      <div className="text-center">{capitalize(ticket.status.toLowerCase())}</div>
    </div>
  );
};
