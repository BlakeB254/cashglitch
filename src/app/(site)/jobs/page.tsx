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
  Briefcase,
  ExternalLink,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Laptop,
  Heart,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Jobs & Career Opportunities",
  description:
    "Find employment opportunities with organizations committed to equity, diversity, and fair wages.",
  keywords: ["jobs", "career opportunities", "remote work", "equity employers", "fair wages", "diversity hiring", "employment"],
  openGraph: {
    title: "Jobs & Career Opportunities | CashGlitch",
    description: "Find employment opportunities with organizations committed to equity, diversity, and fair wages.",
    images: ["/images/og-image.png"],
  },
};

const jobListings = [
  {
    title: "Community Outreach Coordinator",
    company: "Urban League of Greater Atlanta",
    location: "Atlanta, GA",
    type: "Full-time",
    salary: "$45,000 - $55,000",
    remote: false,
    posted: "2 days ago",
    link: "#",
    featured: true,
  },
  {
    title: "Program Director",
    company: "Black Girls CODE",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    remote: true,
    posted: "1 week ago",
    link: "#",
    featured: true,
  },
  {
    title: "Grant Writer",
    company: "NAACP Legal Defense Fund",
    location: "New York, NY",
    type: "Full-time",
    salary: "$60,000 - $75,000",
    remote: true,
    posted: "3 days ago",
    link: "#",
    featured: true,
  },
  {
    title: "Social Media Manager",
    company: "Color of Change",
    location: "Remote",
    type: "Full-time",
    salary: "$55,000 - $65,000",
    remote: true,
    posted: "5 days ago",
    link: "#",
    featured: false,
  },
  {
    title: "Youth Program Facilitator",
    company: "Boys & Girls Clubs of America",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$20 - $25/hour",
    remote: false,
    posted: "1 day ago",
    link: "#",
    featured: false,
  },
  {
    title: "Development Associate",
    company: "United Negro College Fund",
    location: "Washington, DC",
    type: "Full-time",
    salary: "$50,000 - $60,000",
    remote: false,
    posted: "4 days ago",
    link: "#",
    featured: false,
  },
  {
    title: "Policy Analyst",
    company: "National Urban League",
    location: "New York, NY",
    type: "Full-time",
    salary: "$65,000 - $80,000",
    remote: true,
    posted: "2 weeks ago",
    link: "#",
    featured: false,
  },
  {
    title: "Communications Specialist",
    company: "Equal Justice Initiative",
    location: "Montgomery, AL",
    type: "Full-time",
    salary: "$55,000 - $70,000",
    remote: false,
    posted: "1 week ago",
    link: "#",
    featured: false,
  },
];

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
  const featuredJobs = jobListings.filter((j) => j.featured);
  const allJobs = jobListings.filter((j) => !j.featured);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-emerald-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30">
              <Briefcase className="h-3 w-3 mr-1" /> Careers
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Jobs & Career Opportunities
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Find meaningful employment with organizations committed to equity,
              diversity, and creating positive change. We feature opportunities
              that offer fair wages and purposeful work.
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Featured Positions</h2>
          <p className="text-muted-foreground">
            Top opportunities from mission-driven organizations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {featuredJobs.map((job) => (
            <Card key={job.title} className="border-2 border-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {job.type}
                  </Badge>
                  {job.remote && (
                    <Badge variant="outline" className="text-xs">
                      <Laptop className="h-3 w-3 mr-1" />
                      Remote
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <CardDescription className="font-medium">
                  {job.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.posted}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <DollarSign className="h-5 w-5" />
                  {job.salary}
                </div>
                <Button className="w-full" asChild>
                  <a href={job.link} target="_blank" rel="noopener noreferrer">
                    Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Jobs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">All Openings</h2>
          <p className="text-muted-foreground">
            Browse all current opportunities
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {allJobs.map((job) => (
            <Card
              key={job.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      {job.remote && (
                        <Badge variant="outline" className="text-xs">
                          Remote
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{job.company}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span>{job.type}</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-primary">
                      {job.salary}
                    </span>
                    <Button variant="outline" asChild>
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Boards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">More Job Resources</h2>
          <p className="text-muted-foreground">
            External job boards with additional opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobBoards.map((board) => (
            <Card key={board.name} className="p-6 hover:shadow-lg transition-shadow">
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
            <h2 className="text-2xl font-bold mb-4">
              Want to Post a Job?
            </h2>
            <p className="text-muted-foreground mb-6">
              If your organization is committed to equity and fair wages, we&apos;d
              love to feature your openings.
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
