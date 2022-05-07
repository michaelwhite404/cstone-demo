import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { useSocket } from "../../hooks";
import { CurrentSession as SessionNow } from "../../types/aftercareTypes";
import { APICurrentSessionResponse } from "../../types/apiResponses";
import ActiveSession from "./ActiveSession";
import InactiveSession from "./InactiveSession";

export default function CurrentSession() {
  const socket = useSocket();
  const [data, setData] = useState<SessionNow>({ session: null, attendance: [] });

  useLayoutEffect(() => {
    getCurrentSession();
    socket?.on("aftercareSignOutSuccess", getCurrentSession);
  }, [socket]);

  const getCurrentSession = async () => {
    const res = await axios.get<APICurrentSessionResponse>("/api/v2/aftercare/session/today");
    setData(res.data.data);
  };

  const Session = () =>
    data.session ? (
      <ActiveSession attendance={data.attendance} />
    ) : (
      <InactiveSession setCurrentSession={setData} />
    );

  return <Session />;
}
