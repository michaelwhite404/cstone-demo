import React from "react";
import { SelectorIcon } from "@heroicons/react/solid";
import { Popover2 } from "@blueprintjs/popover2";
import { Menu, MenuItem } from "@blueprintjs/core";
import "./ProfileButton.sass";
import { useAuth, useToasterContext } from "../../hooks";

interface ProfileButtonProps {
  imgSrc: string;
  name: string;
  title: string;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileButton({
  imgSrc,
  name,
  title,
  setIsAuthenticated,
}: ProfileButtonProps) {
  const { showToaster } = useToasterContext();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout().catch(() => showToaster("There was an error logging out", "danger"));
    showToaster("Logged out successfully", "success");
    setTimeout(() => setIsAuthenticated(false), 1000);
  };
  const ProfileMenu = (
    <Menu className="custom-pop">
      <MenuItem text="Log Out" onClick={handleLogout} />
    </Menu>
  );

  return (
    <Popover2 content={ProfileMenu} placement="bottom" className="menu-popover">
      <button className="profile-button">
        <span className="profile-button-inner">
          <span className="profile-button-content">
            <img src={imgSrc} alt="Profile" />
            <span className="profile-button-text">
              <div className="profile-name">{name}</div>
              <span>{title}</span>
            </span>
          </span>
          <SelectorIcon color="gray" width={20} />
        </span>
      </button>
    </Popover2>
  );
}
