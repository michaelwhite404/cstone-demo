import "./Badge.sass";

export type BadgeColor = "green" | "red" | "blue" | "yellow";

export default function Badge({ color, text }: { color: BadgeColor; text: string }) {
  const colors = {
    100: {
      green: "rgba(209, 250, 229, 1)",
      red: "rgba(254, 226, 226, 1)",
      blue: "rgba(219, 234, 254, 1)",
      yellow: "rgba(254, 243, 199, 1)",
    },
    400: {
      green: "rgba(52, 211, 153, 1)",
      red: "rgba(248, 113, 113, 1)",
      blue: "rgba(96, 165, 250, 1)",
      yellow: "rgba(251, 191, 36, 1)",
    },
    800: {
      green: "rgba(6, 95, 70, 1)",
      red: "rgba(153, 27, 27, 1)",
      blue: "rgba(30, 64, 175, 1)",
      yellow: "rgba(146, 64, 14, 1)",
    },
  };

  const getColor = (color: BadgeColor, fontWeight: 100 | 400 | 800) => colors[fontWeight][color];

  return (
    <span
      style={{ color: getColor(color, 800), backgroundColor: getColor(color, 100) }}
      className="badge"
    >
      <svg style={{ color: getColor(color, 400) }} fill="currentColor" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
      {text}
    </span>
  );
}
