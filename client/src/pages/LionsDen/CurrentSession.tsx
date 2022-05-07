import axios from "axios";
import React, { useEffect, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

export default function CurrentSession() {
  const [data, setData] = useState();

  useEffect(() => {
    getCurrentSession();
  }, []);

  const getCurrentSession = async () => {
    const res = await axios.get("/api/v2/aftercare/session/today");
    setData(res.data.data);
  };

  return (
    <div>
      <div className="flex justify-end mb-10">
        <PrimaryButton onClick={() => {}}>Start Session</PrimaryButton>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 300 }}>
          <img src="/SleepingStudent.png" alt="Sleeping Student" />
          <p style={{ textAlign: "center", marginTop: 15, color: "gray" }}>
            There is no active session
          </p>
        </div>
      </div>
    </div>
  );
}
