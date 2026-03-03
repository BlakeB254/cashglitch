import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

export type ColorScheme = "rose" | "emerald" | "sky" | "amber" | "purple" | "blue" | "orange" | "teal";

export const badgeColorMap: Record<ColorScheme, string> = {
  rose:    "bg-rose-900/40 text-rose-300",
  emerald: "bg-emerald-900/40 text-emerald-300",
  sky:     "bg-sky-900/40 text-sky-300",
  amber:   "bg-amber-900/40 text-amber-300",
  purple:  "bg-purple-900/40 text-purple-300",
  blue:    "bg-blue-900/40 text-blue-300",
  orange:  "bg-orange-900/40 text-orange-300",
  teal:    "bg-teal-900/40 text-teal-300",
};

const colorMap: Record<ColorScheme, { bg: string; badge: string; text: string; hover: string }> = {
  rose:    { bg: "bg-rose-500/15",    badge: "bg-rose-500/25",    text: "text-rose-300",    hover: "hover:bg-rose-500/35" },
  emerald: { bg: "bg-emerald-500/15", badge: "bg-emerald-500/25", text: "text-emerald-300", hover: "hover:bg-emerald-500/35" },
  sky:     { bg: "bg-sky-500/15",     badge: "bg-sky-500/25",     text: "text-sky-300",     hover: "hover:bg-sky-500/35" },
  amber:   { bg: "bg-amber-500/15",   badge: "bg-amber-500/25",   text: "text-amber-300",   hover: "hover:bg-amber-500/35" },
  purple:  { bg: "bg-purple-500/15",  badge: "bg-purple-500/25",  text: "text-purple-300",  hover: "hover:bg-purple-500/35" },
  blue:    { bg: "bg-blue-500/15",    badge: "bg-blue-500/25",    text: "text-blue-300",    hover: "hover:bg-blue-500/35" },
  orange:  { bg: "bg-orange-500/15",  badge: "bg-orange-500/25",  text: "text-orange-300",  hover: "hover:bg-orange-500/35" },
  teal:    { bg: "bg-teal-500/15",    badge: "bg-teal-500/25",    text: "text-teal-300",    hover: "hover:bg-teal-500/35" },
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
