import "./App.scss";
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Div100vh from "react-div-100vh";
import Sidebar from "./components/Sidebar/Sidebar";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import Devices from "./pages/Devices/Devices";
import Dashboard from "./pages/Dashboard/Dashboard";
import { FocusStyleManager } from "@blueprintjs/core";
// import Stats from "./pages/DeviceType/Stats/Stats";
// import DeviceLogs from "./pages/DeviceType/DeviceLogs/DeviceLogs";
// import SingleDevice from "./pages/DeviceType/SingleDevice/SingleDevice";
import { ToasterProvider } from "./context/ToasterContext";
import { useWindowSize } from "./hooks";
import Topbar from "./components/Topbar/Topbar";
import TextbooksTest from "./pages/TextbooksTest/TextbooksTest";
import DeviceType2 from "./pages/DeviceType2/DeviceType2";
import Students2 from "./pages/Students2/Students2";
import "./pages/Devices/Devices.sass";
import AuthProvider from "./context/AuthProvider";

function App() {
  FocusStyleManager.onlyShowFocusOnTabs();

  return (
    <ToasterProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AppContainer />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Navigate to="/" replace />} />
              <Route path="students" element={<Students2 />} />
              <Route path="textbooks" element={<TextbooksTest />} />
              <Route path="devices" element={<Devices />} />
              <Route path="/devices/:deviceType" element={<DeviceType2 />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ToasterProvider>
  );
}

function AppContainer() {
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
    </Div100vh>
  );
}

export default App;
