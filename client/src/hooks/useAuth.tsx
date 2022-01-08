import axios from "axios";

export default function useAuth() {
  const logout = async () => {
    await axios.post<{ status: "success" }>("/api/v2/users/logout");
    // showToaster("Logged out successfully", "success");
    // setTimeout(() => setIsAuthenticated(false), 1000);
  };

  return { logout };
}
