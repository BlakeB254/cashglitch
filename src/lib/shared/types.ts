// Subscriber/Email types
export interface Subscriber {
  id: number;
  email: string;
  response: "yes" | "no" | null;
  createdAt: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SubscriberRow {
  id: number;
  email: string;
  response: string | null;
  created_at: string;
  ip_address: string;
  user_agent: string;
}

// Auth types
export interface AuthToken {
  id: number;
  email: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface AuthTokenRow {
  id: number;
  email: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface Session {
  id: number;
  email: string;
  sessionToken: string;
  isAdmin: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionRow {
  id: number;
  email: string;
  session_token: string;
  is_admin: boolean;
  expires_at: string;
  created_at: string;
}

// Blog types
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  author_email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostInput {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
}

export interface UpdateBlogPostInput {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
}

// Category types (editable homepage items)
export interface Category {
  id: number;
  title: string;
  description: string | null;
  href: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRow {
  id: number;
  title: string;
  description: string | null;
  href: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  title: string;
  description?: string;
  href: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  title?: string;
  description?: string;
  href?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// Intro screen types (customizable intro sequence)
export type IntroScreenType = "question" | "email" | "info" | "custom";

export interface QuestionOption {
  label: string;
  value: string;
  style: "primary" | "secondary" | "danger";
}

export interface EmailScreenOptions {
  showSkipButton: boolean;
  skipButtonText: string;
}

export interface IntroScreen {
  id: number;
  screenType: IntroScreenType;
  title: string;
  subtitle: string | null;
  options: QuestionOption[] | EmailScreenOptions | Record<string, unknown> | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntroScreenRow {
  id: number;
  screen_type: string;
  title: string;
  subtitle: string | null;
  options: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateIntroScreenInput {
  screenType: IntroScreenType;
  title: string;
  subtitle?: string;
  options?: QuestionOption[] | EmailScreenOptions | Record<string, unknown>;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateIntroScreenInput {
  screenType?: IntroScreenType;
  title?: string;
  subtitle?: string;
  options?: QuestionOption[] | EmailScreenOptions | Record<string, unknown>;
  sortOrder?: number;
  isActive?: boolean;
}

// Site settings types
export interface SiteSetting {
  key: string;
  value: string;
  updatedAt: Date;
}

export interface SiteSettingRow {
  key: string;
  value: string;
  updated_at: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  twitterUrl: string;
  instagramUrl: string;
  featureBlog: boolean;
  featureAccessGate: boolean;
  ogTitle: string;
  ogDescription: string;
  metaKeywords: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Admin dashboard stats
export interface DashboardStats {
  totalSubscribers: number;
  recentSignups: number;
  responseBreakdown: {
    yes: number;
    no: number;
    noResponse: number;
  };
  totalPosts: number;
  publishedPosts: number;
  totalCategories: number;
  activeCategories: number;
}

// Available icons for categories
export const AVAILABLE_ICONS = [
  "Heart",
  "Gift",
  "Trophy",
  "Plane",
  "Briefcase",
  "Handshake",
  "Laptop",
  "Monitor",
  "Home",
  "Users",
  "DollarSign",
  "BookOpen",
  "GraduationCap",
  "Building",
  "Globe",
  "Star",
  "Award",
  "Shield",
  "Zap",
] as const;

export type AvailableIcon = (typeof AVAILABLE_ICONS)[number];

// Page content types (editable page sections)
export interface PageContent {
  id: number;
  pageSlug: string;
  heroTitle: string;
  heroSubtitle: string | null;
  heroDescription: string | null;
  heroBadgeText: string | null;
  ctaTitle: string | null;
  ctaDescription: string | null;
  ctaButtonText: string | null;
  ctaButtonLink: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageContentRow {
  id: number;
  page_slug: string;
  hero_title: string;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_badge_text: string | null;
  cta_title: string | null;
  cta_description: string | null;
  cta_button_text: string | null;
  cta_button_link: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePageContentInput {
  pageSlug: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroBadgeText?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isActive?: boolean;
}

export interface UpdatePageContentInput {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroBadgeText?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isActive?: boolean;
}

// Page items types (list items on each page)
export interface PageItem {
  id: number;
  pageSlug: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  deadline: string | null;
  value: string | null;
  website: string | null;
  tags: string[] | null;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageItemRow {
  id: number;
  page_slug: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  deadline: string | null;
  value: string | null;
  website: string | null;
  tags: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePageItemInput {
  pageSlug: string;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  deadline?: string;
  value?: string;
  website?: string;
  tags?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdatePageItemInput {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  deadline?: string;
  value?: string;
  website?: string;
  tags?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

// Available page slugs
export const PAGE_SLUGS = [
  "npo",
  "sweepstakes",
  "free-travel",
  "jobs",
  "partner",
  "donate-computer",
  "get-computer",
] as const;

export type PageSlug = (typeof PAGE_SLUGS)[number];

export const PAGE_LABELS: Record<PageSlug, string> = {
  "npo": "NPO Directory",
  "sweepstakes": "Sweepstakes",
  "free-travel": "Free Travel",
  "jobs": "Jobs",
  "partner": "Partner",
  "donate-computer": "Donate PC",
  "get-computer": "Get PC",
};
