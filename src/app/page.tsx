"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Gift,
  Plane,
  Briefcase,
  Handshake,
  Laptop,
  Monitor,
  ExternalLink,
} from "lucide-react";

const categories = [
  {
    title: "NPO Directory",
    description: "Non-profit organizations creating systemic change",
    href: "/npo",
    icon: Heart,
  },
  {
    title: "Giveaways",
    description: "Grants, scholarships & free resources",
    href: "/giveaway",
    icon: Gift,
  },
  {
    title: "Free Travel",
    description: "Travel programs & cultural exchanges",
    href: "/free-travel",
    icon: Plane,
  },
  {
    title: "Jobs",
    description: "Career opportunities with equity-focused orgs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Partner",
    description: "Partner or advertise with us",
    href: "/partner",
    icon: Handshake,
  },
  {
    title: "Donate PC",
    description: "Give the gift of technology",
    href: "/donate-computer",
    icon: Laptop,
  },
  {
    title: "Get Free PC",
    description: "Apply for a free computer",
    href: "/get-computer",
    icon: Monitor,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-primary relative overflow-x-hidden">
      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-overlay z-[15] pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center pt-20">
        {/* Logo Section */}
        <div className="mb-12 text-center w-full flex flex-col items-center">
          {/* Glitchy Logo */}
          <div className="relative group cursor-pointer w-full max-w-xs mx-auto h-48 md:h-56 flex items-center justify-center mt-8">
            <div className="relative w-full h-full flex items-center justify-center glitch-image-container">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-full opacity-30 animate-pulse" />
              {/* Main logo */}
              <Image
                alt="Cash Glitch"
                className="w-auto h-full max-h-full object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] glitch-main"
                src="/images/logo-transparent.png"
                width={400}
                height={400}
                priority
              />
              {/* Pink glitch layer */}
              <Image
                alt=""
                className="w-auto h-full max-h-full object-contain absolute inset-0 glitch-red"
                src="/images/logo-transparent.png"
                width={400}
                height={400}
              />
              {/* Cyan glitch layer */}
              <Image
                alt=""
                className="w-auto h-full max-h-full object-contain absolute inset-0 glitch-blue"
                src="/images/logo-transparent.png"
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-8 text-xl md:text-2xl text-primary/80 tracking-widest font-matrix animate-pulse">
            THE SYSTEM IS BROKEN. FIX IT.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="w-full max-w-4xl mb-12">
          <h2 className="text-center text-lg text-primary/60 mb-6 font-tech tracking-wider">
            // ACCESS POINTS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="card-matrix p-4 flex flex-col items-center text-center group"
              >
                <category.icon className="w-8 h-8 mb-3 text-primary/60 group-hover:text-primary transition-colors" />
                <h3 className="text-sm font-tech text-primary mb-1">
                  {category.title}
                </h3>
                <p className="text-xs text-primary/40 hidden md:block">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="w-full max-w-4xl text-xs md:text-sm text-primary/40 font-mono">
          <p>&gt; SYSTEM STATUS: OPERATIONAL</p>
          <p>&gt; ABUNDANCE MATRIX: ACTIVE</p>
          <p>&gt; RESOURCE GLITCH DETECTED IN SECTOR 7G</p>
          <div className="mt-6 flex justify-center">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glitch-text-link inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-lg font-matrix tracking-wider"
            >
              <span className="glitch-text" data-text="JOIN THE MOVEMENT">
                JOIN THE MOVEMENT
              </span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-4 text-center border-t border-primary/20 pt-4">
            © 2025 CASH GLITCH. TAKE THE ABUNDANCE PILL.
          </p>
        </div>
      </main>
    </div>
  );
}
