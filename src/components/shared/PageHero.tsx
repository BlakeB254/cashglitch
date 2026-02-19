import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

export type ColorScheme = "rose" | "emerald" | "sky" | "amber" | "purple" | "blue" | "orange" | "teal";

const colorMap: Record<ColorScheme, { bg: string; badge: string; text: string; hover: string }> = {
  rose:    { bg: "bg-rose-500/10",    badge: "bg-rose-500/20",    text: "text-rose-700",    hover: "hover:bg-rose-500/30" },
  emerald: { bg: "bg-emerald-500/10", badge: "bg-emerald-500/20", text: "text-emerald-700", hover: "hover:bg-emerald-500/30" },
  sky:     { bg: "bg-sky-500/10",     badge: "bg-sky-500/20",     text: "text-sky-700",     hover: "hover:bg-sky-500/30" },
  amber:   { bg: "bg-amber-500/10",   badge: "bg-amber-500/20",   text: "text-amber-700",   hover: "hover:bg-amber-500/30" },
  purple:  { bg: "bg-purple-500/10",  badge: "bg-purple-500/20",  text: "text-purple-700",  hover: "hover:bg-purple-500/30" },
  blue:    { bg: "bg-blue-500/10",    badge: "bg-blue-500/20",    text: "text-blue-700",    hover: "hover:bg-blue-500/30" },
  orange:  { bg: "bg-orange-500/10",  badge: "bg-orange-500/20",  text: "text-orange-700",  hover: "hover:bg-orange-500/30" },
  teal:    { bg: "bg-teal-500/10",    badge: "bg-teal-500/20",    text: "text-teal-700",    hover: "hover:bg-teal-500/30" },
};

interface PageHeroProps {
  title: string;
  description: string;
  badgeText: string;
  badgeIcon: LucideIcon;
  colorScheme: ColorScheme;
}

export function PageHero({ title, description, badgeText, badgeIcon: Icon, colorScheme }: PageHeroProps) {
  const colors = colorMap[colorScheme];

  return (
    <section className={`${colors.bg} border-b`}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <Badge className={`mb-4 ${colors.badge} ${colors.text} ${colors.hover}`}>
            <Icon className="h-3 w-3 mr-1" /> {badgeText}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </section>
  );
}
