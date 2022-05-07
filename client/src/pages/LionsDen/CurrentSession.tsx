import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import InactiveSession from "./InactiveSession";

export default function CurrentSession() {
  const [data, setData] = useState();

  useLayoutEffect(() => {
    getCurrentSession();
  }, []);

  const getCurrentSession = async () => {
    const res = await axios.get("/api/v2/aftercare/session/today");
    setData(res.data.data);
  };

  return <InactiveSession />;
}
