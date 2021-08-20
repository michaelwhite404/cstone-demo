import "./App.scss";
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from "react-router-dom";
import Students from "./pages/Students/Students";
import DeviceType from "./pages/DeviceType/DeviceType";
import Sidebar from "./components/Sidebar/Sidebar";

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
        <Route exact path="/test" component={Test} />
      </Switch>
    </Router>
  );
}

function Home() {
  return <div>Home</div>;
}

function Dashboard() {
  return <div>Dashboard</div>;
}

function Devices() {
  return <div>Devices</div>;
}

function Textbooks() {
  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Textbooks</h1>
      </div>
    </div>
  );
}

function Test() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-area-container" style={{ backgroundColor: "#f9fcff", width: "100%" }}>
        Main Area
      </div>
    </div>
  );
}

export default App;
