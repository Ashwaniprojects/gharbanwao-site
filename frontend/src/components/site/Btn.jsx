import { ArrowRight } from "lucide-react";

const iconMap = {
  arrow: ArrowRight,
};

export function Btn({
  children,
  variant = "green",
  icon,
  className = "",
  ...props
}) {
  const cls = [
    "btn-animated",
    variant === "yellow" ? "btn-animated--yellow" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const IconComp = icon ? iconMap[icon] || ArrowRight : null;

  return (
    <span className={`${cls} ${className}`.trim()} {...props}>
      {children}
      {IconComp && <IconComp className="arr-icon h-[18px] w-[18px]" strokeWidth={2.5} />}
    </span>
  );
}
