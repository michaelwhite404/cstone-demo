import { Link, useRouteMatch } from "react-router-dom";
import ProfileButton from "../ProfileButton/ProfileButton";
import navigation from "../../navigation";
import "./Sidebar.sass";
import { useContext } from "react";
import { UserContext } from "../../App";

export default function Sidebar() {
  const match = useRouteMatch();
  const user = useContext(UserContext);
  console.log(user);
  const matchesURL = (url: string) => match.url.startsWith(url);
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="logo-wrapper">
            <img className="brand-image" alt="Cornerstone Logo" src="/cstonealttest.png" />
          </div>
          <div className="profile-button-wrapper">
            {user && <ProfileButton imgSrc={user.image!} name={user.fullName} title={user.title} />}
          </div>
          <div className="navigation-wrapper">
            <nav>
              <span className="idkyet">Navigation</span>
              <div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`navigation-item${matchesURL(item.href) ? " current" : ""}`}
                    aria-current={matchesURL(item.href)}
                  >
                    <item.icon className="" aria-hidden="false" height={20} width={20} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
