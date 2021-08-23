import "./App.scss";
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from "react-router-dom";
import Students from "./pages/Students/Students";
import DeviceType from "./pages/DeviceType/DeviceType";
import Sidebar from "./components/Sidebar/Sidebar";
import Textbooks from "./pages/Textbooks/Textbooks";
import { Drawer } from "@blueprintjs/core";
// using node-style package resolution in a CSS file: 
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

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

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <NavRoute exact path="/dashboard" component={Dashboard} />
        <NavRoute exact path="/devices" component={Devices} />
        <NavRoute exact path="/devices/:deviceType" component={DeviceType} />
        <NavRoute exact path="/textbooks" component={Textbooks} />
        <NavRoute exact path="/students" component={Students} />
      </Switch>
    </Router>
  );
}

function Home() {
  return <div>
    <form>
      <a href="http://localhost:8080/auth/google">Click</a>
    </form>
  </div>;
}

function Dashboard() {
  return (
  <div>
    <div>Dashboard</div>
    <Drawer position="right" size="50%" usePortal isOpen hasBackdrop transitionDuration={600} title="Test" >
      Wow
    </Drawer>
  </div>
  );
}

function Devices() {
  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Devices</h1>
      </div>
    </div>
  );
}

export default App;
