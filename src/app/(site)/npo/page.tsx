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
  Heart,
  ExternalLink,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { PageContent, PageItem } from "@/lib/shared";

export default function NPOPage() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [items, setItems] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, itemsRes] = await Promise.all([
          fetch("/api/page-content?slug=npo"),
          fetch("/api/page-items?slug=npo"),
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

  const featuredOrgs = items.filter((item) => item.isFeatured);
  const allOrgs = items.filter((item) => !item.isFeatured);

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
      <section className="bg-rose-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-rose-500/20 text-rose-700 hover:bg-rose-500/30">
              <Heart className="h-3 w-3 mr-1" />{" "}
              {pageContent?.heroBadgeText || "NPO Directory"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageContent?.heroTitle || "Non-Profit Organizations"}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageContent?.heroDescription ||
                "Discover organizations driving reparations initiatives and creating systemic change."}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Organizations */}
      <section className="container mx-auto px-4 py-16">
        {featuredOrgs.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Featured Organizations
              </h2>
              <p className="text-muted-foreground">
                Leading the charge in creating meaningful change
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {featuredOrgs.map((org) => (
                <Card key={org.id} className="border-2 border-rose-200 overflow-hidden">
                  {org.imageUrl && (
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image src={org.imageUrl} alt={org.title} fill className="object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="mb-2">
                        Featured
                      </Badge>
                      {org.website && (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-xl">{org.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {org.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {org.location && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {org.location}
                        </span>
                      </div>
                    )}
                    {org.tags && org.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {org.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* All Organizations */}
        {allOrgs.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">All Organizations</h2>
              <p className="text-muted-foreground">
                Browse our complete directory of nonprofits
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allOrgs.map((org) => (
                <Card
                  key={org.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {org.imageUrl && (
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image src={org.imageUrl} alt={org.title} fill className="object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{org.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {org.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {org.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        {org.location}
                      </div>
                    )}
                    {org.tags && org.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {org.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {org.website && (
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website{" "}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
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
              Know an Organization We Should Feature?
            </h2>
            <p className="text-muted-foreground mb-6">
              Help us grow our directory by suggesting nonprofits that are
              making a difference in their communities.
            </p>
            <Button asChild>
              <Link href="/contact">
                Submit an Organization <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
