import "./PrimaryButton.sass";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string;
  text?: string;
}

export default function PrimaryButton({ children, text, ...props }: PrimaryButtonProps) {
  return (
    <button className="primary-button" {...props}>
      {children || text}
    </button>
  );
}
