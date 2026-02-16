"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import {
  Briefcase,
  ExternalLink,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Laptop,
  Heart,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { PageContent, PageItem } from "@/lib/shared";

const jobBoards = [
  {
    name: "Idealist",
    description: "Jobs at nonprofits and social impact organizations",
    link: "#",
  },
  {
    name: "Work for Good",
    description: "Careers in the social good sector",
    link: "#",
  },
  {
    name: "Diversity Jobs",
    description: "Diversity-focused job board connecting talent with employers",
    link: "#",
  },
  {
    name: "Black Career Network",
    description: "Career opportunities for Black professionals",
    link: "#",
  },
];

export default function JobsPage() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [items, setItems] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, itemsRes] = await Promise.all([
          fetch("/api/page-content?slug=jobs"),
          fetch("/api/page-items?slug=jobs"),
        ]);
        if (contentRes.ok) setPageContent(await contentRes.json());
        if (itemsRes.ok) setItems(await itemsRes.json());
      } catch (error) {
        console.error("Failed to load page data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredJobs = items.filter((item) => item.isFeatured);
  const allJobs = items.filter((item) => !item.isFeatured);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-emerald-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30">
              <Briefcase className="h-3 w-3 mr-1" />{" "}
              {pageContent?.heroBadgeText || "Careers"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageContent?.heroTitle || "Jobs & Career Opportunities"}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageContent?.heroDescription ||
                "Find meaningful employment with organizations committed to equity, diversity, and creating positive change."}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button variant="default" size="sm">
              All Jobs
            </Button>
            <Button variant="outline" size="sm">
              <Laptop className="h-4 w-4 mr-1" />
              Remote
            </Button>
            <Button variant="outline" size="sm">
              <Building className="h-4 w-4 mr-1" />
              On-site
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              Nonprofit
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-4 py-16">
        {featuredJobs.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Featured Positions</h2>
              <p className="text-muted-foreground">
                Top opportunities from mission-driven organizations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="border-2 border-emerald-200 overflow-hidden">
                  {job.imageUrl && (
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image src={job.imageUrl} alt={job.title} fill className="object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {job.category || "Full-time"}
                      </Badge>
                      {job.location === "Remote" && (
                        <Badge variant="outline" className="text-xs">
                          <Laptop className="h-3 w-3 mr-1" />
                          Remote
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="font-medium">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.deadline}
                        </span>
                      )}
                    </div>
                    {job.value && (
                      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <DollarSign className="h-5 w-5" />
                        {job.value}
                      </div>
                    )}
                    {job.website && (
                      <Button className="w-full" asChild>
                        <a
                          href={job.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* All Jobs */}
        {allJobs.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">All Openings</h2>
              <p className="text-muted-foreground">
                Browse all current opportunities
              </p>
            </div>

            <div className="space-y-4 mb-16">
              {allJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {job.imageUrl && (
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image src={job.imageUrl} alt={job.title} fill className="object-cover" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          {job.location === "Remote" && (
                            <Badge variant="outline" className="text-xs">
                              Remote
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                          )}
                          {job.category && <span>{job.category}</span>}
                          {job.deadline && <span>{job.deadline}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {job.value && (
                          <span className="font-medium text-primary">
                            {job.value}
                          </span>
                        )}
                        {job.website && (
                          <Button variant="outline" asChild>
                            <a
                              href={job.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Job Boards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">More Job Resources</h2>
          <p className="text-muted-foreground">
            External job boards with additional opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobBoards.map((board) => (
            <Card
              key={board.name}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">{board.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {board.description}
              </p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href={board.link} target="_blank" rel="noopener noreferrer">
                  Visit Site <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Want to Post a Job?</h2>
            <p className="text-muted-foreground mb-6">
              If your organization is committed to equity and fair wages,
              we&apos;d love to feature your openings.
            </p>
            <Button asChild>
              <Link href="/partner">
                Partner With Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
