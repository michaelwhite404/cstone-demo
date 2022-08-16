import axios from "axios";
import React, { useEffect, useState } from "react";
import { TicketModel } from "../../../../src/types/models";
import MyTicketTable from "./MyTicketTable";
import TicketDetails from "./TicketDetails";

export default function Tickets() {
  const [tickets, setTickets] = useState<TicketModel[]>([]);

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
      </div>
      <div>
        <MyTicketTable tickets={tickets} />
      </div>
    </div>
  );
}

Tickets.TicketDetails = TicketDetails;
