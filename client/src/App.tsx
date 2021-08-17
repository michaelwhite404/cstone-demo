import "./App.scss";
import "./test.sass";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Students from "./pages/Students/Students";
import DeviceType from "./pages/DeviceType/DeviceType";
import ProfileButton from "./components/ProfileButton";

function App() {
  return (
    <Router>
      {/* <header className="App-header">Welcome to the Cornerstone App</header>
    <br />
    <ProfileButton
      imgSrc="https://lh3.google.com/u/2/ogw/ADea4I4RFSRQOD1HWLtwJOJmh8FdJvzy6Nmry3z-apgL=s32-c-mo"
      name="Michael White"
      title="Multi Purpose"
    /> */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/devices">
          <Devices />
        </Route>
        <Route exact path="/devices/:deviceType" component={DeviceType} />
        <Route exact path="/textbooks">
          <Textbooks />
        </Route>
        <Route exact path="/students">
          <Students />
        </Route>
        <Route exact path="/test">
          <Test />
        </Route>
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
      <div className="sidebar-container">
        <div className="sidebar">
          <div className="sidebar-inner">
            <div className="logo-wrapper">
              <img className="brand-image" alt="Cornerstone Logo" src="/cstonealttest.png" />
            </div>
            <div className="profile-button-wrapper">
              <ProfileButton
                imgSrc="https://lh3.google.com/u/2/ogw/ADea4I4RFSRQOD1HWLtwJOJmh8FdJvzy6Nmry3z-apgL=s32-c-mo"
                name="Michael White"
                title="Multi Purpose"
              />
            </div>
          </div>
        </div>
      </div>
      <div>Test 2</div>
    </div>
  );
}

export default App;
