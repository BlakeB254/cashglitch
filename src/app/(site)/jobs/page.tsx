"use client";

import Link from "next/link";
import {
  Briefcase,
  Laptop,
  Building,
  Heart,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePageData } from "@/hooks/usePageData";
import { PageHero, ContentCard, SectionHeader, CTASection } from "@/components/shared";

const jobBoards = [
  { name: "Idealist", description: "Jobs at nonprofits and social impact organizations", link: "#" },
  { name: "Work for Good", description: "Careers in the social good sector", link: "#" },
  { name: "Diversity Jobs", description: "Diversity-focused job board connecting talent with employers", link: "#" },
  { name: "Black Career Network", description: "Career opportunities for Black professionals", link: "#" },
];

export default function JobsPage() {
  const { pageContent, featuredItems, regularItems, loading } = usePageData("jobs");

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
        title={pageContent?.heroTitle || "Jobs & Career Opportunities"}
        description={
          pageContent?.heroDescription ||
          "Find meaningful employment with organizations committed to equity, diversity, and creating positive change."
        }
        badgeText={pageContent?.heroBadgeText || "Careers"}
        badgeIcon={Briefcase}
        colorScheme="emerald"
      />

      {/* Filter Bar */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button variant="default" size="sm">All Jobs</Button>
            <Button variant="outline" size="sm">
              <Laptop className="h-4 w-4 mr-1" /> Remote
            </Button>
            <Button variant="outline" size="sm">
              <Building className="h-4 w-4 mr-1" /> On-site
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-1" /> Nonprofit
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {featuredItems.length > 0 && (
          <>
            <SectionHeader
              title="Featured Positions"
              subtitle="Top opportunities from mission-driven organizations"
            />
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {featuredItems.map((job) => (
                <ContentCard
                  key={job.id}
                  item={job}
                  variant="featured"
                  colorScheme="emerald"
                  websiteLabel="Apply Now"
                />
              ))}
            </div>
          </>
        )}

        {regularItems.length > 0 && (
          <>
            <SectionHeader
              title="All Openings"
              subtitle="Browse all current opportunities"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {regularItems.map((job) => (
                <ContentCard
                  key={job.id}
                  item={job}
                  colorScheme="emerald"
                  websiteLabel="View"
                />
              ))}
            </div>
          </>
        )}

        {/* Job Boards */}
        <SectionHeader
          title="More Job Resources"
          subtitle="External job boards with additional opportunities"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobBoards.map((board) => (
            <Card key={board.name} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-2">{board.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{board.description}</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href={board.link} target="_blank" rel="noopener noreferrer">
                  Visit Site <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <CTASection
        title={pageContent?.ctaTitle || "Want to Post a Job?"}
        description={
          pageContent?.ctaDescription ||
          "If your organization is committed to equity and fair wages, we'd love to feature your openings."
        }
        buttonText={pageContent?.ctaButtonText || "Partner With Us"}
        buttonHref={pageContent?.ctaButtonLink || "/partner"}
      />
    </div>
  );
}
