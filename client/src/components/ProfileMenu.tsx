import { useContext } from "react";
import { Menu, MenuItem } from "@blueprintjs/core";
import { UserContext } from "../App";
import { useAuth, useToasterContext } from "../hooks";

export default function ProfileMenu() {
  const { showToaster } = useToasterContext();
  const { logout } = useAuth();
  const { setIsAuthenticated } = useContext(UserContext);

  const handleLogout = async () => {
    await logout().catch(() => showToaster("There was an error logging out", "danger"));
    showToaster("Logged out successfully", "success");
    setTimeout(() => setIsAuthenticated(false), 1000);
  };
  return (
    <Menu className="custom-pop">
      <MenuItem text="Log Out" onClick={handleLogout} />
    </Menu>
  );
}
