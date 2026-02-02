"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Grid, TrendingUp, Loader2 } from "lucide-react";
import type { DashboardStats } from "@/lib/shared";

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
}) {
  return (
    <div className="bg-primary/5 border border-primary/20 p-6 rounded">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-primary/60 font-tech uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-matrix text-primary mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-primary/40 font-tech mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className="w-8 h-8 text-primary/30" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-pink-400 font-tech">ERROR: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-matrix text-primary text-glow">Dashboard</h1>
        <p className="text-primary/60 font-tech mt-1">
          // SYSTEM OVERVIEW
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Subscribers"
          value={stats?.totalSubscribers ?? 0}
          icon={Users}
          subtitle={`${stats?.recentSignups ?? 0} in last 7 days`}
        />
        <StatCard
          title="Blog Posts"
          value={stats?.totalPosts ?? 0}
          icon={FileText}
          subtitle={`${stats?.publishedPosts ?? 0} published`}
        />
        <StatCard
          title="Categories"
          value={stats?.totalCategories ?? 0}
          icon={Grid}
          subtitle={`${stats?.activeCategories ?? 0} active`}
        />
        <StatCard
          title="Response Rate"
          value={
            stats && stats.totalSubscribers > 0
              ? `${Math.round(
                  ((stats.responseBreakdown.yes + stats.responseBreakdown.no) /
                    stats.totalSubscribers) *
                    100
                )}%`
              : "N/A"
          }
          icon={TrendingUp}
        />
      </div>

      {/* Response Breakdown */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded">
        <h2 className="text-lg font-tech text-primary mb-4">
          "Are you ok?" Responses
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded">
            <p className="text-2xl font-matrix text-green-400">
              {stats?.responseBreakdown.yes ?? 0}
            </p>
            <p className="text-xs text-primary/60 font-tech mt-1">YES</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded">
            <p className="text-2xl font-matrix text-pink-400">
              {stats?.responseBreakdown.no ?? 0}
            </p>
            <p className="text-xs text-primary/60 font-tech mt-1">NO</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded">
            <p className="text-2xl font-matrix text-primary/60">
              {stats?.responseBreakdown.noResponse ?? 0}
            </p>
            <p className="text-xs text-primary/60 font-tech mt-1">NO RESPONSE</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded">
        <h2 className="text-lg font-tech text-primary mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/subscribers"
            className="px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
          >
            View Subscribers
          </a>
          <a
            href="/admin/blog"
            className="px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
          >
            Manage Blog
          </a>
          <a
            href="/admin/settings"
            className="px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
          >
            Site Settings
          </a>
        </div>
      </div>
    </div>
  );
}
