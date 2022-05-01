import classNames from "classnames";
import { ReactNode } from "react";
import "./PrimaryButton.sass";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  text?: string;
  fill?: boolean;
}

export default function PrimaryButton({ children, text, fill, ...props }: PrimaryButtonProps) {
  return (
    <button className={classNames("primary-button", { "primary-button-fill": fill })} {...props}>
      {children || text}
    </button>
  );
}
