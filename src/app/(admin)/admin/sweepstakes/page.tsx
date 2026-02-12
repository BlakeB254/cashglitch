"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Star,
  Ticket,
  DollarSign,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import type { Sweepstake } from "@/lib/shared";

export default function AdminSweepstakesPage() {
  const [sweepstakes, setSweepstakes] = useState<Sweepstake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Sweepstake> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSweepstakes();
  }, []);

  const fetchSweepstakes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/sweepstakes");
      if (res.ok) {
        const data = await res.json();
        setSweepstakes(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to load sweepstakes (${res.status})`);
      }
    } catch (err) {
      console.error("Failed to fetch sweepstakes:", err);
      setError("Network error — could not load sweepstakes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: Partial<Sweepstake>) => {
    setIsSaving(true);
    setError(null);
    try {
      const method = item.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/sweepstakes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Save failed (${res.status})`);
        return;
      }

      if (item.id) {
        setSweepstakes((prev) =>
          prev.map((s) => (s.id === data.id ? data : s))
        );
      } else {
        setSweepstakes((prev) => [data, ...prev]);
      }
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to save sweepstake:", err);
      setError("Network error — could not save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sweepstake?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/sweepstakes?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Delete failed (${res.status})`);
        return;
      }
      setSweepstakes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete sweepstake:", err);
      setError("Network error — could not delete");
    }
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-matrix text-primary text-glow">
            Sweepstakes
          </h1>
          <p className="text-primary/60 font-tech mt-1">
            // MANAGE RAFFLE LISTINGS & TICKET PRICING
          </p>
        </div>
        <button
          onClick={() =>
            setEditingItem({
              title: "",
              description: "",
              prizeDescription: "",
              ticketPriceCents: 500,
              maxTickets: null,
              drawDate: null,
              status: "active",
              imageUrl: null,
              isFeatured: false,
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Sweepstake
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 border border-red-500/40 bg-red-500/10 rounded text-red-400 font-tech text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border border-primary/20 rounded">
          <p className="text-xs font-tech text-primary/40 uppercase">Active</p>
          <p className="text-2xl font-matrix text-primary">
            {sweepstakes.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="p-4 border border-primary/20 rounded">
          <p className="text-xs font-tech text-primary/40 uppercase">
            Total Tickets Sold
          </p>
          <p className="text-2xl font-matrix text-primary">
            {sweepstakes.reduce((sum, s) => sum + s.ticketsSold, 0)}
          </p>
        </div>
        <div className="p-4 border border-primary/20 rounded">
          <p className="text-xs font-tech text-primary/40 uppercase">
            Est. Revenue
          </p>
          <p className="text-2xl font-matrix text-primary">
            {formatPrice(
              sweepstakes.reduce(
                (sum, s) => sum + s.ticketsSold * s.ticketPriceCents,
                0
              )
            )}
          </p>
        </div>
      </div>

      {/* Sweepstakes List */}
      <div className="space-y-2">
        {sweepstakes.length === 0 ? (
          <div className="text-center py-8 text-primary/40 font-tech">
            No sweepstakes yet. Click &quot;New Sweepstake&quot; to create one.
          </div>
        ) : (
          sweepstakes.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 border rounded ${
                item.status === "active"
                  ? "bg-primary/5 border-primary/30"
                  : "bg-primary/5 border-primary/10 opacity-50"
              }`}
            >
              {/* Thumbnail */}
              {item.imageUrl && (
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-primary/20">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {item.isFeatured && (
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-tech text-primary truncate">
                    {item.title}
                  </p>
                  <span
                    className={`text-[10px] font-tech px-2 py-0.5 rounded ${
                      item.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : item.status === "ended"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-primary/20 text-primary/60"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-primary/60 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {formatPrice(item.ticketPriceCents)}/ticket
                  </span>
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    {item.ticketsSold} sold
                    {item.maxTickets && ` / ${item.maxTickets}`}
                  </span>
                  {item.drawDate && (
                    <span>
                      Draw: {new Date(item.drawDate).toLocaleDateString()}
                    </span>
                  )}
                  <span>
                    Revenue:{" "}
                    {formatPrice(item.ticketsSold * item.ticketPriceCents)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-primary/60 hover:text-primary transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-pink-400/60 hover:text-pink-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <SweepstakeModal
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

function SweepstakeModal({
  item,
  onSave,
  onCancel,
  isSaving,
}: {
  item: Partial<Sweepstake>;
  onSave: (item: Partial<Sweepstake>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(item);
  const [priceInput, setPriceInput] = useState(
    ((item.ticketPriceCents || 500) / 100).toFixed(2)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const ticketPriceCents = Math.round(parseFloat(priceInput) * 100) || 500;
    onSave({ ...form, ticketPriceCents });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }

      setForm({ ...form, imageUrl: data.url });
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Network error during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f0a1a] border border-primary/30 p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-matrix text-primary">
          {item.id ? "Edit Sweepstake" : "New Sweepstake"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Description
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Prize Description
            </label>
            <input
              type="text"
              value={form.prizeDescription || ""}
              onChange={(e) =>
                setForm({ ...form, prizeDescription: e.target.value })
              }
              placeholder="e.g., $500 Cash Prize, Gaming Console"
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Image
            </label>
            {form.imageUrl ? (
              <div className="relative border border-primary/30 rounded overflow-hidden">
                <Image
                  src={form.imageUrl}
                  alt="Sweepstake"
                  width={480}
                  height={200}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => setForm({ ...form, imageUrl: null })}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 rounded p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 mx-auto text-primary animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 mx-auto text-primary/40 mb-2" />
                    <p className="text-xs font-tech text-primary/40">
                      Click or drag image here
                    </p>
                    <p className="text-[10px] font-tech text-primary/20 mt-1">
                      JPEG, PNG, WebP, GIF (max 5MB)
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
            {uploadError && (
              <p className="text-xs text-red-400 font-tech mt-1">
                {uploadError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Ticket Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.50"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Max Tickets (blank = unlimited)
              </label>
              <input
                type="number"
                value={form.maxTickets ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxTickets: e.target.value
                      ? parseInt(e.target.value, 10)
                      : null,
                  })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Draw Date
              </label>
              <input
                type="datetime-local"
                value={
                  form.drawDate
                    ? new Date(form.drawDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    drawDate: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Status
              </label>
              <select
                value={form.status || "active"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured || false}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="w-4 h-4 accent-amber-400"
            />
            <span className="text-sm font-tech text-primary/80">Featured</span>
          </label>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !form.title}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-primary/30 text-primary font-tech hover:bg-primary/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
