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
  Plane,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Globe,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Travel Opportunities",
  description:
    "Explore travel programs, cultural exchanges, and opportunities to see the world at no cost.",
  keywords: ["free travel", "cultural exchange", "study abroad", "travel scholarships", "Fulbright", "Peace Corps", "travel programs"],
  openGraph: {
    title: "Free Travel Opportunities | CashGlitch",
    description: "Explore travel programs, cultural exchanges, and opportunities to see the world at no cost.",
    images: ["/images/og-image.png"],
  },
};

const travelPrograms = [
  {
    title: "Fulbright Program",
    description:
      "The flagship international educational exchange program sponsored by the U.S. government. Offers grants for study, research, and teaching abroad.",
    type: "Educational Exchange",
    destination: "150+ Countries",
    duration: "1 Academic Year",
    eligibility: "U.S. Citizens",
    deadline: "October 2025",
    link: "#",
    featured: true,
  },
  {
    title: "Peace Corps",
    description:
      "Volunteer abroad for 27 months helping communities with education, health, environment, and economic development projects.",
    type: "Volunteer Service",
    destination: "60+ Countries",
    duration: "27 Months",
    eligibility: "U.S. Citizens 18+",
    deadline: "Rolling",
    link: "#",
    featured: true,
  },
  {
    title: "Gilman Scholarship",
    description:
      "Provides scholarships for undergraduate students of limited financial means to study or intern abroad.",
    type: "Study Abroad",
    destination: "Worldwide",
    duration: "Varies",
    eligibility: "Pell Grant Recipients",
    deadline: "March/October",
    link: "#",
    featured: true,
  },
  {
    title: "CIEE Study Abroad Scholarships",
    description:
      "Multiple scholarships for students looking to study abroad including need-based and diversity grants.",
    type: "Study Abroad",
    destination: "40+ Countries",
    duration: "Semester/Year",
    eligibility: "College Students",
    deadline: "Varies",
    link: "#",
    featured: false,
  },
  {
    title: "Congress-Bundestag Youth Exchange",
    description:
      "Year-long exchange program for high school students and young professionals to live and study in Germany.",
    type: "Cultural Exchange",
    destination: "Germany",
    duration: "1 Year",
    eligibility: "Ages 15-24",
    deadline: "December",
    link: "#",
    featured: false,
  },
  {
    title: "NSLI-Y - Youth Language Learning",
    description:
      "Free summer and academic year programs for high school students to learn critical languages abroad.",
    type: "Language Immersion",
    destination: "Various Countries",
    duration: "6 weeks - 1 year",
    eligibility: "High School Students",
    deadline: "November",
    link: "#",
    featured: false,
  },
  {
    title: "AmeriCorps VISTA",
    description:
      "Domestic service program that provides living allowance and education award for community work.",
    type: "Domestic Service",
    destination: "United States",
    duration: "1 Year",
    eligibility: "U.S. Citizens 18+",
    deadline: "Rolling",
    link: "#",
    featured: false,
  },
  {
    title: "Rotary Youth Exchange",
    description:
      "Cultural exchange program for high school students to spend a year living with host families abroad.",
    type: "Cultural Exchange",
    destination: "100+ Countries",
    duration: "1 Year",
    eligibility: "Ages 15-19",
    deadline: "Varies by district",
    link: "#",
    featured: false,
  },
];

export default function FreeTravelPage() {
  const featuredPrograms = travelPrograms.filter((p) => p.featured);
  const allPrograms = travelPrograms.filter((p) => !p.featured);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-sky-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-sky-500/20 text-sky-700 hover:bg-sky-500/30">
              <Plane className="h-3 w-3 mr-1" /> Free Travel
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              See the World for Free
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover travel programs, cultural exchanges, and study abroad
              opportunities that cover your costs. From Fulbright scholarships
              to Peace Corps service, expand your horizons without the financial
              burden.
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Featured Programs</h2>
          <p className="text-muted-foreground">
            Fully-funded opportunities to travel and learn
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {featuredPrograms.map((program) => (
            <Card key={program.title} className="border-2 border-sky-200">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-sky-100 text-sky-800">
                  {program.type}
                </Badge>
                <CardTitle className="text-xl">{program.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{program.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{program.duration}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Eligibility: </span>
                  <span>{program.eligibility}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Deadline: {program.deadline}
                  </Badge>
                  <Button size="sm" asChild>
                    <a
                      href={program.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Programs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">More Opportunities</h2>
          <p className="text-muted-foreground">
            Explore additional travel programs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {allPrograms.map((program) => (
            <Card
              key={program.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{program.type}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {program.destination}
                  </span>
                </div>
                <CardTitle className="text-lg">{program.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {program.eligibility}
                  </span>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a
                      href={program.link}
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
