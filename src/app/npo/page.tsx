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
  Heart,
  ExternalLink,
  MapPin,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Non-Profit Organizations",
  description:
    "Discover non-profit organizations driving reparations initiatives and creating systemic change in communities across the nation.",
};

const organizations = [
  {
    name: "National African American Reparations Commission",
    description:
      "Working to develop a comprehensive reparations program that addresses the historic and continuing harms of slavery and discrimination.",
    location: "National",
    focus: ["Reparations", "Policy", "Advocacy"],
    website: "#",
    featured: true,
  },
  {
    name: "NAACP",
    description:
      "The nation's largest civil rights organization, working to ensure the political, educational, social, and economic equality of all persons.",
    location: "National",
    focus: ["Civil Rights", "Education", "Voting"],
    website: "#",
    featured: true,
  },
  {
    name: "National Urban League",
    description:
      "Empowering African Americans and other underserved urban residents to enter the economic and social mainstream.",
    location: "National",
    focus: ["Economic Empowerment", "Jobs", "Education"],
    website: "#",
    featured: false,
  },
  {
    name: "Black Lives Matter Global Network",
    description:
      "Building local power and intervening in violence inflicted on Black communities by the state and vigilantes.",
    location: "Global",
    focus: ["Justice", "Community", "Advocacy"],
    website: "#",
    featured: false,
  },
  {
    name: "Thurgood Marshall College Fund",
    description:
      "Supporting and representing nearly 300,000 students attending publicly-supported Historically Black Colleges and Universities.",
    location: "National",
    focus: ["Education", "Scholarships", "HBCUs"],
    website: "#",
    featured: true,
  },
  {
    name: "National Black Child Development Institute",
    description:
      "Improving and advancing the quality of life for Black children and their families through education and advocacy.",
    location: "National",
    focus: ["Children", "Education", "Family"],
    website: "#",
    featured: false,
  },
  {
    name: "Color of Change",
    description:
      "The nation's largest online racial justice organization helping people respond effectively to injustice in the world.",
    location: "National",
    focus: ["Racial Justice", "Digital Advocacy", "Corporate Accountability"],
    website: "#",
    featured: false,
  },
  {
    name: "Equal Justice Initiative",
    description:
      "Committed to ending mass incarceration and excessive punishment, challenging racial and economic injustice.",
    location: "Montgomery, AL",
    focus: ["Criminal Justice", "History", "Racial Justice"],
    website: "#",
    featured: true,
  },
];

export default function NPOPage() {
  const featuredOrgs = organizations.filter((org) => org.featured);
  const allOrgs = organizations.filter((org) => !org.featured);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-rose-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-rose-500/20 text-rose-700 hover:bg-rose-500/30">
              <Heart className="h-3 w-3 mr-1" /> NPO Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Non-Profit Organizations
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover organizations driving reparations initiatives and
              creating systemic change. These nonprofits are at the forefront of
              building a more equitable future for our communities.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Organizations */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Featured Organizations</h2>
          <p className="text-muted-foreground">
            Leading the charge in creating meaningful change
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {featuredOrgs.map((org) => (
            <Card key={org.name} className="border-2 border-rose-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mb-2">
                    Featured
                  </Badge>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <CardTitle className="text-xl">{org.name}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {org.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {org.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {org.focus.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Organizations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">All Organizations</h2>
          <p className="text-muted-foreground">
            Browse our complete directory of nonprofits
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allOrgs.map((org) => (
            <Card key={org.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{org.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {org.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4" />
                  {org.location}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {org.focus.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
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
