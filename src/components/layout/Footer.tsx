import Link from "next/link";
import { DollarSign, Heart, Mail, ExternalLink } from "lucide-react";

const footerLinks = {
  resources: [
    { label: "NPO Directory", href: "/npo" },
    { label: "Giveaways", href: "/giveaway" },
    { label: "Free Travel", href: "/free-travel" },
    { label: "Job Board", href: "/jobs" },
  ],
  programs: [
    { label: "Donate a Computer", href: "/donate-computer" },
    { label: "Get a Free Computer", href: "/get-computer" },
    { label: "Partner With Us", href: "/partner" },
  ],
  about: [
    { label: "Our Mission", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-primary/30 bg-[#0f0a1a]/90 backdrop-blur-md mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary glitch-main" />
              <span className="text-xl font-matrix text-glow">
                CASH<span className="text-primary">GLITCH</span>
              </span>
            </Link>
            <p className="text-sm text-primary/60 leading-relaxed font-tech">
              The system is broken. We help you fix the glitches to unlock
              abundance, resources, and opportunities.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary/60">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:hello@cashglitch.org"
                className="hover:text-primary transition-colors font-tech"
              >
                hello@cashglitch.org
              </a>
            </div>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-matrix text-primary mb-4 text-glow">// RESOURCES</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary/60 hover:text-primary transition-colors font-tech"
                  >
                    &gt; {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Column */}
          <div>
            <h3 className="font-matrix text-primary mb-4 text-glow">// PROGRAMS</h3>
            <ul className="space-y-2">
              {footerLinks.programs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary/60 hover:text-primary transition-colors font-tech"
                  >
                    &gt; {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-matrix text-primary mb-4 text-glow">// SYSTEM</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary/60 hover:text-primary transition-colors font-tech"
                  >
                    &gt; {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary/40 font-tech">
            <p>
              &copy; {new Date().getFullYear()} CASHGLITCH.ORG // ALL RIGHTS
              EXPLOITED
            </p>
            <p className="flex items-center gap-1">
              BUILT WITH <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
              FOR THE COMMUNITY
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
