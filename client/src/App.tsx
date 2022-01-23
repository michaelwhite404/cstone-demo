import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
// import Students from "./pages/Students/Students";
// import DeviceType from "./pages/DeviceType/DeviceType";
import Sidebar from "./components/Sidebar/Sidebar";
// import Textbooks from "./pages/Textbooks/Textbooks";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import Devices from "./pages/Devices/Devices";
import Dashboard from "./pages/Dashboard/Dashboard";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { EmployeeModel } from "../../src/types/models/employeeTypes";
import Home from "./pages/Home/Home";
import { FocusStyleManager } from "@blueprintjs/core";
import Stats from "./pages/DeviceType/Stats/Stats";
import DeviceLogs from "./pages/DeviceType/DeviceLogs/DeviceLogs";
import SingleDevice from "./pages/DeviceType/SingleDevice/SingleDevice";
import { ToasterProvider } from "./context/ToasterContext";
import { useWindowSize } from "./hooks";
import Topbar from "./components/Topbar/Topbar";
import TextbooksTest from "./pages/TextbooksTest/TextbooksTest";
import DeviceType2 from "./pages/DeviceType2/DeviceType2";
import Students2 from "./pages/Students2/Students2";

interface NavRouteProps {
  exact: boolean;
  path: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  noPadding?: boolean;
}

const NavRoute = ({ exact, path, component: Component, noPadding = false }: NavRouteProps) => {
  const [width] = useWindowSize();

  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <div className="app-container">
          {width > 992 ? <Sidebar /> : <Topbar />}
          <div
            className="main-area-container"
            style={{
              backgroundColor: "#f9fcff",
              width: "100%",
              height: "100%",
              padding: noPadding ? undefined : "10px 25px 25px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Component {...props} />
          </div>
        </div>
      )}
    />
  );
};

function ProtectedNavRoute({
  exact,
  path,
  auth,
  component: Component,
  noPadding,
  ...restOfProps
}: NavRouteProps & { auth: boolean }) {
  const isAuthenticated = auth;

  return (
    <Route
      {...restOfProps}
      render={() =>
        isAuthenticated ? (
          <NavRoute exact path={path} component={Component} noPadding={noPadding} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

interface UserContextProps {
  user: EmployeeModel | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<EmployeeModel | null>(null);

  FocusStyleManager.onlyShowFocusOnTabs();

  useEffect(() => {
    fetchMe();

    async function fetchMe() {
      try {
        const res = await axios.get("/api/v2/users/me");
        if (res.data.status === "success") {
          setIsAuthenticated(true);
          setUser(res.data.data.user);
        }
      } catch (err) {
      } finally {
        setLoaded(true);
      }
    }
  }, []);

  return (
    <>
      {loaded && (
        <Router>
          <Switch>
            <ToasterProvider>
              <Route exact path="/">
                {isAuthenticated ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Home setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
                )}
              </Route>
              <UserContext.Provider value={{ user, setIsAuthenticated }}>
                <ProtectedNavRoute
                  exact
                  path="/dashboard"
                  component={Dashboard}
                  auth={isAuthenticated}
                />
                <ProtectedNavRoute
                  exact
                  path="/devices"
                  component={Devices}
                  auth={isAuthenticated}
                />
                <ProtectedNavRoute
                  exact
                  path="/devices/:deviceType(chromebooks|tablets)"
                  component={DeviceType2}
                  auth={isAuthenticated}
                  noPadding
                />
                <ProtectedNavRoute
                  exact
                  path="/devices/:deviceType(chromebooks|tablets)/stats"
                  component={Stats}
                  auth={isAuthenticated}
                />
                <ProtectedNavRoute
                  exact
                  path="/devices/:deviceType(chromebooks|tablets)/logs"
                  component={DeviceLogs}
                  auth={isAuthenticated}
                />
                <ProtectedNavRoute
                  exact
                  path={`/devices/:deviceType(chromebooks|tablets)/:slug([a-z]{2}-\\d{2,4})`}
                  component={SingleDevice}
                  auth={isAuthenticated}
                />
                <ProtectedNavRoute
                  exact
                  path="/textbooks"
                  component={TextbooksTest}
                  auth={isAuthenticated}
                  noPadding
                />
                <ProtectedNavRoute
                  exact
                  path="/students"
                  component={Students2}
                  auth={isAuthenticated}
                  noPadding
                />
              </UserContext.Provider>
            </ToasterProvider>
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
