import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import type { PageItem } from "@/lib/shared";
import type { ColorScheme } from "./PageHero";

const borderColorMap: Record<ColorScheme, string> = {
  rose:    "border-rose-200",
  emerald: "border-emerald-200",
  sky:     "border-sky-200",
  amber:   "border-amber-200",
  purple:  "border-purple-200",
  blue:    "border-blue-200",
  orange:  "border-orange-200",
  teal:    "border-teal-200",
};

const badgeColorMap: Record<ColorScheme, string> = {
  rose:    "bg-rose-100 text-rose-800",
  emerald: "bg-emerald-100 text-emerald-800",
  sky:     "bg-sky-100 text-sky-800",
  amber:   "bg-amber-100 text-amber-800",
  purple:  "bg-purple-100 text-purple-800",
  blue:    "bg-blue-100 text-blue-800",
  orange:  "bg-orange-100 text-orange-800",
  teal:    "bg-teal-100 text-teal-800",
};

interface ContentCardProps {
  item: PageItem;
  variant?: "featured" | "default";
  colorScheme?: ColorScheme;
  showCategory?: boolean;
  showLocation?: boolean;
  showDeadline?: boolean;
  showValue?: boolean;
  showTags?: boolean;
  showWebsite?: boolean;
  websiteLabel?: string;
}

export function ContentCard({
  item,
  variant = "default",
  colorScheme = "purple",
  showCategory = true,
  showLocation = true,
  showDeadline = true,
  showValue = true,
  showTags = true,
  showWebsite = true,
  websiteLabel = "Visit",
}: ContentCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-lg ${
        isFeatured ? `border-2 ${borderColorMap[colorScheme]}` : ""
      }`}
    >
      {item.imageUrl && (
        <div className="relative w-full h-40 overflow-hidden">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex flex-wrap gap-2">
            {isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            {showCategory && item.category && (
              <Badge className={`w-fit ${isFeatured ? badgeColorMap[colorScheme] : ""}`}>
                {item.category}
              </Badge>
            )}
          </div>
          {showWebsite && item.website && (
            <Button variant="ghost" size="icon" className="flex-shrink-0" asChild>
              <a href={item.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <CardTitle className={isFeatured ? "text-xl" : "text-lg"}>{item.title}</CardTitle>
        <CardDescription className={isFeatured ? "leading-relaxed" : "line-clamp-2"}>
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {showLocation && item.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {item.location}
            </span>
          )}
          {showDeadline && item.deadline && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {item.deadline}
            </span>
          )}
          {showValue && item.value && (
            <span className="flex items-center gap-1 font-medium text-primary">
              {item.value.startsWith("$") || item.value.startsWith("Up to") ? (
                <DollarSign className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              {item.value}
            </span>
          )}
        </div>

        {/* Tags */}
        {showTags && item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(isFeatured ? item.tags : item.tags.slice(0, 3)).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
