import { AxiosError } from "axios";
import { createContext, ReactNode } from "react";
import { AppToaster } from "../components/AppToaster";
import { APIError } from "../types/apiResponses";

interface IToasterContext {
  showToaster: (message: string, intent: "success" | "danger") => void;
  showError: (err: AxiosError<APIError>) => void;
}

export const ToasterContext = createContext<IToasterContext>({} as IToasterContext);

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const showToaster = (message: string, intent: "success" | "danger") => {
    AppToaster.show({
      message,
      intent,
      icon: intent === "success" ? "tick" : "cross",
    });
  };

  const showError = (err: AxiosError<APIError>) => {
    AppToaster.show({
      message: err.response!.data.message,
      intent: "danger",
      icon: "cross",
    });
  };
  return (
    <ToasterContext.Provider value={{ showToaster, showError }}>{children}</ToasterContext.Provider>
  );
};
