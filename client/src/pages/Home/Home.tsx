import { useState } from "react";
import Div100vh from "react-div-100vh";
import LabeledInput2 from "../../components/LabeledInput2";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import TextOverLine from "../../components/TextOverLine";
import { useAuth, useDocTitle, useToasterContext } from "../../hooks";
import "./Home.sass";

export default function Home() {
  useDocTitle("Login Page | School App");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { showToaster } = useToasterContext();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(credentials.email, credentials.password)
      .then(() => showToaster("Log in successful!", "success"))
      .catch((err) => showToaster(err.message, "danger"));
  };

  return (
    <div>
      <Div100vh className="home-container">
        <div className="login-main">
          <div className="welcome-section">
            <img style={{ width: 50 }} src="/paw.png" alt="Paw Logo" />
            <h1 style={{ fontWeight: 600, margin: "5px 0" }}>Welcome Back!!</h1>
            <p>Sign into your account</p>
          </div>
          <div className="sign-in-form">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 pb-1.5">
                <LabeledInput2
                  label="Email Address"
                  value={credentials.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div className="mb-4 pb-1.5">
                <LabeledInput2
                  label="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  required
                />
              </div>
              <PrimaryButton text="Sign In" type="submit" fill />
            </form>
          </div>
          <span style={{ padding: "1rem 0" }}>
            <TextOverLine text="OR" />
          </span>
          <div>
            <button
              type="button"
              className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-1.5 text-base font-medium text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Credentials
            </button>
          </div>
        </div>
        <div
          className="login-image-banner"
          style={{ backgroundImage: "url(/Lions+Den_18.jpeg)" }}
        />
      </Div100vh>
    </div>
  );
}
