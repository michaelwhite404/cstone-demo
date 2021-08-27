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
import { useEffect, useState } from "react";
import axios from "axios";

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchMe();

    async function fetchMe() {
      try {
        const res = await axios.get("api/v2/users/me");
        if (res.data.status === "success") {
          setIsAuthenticated(true);
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
              <Home setIsAuthenticated={setIsAuthenticated} />
            </Route>
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
            <ProtectedNavRoute exact path="/students" component={Students} auth={isAuthenticated} />
          </Switch>
        </Router>
      )}
    </>
  );
}

function Home({
  setIsAuthenticated,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <Login setIsAuthenticated={setIsAuthenticated} />
    </div>
  );
}

export default App;
