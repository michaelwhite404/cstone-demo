import { createContext, ReactNode } from "react";
import { AppToaster } from "../components/AppToaster";

interface IToasterContext {
  showToaster: (message: string, intent: "success" | "danger") => void;
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

  return <ToasterContext.Provider value={{ showToaster }}>{children}</ToasterContext.Provider>;
};
