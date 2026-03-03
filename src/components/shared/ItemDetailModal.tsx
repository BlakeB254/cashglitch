"use client";

import { useEffect } from "react";
import { X, ExternalLink, MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PageItem } from "@/lib/shared";
import { getVideoInfo } from "@/lib/video";
import type { ColorScheme } from "./PageHero";

const badgeColorMap: Record<ColorScheme, string> = {
  rose: "bg-rose-100 text-rose-800",
  emerald: "bg-emerald-100 text-emerald-800",
  sky: "bg-sky-100 text-sky-800",
  amber: "bg-amber-100 text-amber-800",
  purple: "bg-purple-100 text-purple-800",
  blue: "bg-blue-100 text-blue-800",
  orange: "bg-orange-100 text-orange-800",
  teal: "bg-teal-100 text-teal-800",
};

interface ItemDetailModalProps {
  item: PageItem;
  colorScheme?: ColorScheme;
  onClose: () => void;
  websiteLabel?: string;
}

export function ItemDetailModal({
  item,
  colorScheme = "purple",
  onClose,
  websiteLabel = "Visit Website",
}: ItemDetailModalProps) {
  const videoInfo = item.videoUrl ? getVideoInfo(item.videoUrl) : null;

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0f0a1a] border border-primary/30 w-full max-w-2xl my-8 rounded-lg overflow-hidden">
        {/* Close button */}
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="p-1 text-primary/60 hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video embed */}
        {videoInfo && (
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={videoInfo.embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {item.isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            {item.category && (
              <Badge className={badgeColorMap[colorScheme]}>
                {item.category}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold">{item.title}</h2>

          {/* Description */}
          {item.description && (
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {item.location}
              </span>
            )}
            {item.deadline && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {item.deadline}
              </span>
            )}
            {item.value && (
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
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Website link */}
          {item.website && (
            <Button variant="outline" asChild className="mt-2">
              <a href={item.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {websiteLabel}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
