import { Beef, Egg, Fish, Ham, Sprout, Wheat, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  egg: Egg,
  cattle: Beef,
  pig: Ham,
  fish: Fish,
  sprout: Sprout,
  feedbag: Wheat,
};

export function CategoryIcon({
  icon,
  size = 18,
  className,
}: {
  icon: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICON_MAP[icon] ?? Sprout;
  return <Icon size={size} className={className} />;
}

export function getCategoryIcon(icon: string): LucideIcon {
  return ICON_MAP[icon] ?? Sprout;
}
