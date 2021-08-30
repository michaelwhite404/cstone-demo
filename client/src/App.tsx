import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import Students from "./pages/Students/Students";
import DeviceType from "./pages/DeviceType/DeviceType";
import Sidebar from "./components/Sidebar/Sidebar";
import Textbooks from "./pages/Textbooks/Textbooks";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import Devices from "./pages/Devices/Devices";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./components/Login";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { EmployeeModel } from "../../src/types/models/employeeTypes";

interface NavRouteProps {
  exact: boolean;
  path: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

const NavRoute = ({ exact, path, component: Component }: NavRouteProps) => (
  <Route
    exact={exact}
    path={path}
    render={(props) => (
      <div className="app-container">
        <Sidebar />
        <div
          className="main-area-container"
          style={{ backgroundColor: "#f9fcff", width: "100%", padding: "10px 25px 25px" }}
        >
          <Component {...props} />
        </div>
      </div>
    )}
  />
);

function ProtectedNavRoute({
  exact,
  path,
  auth,
  component: Component,
  ...restOfProps
}: NavRouteProps & { auth: boolean }) {
  const isAuthenticated = auth;

  return (
    <Route
      {...restOfProps}
      render={() =>
        isAuthenticated ? <NavRoute exact path={path} component={Component} /> : <Redirect to="/" />
      }
    />
  );
}

export const UserContext = createContext<EmployeeModel | null>({} as EmployeeModel);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<EmployeeModel | null>(null);

  useEffect(() => {
    fetchMe();

    async function fetchMe() {
      try {
        const res = await axios.get("api/v2/users/me");
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
            <Route exact path="/">
              <Home setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            </Route>
            <UserContext.Provider value={user}>
              <ProtectedNavRoute
                exact
                path="/dashboard"
                component={Dashboard}
                auth={isAuthenticated}
              />
              <ProtectedNavRoute exact path="/devices" component={Devices} auth={isAuthenticated} />
              <ProtectedNavRoute
                exact
                path="/devices/:deviceType"
                component={DeviceType}
                auth={isAuthenticated}
              />
              <ProtectedNavRoute
                exact
                path="/textbooks"
                component={Textbooks}
                auth={isAuthenticated}
              />
              <ProtectedNavRoute
                exact
                path="/students"
                component={Students}
                auth={isAuthenticated}
              />
            </UserContext.Provider>
          </Switch>
        </Router>
      )}
    </>
  );
}

function Home({
  setIsAuthenticated,
  setUser,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<EmployeeModel | null>>;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          backgroundImage: "url(education-icon-background.png)",
          backgroundSize: "200px 200px",
        }}
      >
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img
            src="Cornerstone-Logo.png"
            alt="Cornerstone Logo"
            style={{ position: "absolute", top: 50, width: "100px" }}
          />
          <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        </div>
        <div style={{ width: "70%", height: "100%", padding: "15px" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "15px",
              background:
                "linear-gradient(251deg, rgba(23, 48, 204, 0.76), rgba(25, 104, 177, 0.91)), url(login-image.jpeg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
