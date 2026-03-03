export type VideoPlatform = "youtube" | "vimeo" | "facebook" | "instagram";

export interface VideoInfo {
  platform: VideoPlatform;
  videoId: string;
  thumbnailUrl: string | null;
  embedUrl: string;
}

/**
 * Parse a video URL and return platform info, thumbnail URL, and embed URL.
 * Returns null if the URL is not a recognized video platform.
 */
export function getVideoInfo(url: string): VideoInfo | null {
  if (!url) return null;

  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    return {
      platform: "youtube",
      videoId: ytMatch[1],
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return {
      platform: "vimeo",
      videoId: vimeoMatch[1],
      thumbnailUrl: null, // Vimeo thumbnails require oEmbed API call
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Facebook: facebook.com/*/videos/ID, fb.watch/ID
  const fbMatch = url.match(
    /(?:facebook\.com|fb\.watch)/
  );
  if (fbMatch) {
    return {
      platform: "facebook",
      videoId: "",
      thumbnailUrl: null,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
    };
  }

  // Instagram: instagram.com/reel/CODE, instagram.com/p/CODE, instagram.com/tv/CODE
  const igMatch = url.match(
    /instagram\.com\/(?:reel|p|tv)\/([\w-]+)/
  );
  if (igMatch) {
    return {
      platform: "instagram",
      videoId: igMatch[1],
      thumbnailUrl: null,
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
    };
  }

  return null;
}

/**
 * Get the thumbnail URL for a video, with fallback to the item's image.
 */
export function getVideoThumbnail(
  videoUrl: string | null,
  fallbackImageUrl: string | null
): string | null {
  if (!videoUrl) return null;
  const info = getVideoInfo(videoUrl);
  if (!info) return null;
  return info.thumbnailUrl || fallbackImageUrl || null;
}
