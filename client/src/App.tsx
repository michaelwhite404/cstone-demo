import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Students from "./pages/Students/Students";
import DeviceType from "./pages/DeviceType/DeviceType";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/devices">
          <Devices />
        </Route>
        <Route exact path="/devices/:deviceType" component={DeviceType} />
        <Route exact path="/textbooks" component={Textbooks} />
        <Route exact path="/students" component={Students} />
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
  return <div>Textbooks</div>;
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
