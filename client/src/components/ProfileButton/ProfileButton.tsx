import React from "react";
import { SelectorIcon } from "@heroicons/react/solid";
import "./ProfileButton.sass";

interface ProfileButtonProps {
  imgSrc: string;
  name: string;
  title: string;
}

export default function ProfileButton({ imgSrc, name, title }: ProfileButtonProps) {
  return (
    <button className="profile-button">
      <span className="profile-button-inner">
        <span className="profile-button-content">
          <img src={imgSrc} alt="Profile" />
          <span className="profile-button-text">
            <span>{name}</span>
            <span>{title}</span>
          </span>
        </span>
        <SelectorIcon color="gray" width={20} />
      </span>
    </button>
  );
}
