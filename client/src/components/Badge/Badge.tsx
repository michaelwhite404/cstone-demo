import badgeColors from "./badgeColors";
import BadgeColor from "./BadgeColor";
import "./Badge.sass";

export default function Badge({ color, text }: { color: BadgeColor; text: string }) {
  const getColor = (color: BadgeColor, fontWeight: 100 | 400 | 800) =>
    badgeColors[fontWeight][color];

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
