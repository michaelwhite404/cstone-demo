import { useContext } from "react";
import { Menu, MenuItem } from "@blueprintjs/core";
import { UserContext } from "../App";
import { useAuth, useToasterContext } from "../hooks";

export default function ProfileMenu() {
  const { showToaster } = useToasterContext();
  const { logout } = useAuth();
  const { setIsAuthenticated } = useContext(UserContext);

  const handleLogout = () => {
    logout()
      .then(() => {
        showToaster("Logged out successfully", "success");
        setTimeout(() => setIsAuthenticated(false), 1000);
      })
      .catch(() => showToaster("There was an error logging out", "danger"));
  };
  return (
    <Menu className="custom-pop">
      <MenuItem text="Log Out" onClick={handleLogout} />
    </Menu>
  );
}
