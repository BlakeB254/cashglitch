"use client";

import {
  Heart,
  Gift,
  Trophy,
  Plane,
  Briefcase,
  Handshake,
  Laptop,
  Monitor,
  Home,
  Users,
  DollarSign,
  BookOpen,
  GraduationCap,
  Building,
  Globe,
  Star,
  Award,
  Shield,
  Zap,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Gift,
  Trophy,
  Plane,
  Briefcase,
  Handshake,
  Laptop,
  Monitor,
  Home,
  Users,
  DollarSign,
  BookOpen,
  GraduationCap,
  Building,
  Globe,
  Star,
  Award,
  Shield,
  Zap,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = iconMap[name] || Gift;
  return <Icon className={className} />;
}
