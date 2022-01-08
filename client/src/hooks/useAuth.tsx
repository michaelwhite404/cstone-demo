import axios from "axios";

export default function useAuth() {
  const logout = async () => await axios.post<{ status: "success" }>("/api/v2/users/logout");

  return { logout };
}
