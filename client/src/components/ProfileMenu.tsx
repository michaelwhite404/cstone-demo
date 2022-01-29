import { Menu, MenuItem } from "@blueprintjs/core";
import { useAuth, useToasterContext } from "../hooks";

export default function ProfileMenu() {
  const { showToaster } = useToasterContext();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout()
      .then(() => showToaster("Logged out successfully", "success"))
      .catch(() => showToaster("There was an error logging out", "danger"));
  };
  return (
    <Menu className="custom-pop">
      <MenuItem text="Log Out" onClick={handleLogout} />
    </Menu>
  );
}
