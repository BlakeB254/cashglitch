"use client";

import { Heart } from "lucide-react";
import { Loader2 } from "lucide-react";
import { usePageData } from "@/hooks/usePageData";
import { PageHero, ContentCard, SectionHeader, CTASection } from "@/components/shared";

export default function NPOPage() {
  const { pageContent, featuredItems, regularItems, loading } = usePageData("npo");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHero
        title={pageContent?.heroTitle || "Non-Profit Organizations"}
        description={
          pageContent?.heroDescription ||
          "Discover organizations driving reparations initiatives and creating systemic change."
        }
        badgeText={pageContent?.heroBadgeText || "NPO Directory"}
        badgeIcon={Heart}
        colorScheme="rose"
      />

      <section className="container mx-auto px-4 py-16">
        {featuredItems.length > 0 && (
          <>
            <SectionHeader
              title="Featured Organizations"
              subtitle="Leading the charge in creating meaningful change"
            />
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {featuredItems.map((org) => (
                <ContentCard
                  key={org.id}
                  item={org}
                  variant="featured"
                  colorScheme="rose"
                  showCategory={false}
                />
              ))}
            </div>
          </>
        )}

        {regularItems.length > 0 && (
          <>
            <SectionHeader
              title="All Organizations"
              subtitle="Browse our complete directory of nonprofits"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularItems.map((org) => (
                <ContentCard
                  key={org.id}
                  item={org}
                  colorScheme="rose"
                  showCategory={false}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <CTASection
        title={pageContent?.ctaTitle || "Know an Organization We Should Feature?"}
        description={
          pageContent?.ctaDescription ||
          "Help us grow our directory by suggesting nonprofits that are making a difference in their communities."
        }
        buttonText={pageContent?.ctaButtonText || "Submit an Organization"}
        buttonHref={pageContent?.ctaButtonLink || "/contact"}
      />
    </div>
  );
}
