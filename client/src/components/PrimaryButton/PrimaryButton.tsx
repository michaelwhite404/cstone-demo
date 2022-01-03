import "./PrimaryButton.sass";

interface PrimaryButtonProps {
  children?: string;
  text?: string;
}

export default function PrimaryButton({ children, text }: PrimaryButtonProps) {
  return (
    <button type="button" className="primary-button">
      {children || text}
    </button>
  );
}
