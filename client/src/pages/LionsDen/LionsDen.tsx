import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Tabs from "../../components/Tabs";
import { useDocTitle } from "../../hooks";

const tabs = [
  { title: "Sessions", name: "sessions", href: "", current: true },
  { title: "Students", name: "students", href: "/students", current: false },
];

type LionsDenPageState = "sessions" | "students";

export default function LionsDen() {
  useDocTitle("Lions Den | Cornerstone App");
  const [pageState, setPageState] = useState<LionsDenPageState>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getPageState = () => {
      const paths = location.pathname.split("/").filter((p) => p !== "");
      if (paths.length === 1) return setPageState("sessions");
      setPageState(paths[paths.length - 1] as LionsDenPageState);
    };

    getPageState();
  }, [location.pathname]);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Lions Den</h1>
      </div>
      {/* Tabs */}
      <div className="hidden sm:block mb-10">
        <nav className="lions-den-tabs" aria-label="Tabs">
          <Tabs>
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab.name}
                name={tab.title}
                current={pageState === tab.name}
                onClick={() => navigate(`/lions-den${tab.href}`)}
              />
            ))}
          </Tabs>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
