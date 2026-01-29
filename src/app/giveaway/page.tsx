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
  Gift,
  ExternalLink,
  Calendar,
  DollarSign,
  GraduationCap,
  Home,
  Briefcase,
  Heart,
  ArrowRight,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Giveaways & Free Resources",
  description:
    "Access free resources, grants, scholarships, and opportunities designed to build generational wealth and prosperity.",
  keywords: ["free grants", "scholarships", "FAFSA", "Pell Grant", "housing assistance", "SNAP benefits", "free money", "financial aid"],
  openGraph: {
    title: "Giveaways & Free Resources | CashGlitch",
    description: "Access free resources, grants, scholarships, and opportunities designed to build generational wealth.",
    images: ["/images/og-image.png"],
  },
};

const categories = [
  { name: "All", icon: Gift, count: 24 },
  { name: "Grants", icon: DollarSign, count: 8 },
  { name: "Scholarships", icon: GraduationCap, count: 6 },
  { name: "Housing", icon: Home, count: 4 },
  { name: "Business", icon: Briefcase, count: 6 },
];

const giveaways = [
  {
    title: "FAFSA - Federal Student Aid",
    description:
      "Apply for free federal student aid including grants, work-study, and loans for college or career school.",
    category: "Scholarships",
    deadline: "Ongoing",
    value: "Up to $7,395/year",
    link: "#",
    featured: true,
  },
  {
    title: "Pell Grant Program",
    description:
      "Federal grant for undergraduate students with exceptional financial need. Does not need to be repaid.",
    category: "Grants",
    deadline: "Ongoing",
    value: "Up to $7,395/year",
    link: "#",
    featured: true,
  },
  {
    title: "Section 8 Housing Choice Voucher",
    description:
      "Federal program helping very low-income families, the elderly, and disabled afford safe housing.",
    category: "Housing",
    deadline: "Waitlist Open",
    value: "Varies by area",
    link: "#",
    featured: false,
  },
  {
    title: "LIHEAP - Energy Assistance",
    description:
      "Help paying heating and cooling bills for low-income households. Also covers weatherization.",
    category: "Housing",
    deadline: "Ongoing",
    value: "Varies",
    link: "#",
    featured: false,
  },
  {
    title: "SBA 8(a) Business Development",
    description:
      "Program helping small disadvantaged businesses compete in the marketplace with training and assistance.",
    category: "Business",
    deadline: "Ongoing",
    value: "Contracts & Training",
    link: "#",
    featured: true,
  },
  {
    title: "Gates Millennium Scholars Program",
    description:
      "Scholarship program for outstanding minority students with significant financial need.",
    category: "Scholarships",
    deadline: "January 2025",
    value: "Full Tuition",
    link: "#",
    featured: true,
  },
  {
    title: "SNAP Benefits (Food Stamps)",
    description:
      "Nutrition assistance for low-income individuals and families to buy food at authorized retailers.",
    category: "Grants",
    deadline: "Ongoing",
    value: "Up to $234/month",
    link: "#",
    featured: false,
  },
  {
    title: "United Negro College Fund Scholarships",
    description:
      "Multiple scholarship programs for African American students attending HBCUs and other institutions.",
    category: "Scholarships",
    deadline: "Various",
    value: "Up to $10,000",
    link: "#",
    featured: false,
  },
  {
    title: "Community Development Block Grants",
    description:
      "Federal funding for community development activities benefiting low and moderate-income persons.",
    category: "Business",
    deadline: "Varies by location",
    value: "Project-based",
    link: "#",
    featured: false,
  },
  {
    title: "Minority Business Development Agency Grants",
    description:
      "Programs supporting the growth and competitiveness of minority-owned businesses.",
    category: "Business",
    deadline: "Rolling",
    value: "Varies",
    link: "#",
    featured: false,
  },
];

export default function GiveawayPage() {
  const featuredGiveaways = giveaways.filter((g) => g.featured);
  const allGiveaways = giveaways.filter((g) => !g.featured);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-amber-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">
              <Gift className="h-3 w-3 mr-1" /> Free Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Giveaways & Opportunities
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Access grants, scholarships, housing assistance, and business
              opportunities designed to create pathways to generational wealth.
              All resources are free to apply.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={cat.name === "All" ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                <cat.icon className="h-4 w-4 mr-1" />
                {cat.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {cat.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Giveaways */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Featured Opportunities</h2>
          <p className="text-muted-foreground">
            High-impact resources with significant value
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {featuredGiveaways.map((giveaway) => (
            <Card key={giveaway.title} className="border-2 border-amber-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className="mb-2 bg-amber-100 text-amber-800">
                    {giveaway.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {giveaway.deadline}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{giveaway.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {giveaway.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <DollarSign className="h-5 w-5" />
                    {giveaway.value}
                  </div>
                  <Button asChild>
                    <a
                      href={giveaway.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Giveaways */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">All Resources</h2>
          <p className="text-muted-foreground">
            Browse our complete list of free opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGiveaways.map((giveaway) => (
            <Card
              key={giveaway.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{giveaway.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {giveaway.deadline}
                  </span>
                </div>
                <CardTitle className="text-lg">{giveaway.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {giveaway.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">
                    {giveaway.value}
                  </span>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a
                      href={giveaway.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Tips for Applying
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Check Deadlines</h3>
                <p className="text-sm text-muted-foreground">
                  Many programs have specific application windows. Mark your
                  calendar.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Be Authentic</h3>
                <p className="text-sm text-muted-foreground">
                  Share your genuine story and needs in your applications.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Gift className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Apply Widely</h3>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t limit yourself. Apply to multiple programs that fit
                  your situation.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
