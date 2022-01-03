interface PrimaryButtonProps {
  children: string;
  text: string;
}

export default function PrimaryButton({children, text}: PrimaryButtonProps) {
  return <button type="button" className="" style={{ backgroundColor: "#3b82f6" }}>{children || text}</button>;
}
