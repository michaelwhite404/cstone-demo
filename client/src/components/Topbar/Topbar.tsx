import { Icon } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React, { useContext } from "react";
import { UserContext } from "../../App";
import ProfileMenu from "../ProfileMenu";
import "./Topbar.sass";

export default function Topbar() {
  const { user } = useContext(UserContext);
  return (
    <div className="topbar">
      <button className="hamburger-button" type="button">
        <Icon icon="menu" style={{ color: "#999999" }} />
      </button>
      <div className="profile-image-wrapper">
        <Popover2 content={<ProfileMenu />} placement="bottom-start" className="menu-popover">
          <button className="topbar-profile-button">
            <img src={user?.image} alt="Profile" />
          </button>
        </Popover2>
      </div>
    </div>
  );
}
