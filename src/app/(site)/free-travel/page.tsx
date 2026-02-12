"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Plane,
  ExternalLink,
  MapPin,
  Calendar,
  Globe,
  GraduationCap,
  Users,
  Briefcase,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { PageContent, PageItem } from "@/lib/shared";

export default function FreeTravelPage() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [items, setItems] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, itemsRes] = await Promise.all([
          fetch("/api/page-content?slug=free-travel"),
          fetch("/api/page-items?slug=free-travel"),
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

  const featuredPrograms = items.filter((item) => item.isFeatured);
  const allPrograms = items.filter((item) => !item.isFeatured);

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
      <section className="bg-sky-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-sky-500/20 text-sky-700 hover:bg-sky-500/30">
              <Plane className="h-3 w-3 mr-1" />{" "}
              {pageContent?.heroBadgeText || "Free Travel"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageContent?.heroTitle || "See the World for Free"}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageContent?.heroDescription ||
                "Discover travel programs, cultural exchanges, and study abroad opportunities that cover your costs."}
            </p>
          </div>
        </div>
      </section>

      {/* Program Types */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Study Abroad</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-primary" />
              <span>Cultural Exchange</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Volunteer Service</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>Work Abroad</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="container mx-auto px-4 py-16">
        {featuredPrograms.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Featured Programs</h2>
              <p className="text-muted-foreground">
                Fully-funded opportunities to travel and learn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {featuredPrograms.map((program) => (
                <Card key={program.id} className="border-2 border-sky-200">
                  <CardHeader>
                    {program.category && (
                      <Badge className="w-fit mb-2 bg-sky-100 text-sky-800">
                        {program.category}
                      </Badge>
                    )}
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {program.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{program.location}</span>
                        </div>
                      )}
                      {program.value && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{program.value}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {program.deadline && (
                        <Badge variant="outline" className="text-xs">
                          Deadline: {program.deadline}
                        </Badge>
                      )}
                      {program.website && (
                        <Button size="sm" asChild>
                          <a
                            href={program.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* All Programs */}
        {allPrograms.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">More Opportunities</h2>
              <p className="text-muted-foreground">
                Explore additional travel programs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {allPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {program.category && (
                        <Badge variant="outline">{program.category}</Badge>
                      )}
                      {program.location && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {program.location}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      {program.deadline && (
                        <span className="text-muted-foreground">
                          Deadline: {program.deadline}
                        </span>
                      )}
                      {program.website && (
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a
                            href={program.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Learn More{" "}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-6">
              Most programs require advance planning. Start your application
              early and don&apos;t miss deadlines.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/sweepstakes">
                  Browse Sweepstakes{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
