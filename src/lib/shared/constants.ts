// Session and token configuration
export const AUTH_CONFIG = {
  // Magic link token expires in 15 minutes
  TOKEN_EXPIRY_MINUTES: 15,
  // Session expires in 7 days
  SESSION_EXPIRY_DAYS: 7,
  // Cookie name for session
  SESSION_COOKIE_NAME: "cashglitch_session",
  // Cookie name for access gate
  ACCESS_COOKIE_NAME: "cashglitch_access",
} as const;

// Response options for "Are you ok?" question
export const RESPONSE_OPTIONS = {
  YES: "yes",
  NO: "no",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Site setting keys
export const SETTING_KEYS = {
  SITE_TITLE: "site_title",
  SITE_TAGLINE: "site_tagline",
  TWITTER_URL: "twitter_url",
  INSTAGRAM_URL: "instagram_url",
  FEATURE_BLOG: "feature_blog",
  FEATURE_ACCESS_GATE: "feature_access_gate",
} as const;

// Default site settings
export const DEFAULT_SETTINGS: Record<string, string> = {
  [SETTING_KEYS.SITE_TITLE]: "CashGlitch",
  [SETTING_KEYS.SITE_TAGLINE]: "Organizing a broken system. Let's fix it.",
  [SETTING_KEYS.TWITTER_URL]: "https://twitter.com/cashglitch",
  [SETTING_KEYS.INSTAGRAM_URL]: "",
  [SETTING_KEYS.FEATURE_BLOG]: "true",
  [SETTING_KEYS.FEATURE_ACCESS_GATE]: "true",
};

// Admin routes that require authentication
export const ADMIN_ROUTES = ["/admin", "/admin/subscribers", "/admin/blog", "/admin/settings"];

// Public routes that don't need access gate
export const PUBLIC_ROUTES = ["/login", "/verify", "/api"];

// Stripe donation configuration
export const STRIPE_CONFIG = {
  MIN_DONATION_CENTS: 100, // Minimum $1
  DEFAULT_DONATION_CENTS: 2500, // Default $25
  CURRENCY: "usd",
} as const;

