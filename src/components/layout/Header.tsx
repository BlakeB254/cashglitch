"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  Heart,
  Trophy,
  Handshake,
  Laptop,
  Plane,
  Briefcase,
  Monitor,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { AuthButton } from "@/components/AuthButton";

// Main nav items (shown directly in nav)
const mainNavItems = [
  {
    label: "NPO",
    href: "/npo",
    icon: Heart,
    description: "Non-Profit Organizations",
  },
  {
    label: "Sweepstakes",
    href: "/sweepstakes",
    icon: Trophy,
    description: "Win prizes & raffles",
  },
  {
    label: "Partner",
    href: "/partner",
    icon: Handshake,
    description: "Partner with us",
  },
  {
    label: "Donate PC",
    href: "/donate-computer",
    icon: Laptop,
    description: "Give technology",
  },
];

// Resources dropdown items
const resourceItems = [
  {
    label: "Free Travel",
    href: "/free-travel",
    icon: Plane,
    description: "Travel programs & flight deals",
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
    description: "Career opportunities",
  },
  {
    label: "Get a PC",
    href: "/get-computer",
    icon: Monitor,
    description: "Free computer programs",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-[#0f0a1a]/80 backdrop-blur-md border-b border-primary/30">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/symbol-transparent.png"
            alt="Cash Glitch"
            width={48}
            height={48}
            className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            priority
          />
          <span className="text-lg font-matrix tracking-wider text-glow hidden sm:inline">
            CASH<span className="text-primary">GLITCH</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link flex items-center gap-1.5 px-3 py-2 text-sm text-primary/80 hover:text-primary transition-colors"
            >
              <item.icon className="h-4 w-4" />
              <span className="font-tech">{item.label}</span>
            </Link>
          ))}

          {/* Resources Dropdown - Desktop */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-auto nav-link flex items-center gap-1.5 px-3 py-2 text-sm text-primary/80 hover:text-primary bg-transparent hover:bg-primary/10 data-[state=open]:bg-primary/10 data-[state=open]:text-primary rounded-md">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-tech">Resources</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-[#0f0a1a]/95 backdrop-blur-xl border border-primary/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] rounded-lg">
                  <div className="p-3 w-[240px]">
                    <div className="mb-2 px-2">
                      <span className="text-[10px] font-tech text-primary/40 uppercase tracking-wider">
                        Free Resources
                      </span>
                    </div>
                    <ul className="grid gap-1">
                      {resourceItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="group flex items-center gap-3 px-3 py-2.5 text-sm font-tech rounded-md transition-all hover:bg-gradient-to-r hover:from-primary/10 hover:to-pink-500/10 border border-transparent hover:border-primary/20"
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-primary/90 group-hover:text-primary">
                                  {item.label}
                                </span>
                                <span className="text-[11px] text-primary/40 group-hover:text-primary/50">
                                  {item.description}
                                </span>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-2 flex items-center gap-2">
            <AuthButton />
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-tech text-sm rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              <Heart className="w-4 h-4" />
              <span>DONATE</span>
            </Link>
          </div>
        </nav>

        {/* Mobile Auth + Donate + Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <AuthButton />
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-tech text-xs rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>DONATE</span>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-[#0f0a1a] border-l border-primary/30"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary font-matrix text-glow">
                  <Image
                    src="/images/symbol-transparent.png"
                    alt="Cash Glitch"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                  CASHGLITCH
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-tech text-primary/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary/80" />
                    </div>
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-[11px] text-primary/40">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                ))}

                {/* Resources Section - Mobile */}
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <div className="px-4 mb-2">
                    <span className="text-[10px] font-tech text-primary/40 uppercase tracking-wider">
                      Free Resources
                    </span>
                  </div>
                  <button
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-tech text-primary/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-pink-500/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <span>Resources</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-primary/60 transition-transform duration-200 ${
                        resourcesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Collapsible Resources Items */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      resourcesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-4">
                      {resourceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-tech text-primary/60 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                        >
                          <item.icon className="h-4 w-4" />
                          <div className="flex flex-col">
                            <span>{item.label}</span>
                            <span className="text-[10px] text-primary/30">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
