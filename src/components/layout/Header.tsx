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
  Menu,
  Heart,
  Gift,
  Plane,
  Briefcase,
  Handshake,
  Laptop,
  Monitor,
  DollarSign,
  X,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  {
    label: "NPO",
    href: "/npo",
    icon: Heart,
    description: "Non-Profit Organizations",
  },
  {
    label: "Giveaway",
    href: "/giveaway",
    icon: Gift,
    description: "Free resources",
  },
  {
    label: "Free Travel",
    href: "/free-travel",
    icon: Plane,
    description: "Travel programs",
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
    description: "Career opportunities",
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
  {
    label: "Get PC",
    href: "/get-computer",
    icon: Monitor,
    description: "Free computer",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-primary/30">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
            <DollarSign className="w-8 h-8 text-primary glitch-main" />
          </div>
          <span className="text-lg font-matrix tracking-wider text-glow">
            CASH<span className="text-primary">GLITCH</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link flex items-center gap-1.5 px-3 py-2 text-sm text-primary/80 hover:text-primary transition-colors"
            >
              <item.icon className="h-4 w-4" />
              <span className="font-tech">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 bg-black border-l border-primary/30"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-primary font-matrix text-glow">
                <DollarSign className="h-5 w-5" />
                CASHGLITCH
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-tech text-primary/80 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all"
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-primary/50">
                      {item.description}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
