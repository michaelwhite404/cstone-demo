import { Routes as ReactRoutes, Route, Navigate } from "react-router-dom";
import AppContainer from "./AppContainer";
import { useAuth } from "./hooks";
import Dashboard from "./pages/Dashboard/Dashboard";
import Devices from "./pages/Devices/Devices";
import AddDevice from "./pages/DeviceType2/AddDevice";
import DeviceData from "./pages/DeviceType2/DeviceData";
import DeviceEmptyState from "./pages/DeviceType2/DeviceEmptyState";
import DeviceType2 from "./pages/DeviceType2/DeviceType2";
import CurrentSession from "./pages/LionsDen/CurrentSession";
import LionsDen from "./pages/LionsDen/LionsDen";
import LionsDenStudents from "./pages/LionsDen/LionsDenStudents";
import Sessions from "./pages/LionsDen/Sessions";
import Students2 from "./pages/Students2/Students2";
import TextbooksTest from "./pages/TextbooksTest/TextbooksTest";
import Timesheet from "./pages/Timesheet";
import Tools from "./pages/Tools";

export default function Routes() {
  const user = useAuth().user!;

  return (
    <ReactRoutes>
      <Route path="/" element={<AppContainer />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="students" element={<Students2 />} />
        <Route path="textbooks" element={<TextbooksTest />} />
        <Route path="devices" element={<Devices />} />
        <Route path="/devices/:deviceType" element={<DeviceType2 />}>
          <Route index element={<DeviceEmptyState />} />
          <Route path="add" element={<AddDevice />} />
          <Route path=":slug" element={<DeviceData />} />
        </Route>
        {user.timesheetEnabled && <Route path="timesheet" element={<Timesheet />} />}
        <Route path="lions-den" element={<LionsDen />}>
          <Route index element={<CurrentSession />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="students" element={<LionsDenStudents />} />
        </Route>
        <Route path="tools">
          <Route index element={<Tools />} />
          <Route path="short-url" element={<Tools.ShortUrl />} />
        </Route>
      </Route>
    </ReactRoutes>
  );
}
