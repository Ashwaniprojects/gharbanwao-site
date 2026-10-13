import { Mascot } from "page-mascot";

export function BuilderMascot({ size = 80, className = "", label = "Builder" }) {
  return (
    <Mascot
      directions="/mascots/builder-directions.webp"
      reactions="/mascots/builder-reactions.webp"
      size={size}
      className={className}
      label={label}
    />
  );
}
