import { Outlet } from "react-router-dom";
import Div100vh from "react-div-100vh";
import DevTag from "./components/DevTag";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import { useWindowSize } from "./hooks";

export default function AppContainer() {
  const [width] = useWindowSize();

  return (
    <Div100vh className="app-container">
      {width > 992 ? <Sidebar /> : <Topbar />}
      <div
        className="main-area-container"
        style={{
          backgroundColor: "#f9fcff",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </div>
      {process.env.NODE_ENV === "development" && <DevTag />}
    </Div100vh>
  );
}
