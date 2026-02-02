"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Home,
  Layout,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/pages", label: "Pages", icon: Layout },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0a0612] border-r border-primary/20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-primary/20">
        <h1 className="text-2xl font-matrix text-primary text-glow">
          ADMIN PANEL
        </h1>
        <p className="text-xs text-primary/40 font-tech mt-1">
          // SYSTEM CONTROL
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded font-tech text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "text-primary/60 hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary/20 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-primary/60 hover:text-primary font-tech text-sm transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-pink-400/60 hover:text-pink-400 font-tech text-sm transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
