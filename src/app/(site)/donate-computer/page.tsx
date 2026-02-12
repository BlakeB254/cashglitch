"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  CheckCircle,
  Truck,
  Shield,
  Recycle,
  Heart,
  ArrowRight,
  MapPin,
  Package,
  Loader2,
} from "lucide-react";
import type { PageContent, PageItem } from "@/lib/shared";

const donationProcess = [
  {
    step: 1,
    title: "Submit Your Donation",
    description:
      "Fill out our donation form with details about your device(s). We'll confirm eligibility within 24 hours.",
    icon: Laptop,
  },
  {
    step: 2,
    title: "Data Wiping",
    description:
      "We securely wipe all data from your devices using certified methods. You'll receive a certificate of data destruction.",
    icon: Shield,
  },
  {
    step: 3,
    title: "Refurbishment",
    description:
      "Our technicians clean, repair, and update devices to ensure they're ready for their new owners.",
    icon: Recycle,
  },
  {
    step: 4,
    title: "Distribution",
    description:
      "Devices are matched with community members in need through our application process.",
    icon: Heart,
  },
];

const impactStats = [
  { value: "500+", label: "Computers Donated" },
  { value: "100%", label: "Data Securely Wiped" },
  { value: "350+", label: "Lives Changed" },
  { value: "15", label: "Partner Schools" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Package,
};

export default function DonateComputerPage() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [items, setItems] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, itemsRes] = await Promise.all([
          fetch("/api/page-content?slug=donate-computer"),
          fetch("/api/page-items?slug=donate-computer"),
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
      <section className="bg-orange-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-orange-500/20 text-orange-700 hover:bg-orange-500/30">
              <Laptop className="h-3 w-3 mr-1" />{" "}
              {pageContent?.heroBadgeText || "Give Back"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageContent?.heroTitle || "Donate a Computer"}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageContent?.heroDescription ||
                "Your old laptop or desktop could be someone's gateway to education, employment, and opportunity."}
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
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

      {/* Accepted Devices */}
      {items.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Accept</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We accept working devices that can be refurbished for our
              community members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {items.map((device) => {
              const DeviceIcon =
                (device.category && iconMap[device.category]) || Laptop;
              return (
                <Card key={device.id} className="text-center p-6">
                  <DeviceIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{device.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {device.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Requirements */}
          <Card className="p-8 mb-16">
            <h3 className="text-xl font-bold mb-6">Donation Requirements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-3">We Accept:</h4>
                <ul className="space-y-2">
                  {[
                    "Working laptops and desktops (5 years or newer)",
                    "Tablets in good condition",
                    "Working monitors",
                    "Keyboards and mice",
                    "Power adapters and cables",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-destructive mb-3">
                  We Cannot Accept:
                </h4>
                <ul className="space-y-2">
                  {[
                    "CRT monitors or TVs",
                    "Printers or scanners",
                    "Devices older than 5 years",
                    "Non-working devices",
                    "Devices with broken screens",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-4 w-4 text-center shrink-0">
                        &times;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Process */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simple process ensures your devices are securely handled and
              reach those who need them most.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {donationProcess.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Ready to Donate?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Fill out the form to start your donation. We offer free pickup for
              donations of 5+ devices in select areas, or you can drop off at
              one of our partner locations.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Free Pickup Available</h4>
                  <p className="text-sm text-muted-foreground">
                    For 5+ devices in Atlanta metro area
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Drop-off Locations</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple locations across the city
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Data Security Certificate</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive proof of secure data destruction
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6">Donation Form</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md border bg-background"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-md border bg-background"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Device Type(s)
                </label>
                <select className="w-full px-4 py-2 rounded-md border bg-background">
                  <option>Laptop (1-2 devices)</option>
                  <option>Desktop (1-2 devices)</option>
                  <option>Multiple Devices (3-5)</option>
                  <option>Bulk Donation (5+)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Device Details
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-md border bg-background h-24"
                  placeholder="Tell us about the devices: brand, model, age, condition..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Preferred Method
                </label>
                <select className="w-full px-4 py-2 rounded-md border bg-background">
                  <option>Drop-off at partner location</option>
                  <option>Request pickup (5+ devices)</option>
                  <option>Ship to our facility</option>
                </select>
              </div>
              <Button className="w-full">
                Submit Donation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* CTA for Recipients */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Computer?</h2>
            <p className="text-muted-foreground mb-6">
              If you&apos;re in need of a computer for education, job searching,
              or personal development, we may be able to help.
            </p>
            <Button asChild>
              <Link href="/get-computer">
                Apply for a Free Computer{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
