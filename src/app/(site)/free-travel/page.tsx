"use client";

import {
  Plane,
  Globe,
  GraduationCap,
  Users,
  Briefcase,
  Loader2,
} from "lucide-react";
import { usePageData } from "@/hooks/usePageData";
import { PageHero, ContentCard, SectionHeader, CTASection } from "@/components/shared";

const programTypes = [
  { icon: GraduationCap, label: "Study Abroad" },
  { icon: Globe, label: "Cultural Exchange" },
  { icon: Users, label: "Volunteer Service" },
  { icon: Briefcase, label: "Work Abroad" },
];

export default function FreeTravelPage() {
  const { pageContent, featuredItems, regularItems, loading } = usePageData("free-travel");

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
        title={pageContent?.heroTitle || "See the World for Free"}
        description={
          pageContent?.heroDescription ||
          "Discover travel programs, cultural exchanges, and study abroad opportunities that cover your costs."
        }
        badgeText={pageContent?.heroBadgeText || "Free Travel"}
        badgeIcon={Plane}
        colorScheme="sky"
      />

      {/* Program Types Bar */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {programTypes.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {featuredItems.length > 0 && (
          <>
            <SectionHeader
              title="Featured Programs"
              subtitle="Fully-funded opportunities to travel and learn"
            />
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {featuredItems.map((program) => (
                <ContentCard
                  key={program.id}
                  item={program}
                  variant="featured"
                  colorScheme="sky"
                  websiteLabel="Apply"
                />
              ))}
            </div>
          </>
        )}

        {regularItems.length > 0 && (
          <>
            <SectionHeader
              title="More Opportunities"
              subtitle="Explore additional travel programs"
            />
            <div className="grid md:grid-cols-2 gap-6">
              {regularItems.map((program) => (
                <ContentCard
                  key={program.id}
                  item={program}
                  colorScheme="sky"
                  websiteLabel="Learn More"
                />
              ))}
            </div>
          </>
        )}
      </section>

      <CTASection
        title={pageContent?.ctaTitle || "Ready to Start Your Journey?"}
        description={
          pageContent?.ctaDescription ||
          "Most programs require advance planning. Start your application early and don't miss deadlines."
        }
        buttonText={pageContent?.ctaButtonText || "Browse Sweepstakes"}
        buttonHref={pageContent?.ctaButtonLink || "/sweepstakes"}
      />
    </div>
  );
}
