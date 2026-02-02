import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageSquare,
  HelpCircle,
  Handshake,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with CashGlitch. We're here to help with questions, partnership inquiries, and feedback.",
};

const contactReasons = [
  {
    title: "General Inquiries",
    description: "Questions about our resources, platform, or mission.",
    email: "hello@cashglitch.org",
    icon: MessageSquare,
  },
  {
    title: "Partnership & Advertising",
    description: "Interested in partnering with us or advertising opportunities.",
    email: "partners@cashglitch.org",
    icon: Handshake,
  },
  {
    title: "Computer Program",
    description: "Questions about donating or receiving a computer.",
    email: "computers@cashglitch.org",
    icon: HelpCircle,
  },
  {
    title: "Submit a Resource",
    description: "Know a resource, NPO, or opportunity we should feature?",
    email: "resources@cashglitch.org",
    icon: Mail,
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Contact</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, suggestion, or want to collaborate? We&apos;d love
              to hear from you. Our team typically responds within 24-48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactReasons.map((reason) => (
            <Card key={reason.title} className="p-6 text-center">
              <reason.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {reason.description}
              </p>
              <a
                href={`mailto:${reason.email}`}
                className="text-sm text-primary hover:underline"
              >
                {reason.email}
              </a>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Fill out the form and we&apos;ll get back to you as soon as
              possible. Whether you have a question, feedback, or an idea to
              share, we&apos;re all ears.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Response Time</h4>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24-48 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Based In</h4>
                  <p className="text-sm text-muted-foreground">
                    Atlanta, GA • Serving communities nationwide
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">General Email</h4>
                  <p className="text-sm text-muted-foreground">
                    hello@cashglitch.org
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md border bg-background"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Subject *
                </label>
                <select className="w-full px-4 py-2 rounded-md border bg-background">
                  <option>General Question</option>
                  <option>Partnership Inquiry</option>
                  <option>Computer Donation</option>
                  <option>Computer Request</option>
                  <option>Submit a Resource</option>
                  <option>Report an Issue</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message *
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-md border bg-background h-32"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <Button className="w-full">
                Send Message <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Looking for Quick Answers?
            </h2>
            <p className="text-muted-foreground mb-6">
              Check out our resource pages for common questions about our
              programs and how to get started.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <a href="/get-computer">Computer Program FAQ</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/partner">Partnership Info</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
