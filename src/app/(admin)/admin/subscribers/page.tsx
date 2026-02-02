"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import type { Subscriber, PaginatedResponse } from "@/lib/shared";

export default function SubscribersPage() {
  const [data, setData] = useState<PaginatedResponse<Subscriber> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [responseFilter, setResponseFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
      if (search) params.set("search", search);
      if (responseFilter) params.set("response", responseFilter);

      const res = await fetch(`/api/admin/subscribers?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, responseFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubscribers();
  };

  const handleExportCSV = () => {
    if (!data?.items) return;

    const headers = ["Email", "Response", "Date", "IP Address"];
    const rows = data.items.map((s) => [
      s.email,
      s.response || "N/A",
      new Date(s.createdAt).toLocaleDateString(),
      s.ipAddress,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: "email", header: "Email" },
    {
      key: "response",
      header: "Response",
      render: (item: Subscriber) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            item.response === "yes"
              ? "bg-green-500/20 text-green-400"
              : item.response === "no"
                ? "bg-pink-500/20 text-pink-400"
                : "bg-primary/20 text-primary/60"
          }`}
        >
          {item.response?.toUpperCase() || "N/A"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (item: Subscriber) =>
        new Date(item.createdAt).toLocaleDateString(),
    },
    { key: "ipAddress", header: "IP Address" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-matrix text-primary text-glow">
            Subscribers
          </h1>
          <p className="text-primary/60 font-tech mt-1">
            // {data?.total ?? 0} TOTAL RECORDS
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!data?.items?.length}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email..."
              className="w-full pl-10 pr-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech placeholder:text-primary/30 focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={responseFilter}
          onChange={(e) => {
            setResponseFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60 transition-colors"
        >
          <option value="">All Responses</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="null">No Response</option>
        </select>
      </div>

      {/* Table */}
      {isLoading && !data ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          page={page}
          pageSize={20}
          total={data?.total ?? 0}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
