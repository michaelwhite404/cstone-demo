import { Button, InputGroup, Label } from "@blueprintjs/core";
import { useState } from "react";
import { EmployeeModel } from "../../../../src/types/models/employeeTypes";
import CornerstoneLogo from "../../components/CornerstoneLogo";
import Login from "../../components/Login";
import { useDocTitle } from "../../hooks";
import "./Home.sass";

export default function Home({
  setIsAuthenticated,
  setUser,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<EmployeeModel | null>>;
}) {
  useDocTitle("Login Page | Cornerstone App");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="home-container">
        <div className="login-main">
          <div>
            <CornerstoneLogo style={{ width: 50 }} />
            <h1 style={{ fontWeight: 600 }}>Welcome Back</h1>
            <p>Please login in to your account</p>
          </div>
          <div>
            <Label>Sign in with Cornestone Gmail Account</Label>
            <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          </div>
          <div>Or continue with</div>
          <div>
            <div style={{ padding: "5px 0" }}>
              <Label>
                <span style={{ fontWeight: 500 }}>Email Address</span>
                <InputGroup fill value={credentials.email} onChange={handleChange} name="email" />
              </Label>
            </div>
            <div style={{ padding: "5px 0" }}>
              <Label>
                <span style={{ fontWeight: 500 }}>Password</span>
                <InputGroup
                  fill
                  value={credentials.password}
                  onChange={handleChange}
                  name="password"
                />
              </Label>
            </div>
            <Button text="Sign In" fill intent="primary" />
          </div>
        </div>
        <div className="login-image-banner" style={{ backgroundImage: "url(Lions+Den_18.jpeg)" }} />
      </div>
    </div>
  );
}
