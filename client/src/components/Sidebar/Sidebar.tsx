import { Link } from "react-router-dom";
import ProfileButton from "../ProfileButton";
import navigation from "../../navigation";
import "./Sidebar.sass";

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="logo-wrapper">
            <img className="brand-image" alt="Cornerstone Logo" src="/cstonealttest.png" />
          </div>
          <div className="profile-button-wrapper">
            <ProfileButton
              imgSrc="https://lh3.googleusercontent.com/a/AATXAJwfzVPyqOq3qpphoGTXMNIhNDf1GREai2PAzRCN"
              name="Michael White"
              title="Multi Purpose"
            />
          </div>
          <div className="navigation-wrapper">
            <nav>
              <span className="idkyet">Navigation</span>
              <div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`navigation-item ${item.current ? "current" : ""}`}
                    aria-current="true"
                  >
                    <item.icon className="" aria-hidden="true" />
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
