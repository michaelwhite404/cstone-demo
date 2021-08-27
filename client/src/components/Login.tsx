import { useRef } from "react";
import axios from "axios";
import { Toaster } from "@blueprintjs/core";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { useHistory } from "react-router";

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const history = useHistory();
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
      await axios.post("/api/v2/users/google", { token: data.tokenId });
      setIsAuthenticated(true);
      showToaster("Log in successful!", "success");
      setTimeout(() => history.push("/dashboard"), 800);
    } catch (err) {
      showToaster(err.response.data.message, "danger");
    }
  };

  return (
    <>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
        buttonText="Log in with Google"
        onSuccess={handleLogin}
        onFailure={handleLogin}
        cookiePolicy={"single_host_origin"}
      />
      <Toaster position="top-right" ref={toasterRef} />
    </>
  );
}
