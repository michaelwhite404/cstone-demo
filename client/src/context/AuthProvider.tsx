import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { EmployeeModel } from "../../../src/types/models/employeeTypes";

interface AuthContextType {
  user: EmployeeModel | null;
  setUser: React.Dispatch<React.SetStateAction<EmployeeModel | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: (callback?: VoidFunction) => Promise<void>;
  login: (email: string, password: string) => Promise<EmployeeModel>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EmployeeModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchMe();

    async function fetchMe() {
      try {
        const res = await axios.get("/api/v2/users/me");
        setIsAuthenticated(true);
        setUser(res.data.data.user);
      } catch (err) {}
    }
  }, []);

  const logout = async (callback?: VoidFunction) => {
    try {
      await axios.post<{ status: "success" }>("/api/v2/users/logout");
      setIsAuthenticated(false);
      callback && callback();
    } catch (err) {
      throw Error("There was an error. Please try again");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/api/v2/users/login", { email, password });
      setUser(res.data.data.employee);
      setIsAuthenticated(true);
      return res.data.data.employee as EmployeeModel;
    } catch (err) {
      throw Error(err.response.data.message as string);
    }
  };

  const value = { user, isAuthenticated, setIsAuthenticated, logout, login, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
