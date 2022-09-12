import axios from "axios";
import React, { useEffect, useState } from "react";
import { TicketModel } from "../../../../src/types/models";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import CreateTicketModal from "./CreateTicketModal";
import MyTicketTable from "./MyTicketTable";
import TicketDetails from "./TicketDetails";

export default function Tickets() {
  const [tickets, setTickets] = useState<TicketModel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await axios.get("/api/v2/tickets");
      setTickets(res.data.data.tickets);
    };
    fetchTickets();
  }, []);
  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Tickets</h1>
        {/* <p>Manage the team and account permissions here</p> */}
        <PrimaryButton text="+ Create New Ticket" onClick={() => setModalOpen(true)} />
      </div>
      <div>
        <MyTicketTable tickets={tickets} />
      </div>
      <CreateTicketModal open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}

Tickets.TicketDetails = TicketDetails;
