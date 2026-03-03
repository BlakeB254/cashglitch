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
import { ExternalLink, MapPin, Clock, Play } from "lucide-react";
import type { PageItem } from "@/lib/shared";
import { getVideoThumbnail } from "@/lib/video";
import { type ColorScheme, badgeColorMap } from "./PageHero";
import { ValueIcon } from "./ValueIcon";

const borderColorMap: Record<ColorScheme, string> = {
  rose:    "border-rose-500/50",
  emerald: "border-emerald-500/50",
  sky:     "border-sky-500/50",
  amber:   "border-amber-500/50",
  purple:  "border-purple-500/50",
  blue:    "border-blue-500/50",
  orange:  "border-orange-500/50",
  teal:    "border-teal-500/50",
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
  onClick?: () => void;
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
  onClick,
}: ContentCardProps) {
  const isFeatured = variant === "featured";
  const hasVideo = !!item.videoUrl;
  const thumbnailUrl = getVideoThumbnail(item.videoUrl, item.imageUrl) || item.imageUrl;
  const showThumbnail = thumbnailUrl || hasVideo;

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 bg-background border-primary/20 ${
        isFeatured ? `border-2 ${borderColorMap[colorScheme]}` : ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {showThumbnail && (
        <div className="relative w-full h-40 overflow-hidden">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}
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
              <ValueIcon value={item.value} />
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
