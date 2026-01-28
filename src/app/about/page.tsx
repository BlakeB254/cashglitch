import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  Users,
  Target,
  Globe,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about CashGlitch's mission to create pathways to abundance and opportunity for all.",
};

const values = [
  {
    title: "Abundance Mindset",
    description:
      "We believe there's enough for everyone. Our platform operates from a place of abundance, not scarcity.",
    icon: Sparkles,
  },
  {
    title: "Community First",
    description:
      "Every decision we make prioritizes the needs of our community. We exist to serve, not to profit.",
    icon: Heart,
  },
  {
    title: "Accessibility",
    description:
      "All our resources are free and accessible. No barriers, no gatekeeping—just opportunity.",
    icon: Globe,
  },
  {
    title: "Empowerment",
    description:
      "We don't just provide resources; we empower people with the knowledge and tools to thrive.",
    icon: Target,
  },
];

const milestones = [
  { year: "2024", event: "CashGlitch founded with a mission to organize abundance resources" },
  { year: "2024", event: "Launched computer donation and distribution program" },
  { year: "2024", event: "Partnered with 50+ nonprofit organizations" },
  { year: "2025", event: "Expanded to serve communities nationwide" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Mission is{" "}
              <span className="text-primary">Abundance for All</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CashGlitch was created to be the bridge between opportunity and
              access. We organize and curate resources that help people build
              generational wealth and create lasting change in their lives.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4">
              Our Story
            </Badge>
            <h2 className="text-3xl font-bold mb-6">
              Born from a Simple Observation
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Opportunity exists everywhere—grants, scholarships, free programs,
              reparations initiatives, job opportunities. But finding them
              shouldn't be a full-time job. We noticed that those who needed
              resources most often had the least time to search for them.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              CashGlitch started as a simple idea: what if we organized all
              these scattered opportunities in one place? What if we made it
              easy for people to find exactly what they need to take the next
              step in their journey?
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we're a growing platform that connects thousands of people
              with resources, organizations, and opportunities that create real
              change. And we're just getting started.
            </p>
          </div>
          <Card className="p-8 bg-muted/50">
            <h3 className="text-xl font-bold mb-6">Our Impact So Far</h3>
            <div className="space-y-4">
              {[
                "500+ resources organized and vetted",
                "25,000+ lives impacted through connections",
                "100+ partner organizations",
                "350+ computers distributed to those in need",
                "Growing community of 10,000+ members",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="p-6 text-center">
                <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl font-bold">Growing Together</h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-medium">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Users className="h-3 w-3 mr-1" /> Our Team
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Built by the Community, for the Community
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CashGlitch is powered by a dedicated team of volunteers,
              contributors, and community members who believe in our mission.
            </p>
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground mb-8">
              We're always looking for passionate individuals to join our
              mission. Whether you can contribute time, skills, or resources,
              there's a place for you.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/partner">
                  Join Our Team <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="gradient-hero text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Explore Our Resources?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our curated collection of opportunities, programs, and
            resources designed to help you thrive.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link href="/giveaway">
              Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
