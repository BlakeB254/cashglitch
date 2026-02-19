"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Users,
  Heart,
  ArrowRight,
  FileText,
  Clock,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { usePageData } from "@/hooks/usePageData";
import { PageHero } from "@/components/shared";

const applicationSteps = [
  {
    step: 1,
    title: "Submit Application",
    description:
      "Fill out our online form with your information and how you'll use the computer.",
  },
  {
    step: 2,
    title: "Review Process",
    description:
      "Our team reviews applications weekly and prioritizes based on need and availability.",
  },
  {
    step: 3,
    title: "Approval Notification",
    description:
      "You'll receive an email if approved, with pickup/delivery instructions.",
  },
  {
    step: 4,
    title: "Receive Your Computer",
    description:
      "Pick up your refurbished computer or receive it by mail. Includes basic setup guide.",
  },
];

const faqs = [
  {
    question: "Who is eligible to receive a free computer?",
    answer:
      "Students, job seekers, low-income families, and qualifying nonprofit workers are all eligible. We prioritize based on demonstrated need and how the computer will be used.",
  },
  {
    question: "What kind of computers do you provide?",
    answer:
      "We provide refurbished laptops and desktops that are 5 years old or newer. All computers are wiped, updated, and tested before distribution.",
  },
  {
    question: "How long does the application process take?",
    answer:
      "Applications are reviewed weekly. Most applicants hear back within 2-3 weeks, depending on availability of devices.",
  },
  {
    question: "Is there any cost involved?",
    answer:
      "No. The computers are completely free. However, we do ask that you pay it forward by helping others in your community when you can.",
  },
  {
    question: "What if my computer needs repairs later?",
    answer:
      "We offer limited support for the first 90 days after receiving your computer. After that, we can recommend affordable repair options.",
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Briefcase,
  Users,
  Heart,
};

export default function GetComputerPage() {
  const { pageContent, items, loading } = usePageData("get-computer");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHero
        title={pageContent?.heroTitle || "Get a Free Computer"}
        description={pageContent?.heroDescription || "Technology should never be a barrier to opportunity. If you need a computer for school, work, or personal development, we may be able to help."}
        badgeText={pageContent?.heroBadgeText || "Apply Now"}
        badgeIcon={Monitor}
        colorScheme="teal"
      />

      {/* Eligibility */}
      {items.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Who Can Apply</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We prioritize those with the greatest need and clear purpose for
              using the technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {items.map((criteria) => {
              const CriteriaIcon =
                (criteria.category && iconMap[criteria.category]) || Heart;
              return (
                <Card key={criteria.id} className="text-center p-6 overflow-hidden">
                  {criteria.imageUrl && (
                    <div className="relative w-full h-40 overflow-hidden -mx-6 -mt-6 mb-4">
                      <Image src={criteria.imageUrl} alt={criteria.title} fill className="object-cover" />
                    </div>
                  )}
                  <CriteriaIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{criteria.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {criteria.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 bg-muted/50">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">
                  Additional Considerations
                </h4>
                <p className="text-sm text-muted-foreground">
                  Priority is given to applicants who don&apos;t currently have
                  access to a working computer, have a specific educational or
                  employment goal, and can demonstrate financial need. We welcome
                  applications from all backgrounds.
                </p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Application Process */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Application Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simple four-step process gets computers to those who need them
              quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {applicationSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  {step.step}
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

      {/* Application Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Apply Now</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Complete the application below. Be as detailed as possible about
              your situation and how you&apos;ll use the computer—this helps us
              prioritize applications.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Response Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Most applications reviewed within 2-3 weeks
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">No Documents Required</h4>
                  <p className="text-sm text-muted-foreground">
                    We trust your application. No income verification needed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Quality Devices</h4>
                  <p className="text-sm text-muted-foreground">
                    All computers tested and ready for immediate use
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6">Application Form</h3>
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
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-md border bg-background"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  I am a... *
                </label>
                <select className="w-full px-4 py-2 rounded-md border bg-background">
                  <option>Student (K-12)</option>
                  <option>Student (College/University)</option>
                  <option>Job Seeker</option>
                  <option>Parent/Guardian applying for child</option>
                  <option>Nonprofit Worker</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Do you currently have a working computer? *
                </label>
                <select className="w-full px-4 py-2 rounded-md border bg-background">
                  <option>No, I don&apos;t have any computer access</option>
                  <option>I share a computer with others</option>
                  <option>I have limited access (library, etc.)</option>
                  <option>
                    I have a computer but it&apos;s not working
                  </option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Preferred Device Type
                </label>
                <select className="w-full px-4 py-2 rounded-md border bg-background">
                  <option>Laptop (preferred)</option>
                  <option>Desktop</option>
                  <option>Either is fine</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  How will you use this computer? *
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-md border bg-background h-24"
                  placeholder="Tell us about your goals and how having a computer will help you achieve them..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Anything else you&apos;d like us to know?
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-md border bg-background h-20"
                  placeholder="Optional: Share any additional context about your situation..."
                />
              </div>
              <Button className="w-full">
                Submit Application <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.question} className="p-6">
                  <h4 className="font-semibold flex items-start gap-2 mb-2">
                    <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground text-sm pl-7">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="gradient-emerald text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Have a Computer to Donate?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Help us expand our program by donating your used laptops, desktops,
            and tablets.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link href="/donate-computer">Donate a Computer</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
