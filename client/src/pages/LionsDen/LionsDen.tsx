import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Dot from "../../components/Dot";
import Tabs from "../../components/Tabs";
import { useDocTitle } from "../../hooks";

const tabs = [
  { title: "Current Session", name: "current-session", href: "" },
  { title: "Sessions", name: "sessions", href: "/sessions" },
  { title: "Students", name: "students", href: "/students" },
];

type LionsDenPageState = "current-session" | "sessions" | "students";

export default function LionsDen() {
  useDocTitle("Lions Den | Cornerstone App");
  const [pageState, setPageState] = useState<LionsDenPageState>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getPageState = () => {
      const paths = location.pathname.split("/").filter((p) => p !== "");
      if (paths.length === 1) return setPageState("current-session");
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
            {tabs.map((tab, i) => (
              <Tabs.Tab
                key={tab.name}
                current={pageState === tab.name}
                onClick={() => navigate(`/lions-den${tab.href}`)}
              >
                {tab.title}
                <span className="absolute -top-1 -right-1 b">
                  {tab.name === "current-session" && <Dot color="red" blinking />}
                </span>
              </Tabs.Tab>
            ))}
          </Tabs>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
