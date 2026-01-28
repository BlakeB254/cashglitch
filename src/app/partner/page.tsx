import { Metadata } from "next";
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
  Handshake,
  Users,
  Megaphone,
  Building,
  Heart,
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Join our mission to create abundance. Partner with CashGlitch to reach a community focused on prosperity and opportunity.",
};

const partnershipTypes = [
  {
    title: "Community Partner",
    description:
      "Join our network of organizations committed to creating pathways to prosperity. Get featured in our directory and reach people actively seeking resources.",
    benefits: [
      "Featured listing in our NPO directory",
      "Cross-promotion on social media",
      "Access to partnership events",
      "Collaboration opportunities",
    ],
    icon: Heart,
    color: "bg-rose-500/10 text-rose-600",
    cta: "Become a Partner",
  },
  {
    title: "Corporate Sponsor",
    description:
      "Align your brand with our mission of abundance and equity. Sponsor programs, events, or specific initiatives that create lasting impact.",
    benefits: [
      "Brand visibility on our platform",
      "Sponsorship recognition",
      "CSR reporting support",
      "Community engagement opportunities",
    ],
    icon: Building,
    color: "bg-violet-500/10 text-violet-600",
    cta: "Explore Sponsorship",
  },
  {
    title: "Advertiser",
    description:
      "Reach our engaged audience of people actively seeking opportunities for advancement. Ethical advertising that serves our community.",
    benefits: [
      "Targeted reach to motivated audience",
      "Banner and sponsored content options",
      "Newsletter placements",
      "Category-specific advertising",
    ],
    icon: Megaphone,
    color: "bg-amber-500/10 text-amber-600",
    cta: "View Ad Options",
  },
];

const stats = [
  { label: "Monthly Visitors", value: "50K+" },
  { label: "Email Subscribers", value: "15K+" },
  { label: "Social Reach", value: "100K+" },
  { label: "Partner Organizations", value: "100+" },
];

const currentPartners = [
  "National Urban League",
  "NAACP",
  "Black Girls CODE",
  "United Negro College Fund",
  "Equal Justice Initiative",
  "Color of Change",
];

export default function PartnerPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-violet-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-violet-500/20 text-violet-700 hover:bg-violet-500/30">
              <Handshake className="h-3 w-3 mr-1" /> Partnership
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Partner With CashGlitch
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join our mission to create pathways to abundance. Whether
              you&apos;re a nonprofit, business, or organization committed to
              equity, there&apos;s a place for you in our community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ways to Partner</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the partnership level that aligns with your goals and
            capacity to create impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {partnershipTypes.map((type) => (
            <Card key={type.title} className="flex flex-col">
              <CardHeader>
                <div
                  className={`p-3 rounded-xl ${type.color} w-fit transition-transform hover:scale-110`}
                >
                  <type.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">{type.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {type.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full">{type.cta}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Partner */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Why Partner
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Reach People Ready for{" "}
                <span className="text-primary">Opportunity</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our audience isn&apos;t just browsing—they&apos;re actively
                seeking resources, opportunities, and organizations that can
                help them build a better future. They&apos;re motivated,
                engaged, and ready to take action.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">High Engagement</h4>
                    <p className="text-sm text-muted-foreground">
                      Average 5+ minutes per session, 3x higher than industry
                      average
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Growing Community</h4>
                    <p className="text-sm text-muted-foreground">
                      40% month-over-month growth in active users
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">National Reach</h4>
                    <p className="text-sm text-muted-foreground">
                      Visitors from all 50 states with strong urban presence
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-6">
                Request Partnership Info
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    placeholder="Your organization"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Partnership Interest
                  </label>
                  <select className="w-full px-4 py-2 rounded-md border bg-background">
                    <option>Community Partner</option>
                    <option>Corporate Sponsor</option>
                    <option>Advertiser</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 rounded-md border bg-background h-24"
                    placeholder="Tell us about your organization and partnership goals..."
                  />
                </div>
                <Button className="w-full">
                  Submit Request <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Organizations We Work With
          </h2>
          <p className="text-muted-foreground">
            Join these leading organizations in our mission
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {currentPartners.map((partner) => (
            <Badge
              key={partner}
              variant="outline"
              className="text-base py-2 px-4"
            >
              {partner}
            </Badge>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Questions About Partnering?
            </h2>
            <p className="text-muted-foreground mb-6">
              Reach out to our partnerships team to discuss how we can work
              together.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:partners@cashglitch.org">
                <Mail className="mr-2 h-4 w-4" />
                partners@cashglitch.org
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
