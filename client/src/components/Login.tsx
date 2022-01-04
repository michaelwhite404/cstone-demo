import { useRef } from "react";
import axios from "axios";
import { Toaster } from "@blueprintjs/core";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { EmployeeModel } from "../../../src/types/models/employeeTypes";

export default function Login({
  setIsAuthenticated,
  setUser,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<EmployeeModel | null>>;
}) {
  const toasterRef = useRef<Toaster>(null);
  const showToaster = (message: string, intent: "success" | "danger") => {
    toasterRef.current!.show({
      message,
      intent,
      icon: intent === "success" ? "tick" : "cross",
    });
  };

  const handleLogin = async (
    googleData: GoogleLoginResponse | GoogleLoginResponseOffline
  ): Promise<void> => {
    const data = googleData as GoogleLoginResponse;
    // @ts-ignore
    if (data.error === "popup_closed_by_user") return;
    try {
      const res = await axios.post("/api/v2/users/google", { token: data.tokenId });
      setUser(res.data.data.employee);
      showToaster("Log in successful!", "success");
      setTimeout(() => setIsAuthenticated(true), 1250);
    } catch (err) {
      console.log(err);
      showToaster(err.response.data.message, "danger");
    }
  };
  const CustomButton = (props: { onClick: () => void; disabled?: boolean }) => (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        backgroundColor: "white",
        outline: "none",
        border: "none",
        boxShadow: "#898989 0px 0px 3px 0px",
        padding: "0.625rem 1rem",
        borderRadius: 5,
        cursor: "pointer",
        width: "100%",
        //@ts-ignore
        "&:hover": {
          backgroundColor: "red",
        },
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="google_icon_gray.png" alt="Google Logo" style={{ width: 20, marginRight: 15 }} />
        <span style={{ color: "#999999", fontWeight: 500 }}>Sign in with Google</span>
      </span>
    </button>
  );

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
      buttonText="Log in with Google"
      render={CustomButton}
      onSuccess={handleLogin}
      onFailure={handleLogin}
      cookiePolicy={"single_host_origin"}
    />
  );
}
