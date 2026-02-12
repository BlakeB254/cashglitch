"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  Eye,
  EyeOff,
  MousePointerClick,
  BarChart3,
  AlertCircle,
  X,
  RotateCcw,
} from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";
import type { Category } from "@/lib/shared";
import { AVAILABLE_ICONS } from "@/lib/shared";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Category> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to load categories (${res.status})`);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Network error — could not load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: Partial<Category>) => {
    setIsSaving(true);
    setError(null);
    try {
      const method = item.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", {
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
        setCategories((prev) =>
          prev.map((c) => (c.id === data.id ? data : c))
        );
      } else {
        setCategories((prev) => [...prev, data]);
      }
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to save category:", err);
      setError("Network error — could not save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Delete failed (${res.status})`);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError("Network error — could not delete");
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, isActive: !cat.isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === data.id ? data : c))
        );
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const handleResetClicks = async (id: number) => {
    if (!confirm("Reset click count to 0 for this category?")) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, clickCount: 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === data.id ? data : c))
        );
      }
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  const totalClicks = categories.reduce((sum, c) => sum + c.clickCount, 0);
  const activeCount = categories.filter((c) => c.isActive).length;
  const topCategory = [...categories].sort(
    (a, b) => b.clickCount - a.clickCount
  )[0];

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
            Categories
          </h1>
          <p className="text-primary/60 font-tech mt-1">
            // MANAGE HOMEPAGE ACCESS POINTS & TRACK VISIBILITY
          </p>
        </div>
        <button
          onClick={() =>
            setEditingItem({
              title: "",
              description: "",
              href: "/",
              icon: "Gift",
              sortOrder: categories.length,
              isActive: true,
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Category
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-primary/20 rounded">
          <p className="text-xs font-tech text-primary/40 uppercase">Total</p>
          <p className="text-2xl font-matrix text-primary">
            {categories.length}
          </p>
        </div>
        <div className="p-4 border border-primary/20 rounded">
          <p className="text-xs font-tech text-primary/40 uppercase">Active</p>
          <p className="text-2xl font-matrix text-primary">{activeCount}</p>
        </div>
        <div className="p-4 border border-primary/20 rounded">
          <p className="text-xs font-tech text-primary/40 uppercase flex items-center gap-1">
            <MousePointerClick className="w-3 h-3" /> Total Clicks
          </p>
          <p className="text-2xl font-matrix text-primary">{totalClicks}</p>
        </div>
        <div className="p-4 border border-primary/20 rounded">
          <p className="text-xs font-tech text-primary/40 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3" /> Top Category
          </p>
          <p className="text-lg font-matrix text-primary truncate">
            {topCategory ? topCategory.title : "—"}
          </p>
          {topCategory && topCategory.clickCount > 0 && (
            <p className="text-xs text-primary/40 font-tech">
              {topCategory.clickCount} clicks
            </p>
          )}
        </div>
      </div>

      {/* Click Distribution Bar */}
      {totalClicks > 0 && (
        <div className="p-4 border border-primary/20 rounded space-y-3">
          <p className="text-xs font-tech text-primary/40 uppercase">
            Click Distribution
          </p>
          {[...categories]
            .sort((a, b) => b.clickCount - a.clickCount)
            .map((cat) => {
              const pct =
                totalClicks > 0
                  ? Math.round((cat.clickCount / totalClicks) * 100)
                  : 0;
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="w-24 truncate text-xs font-tech text-primary/60">
                    {cat.title}
                  </div>
                  <div className="flex-1 h-4 bg-primary/5 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs font-tech text-primary/60">
                    {cat.clickCount} ({pct}%)
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-primary/40 font-tech">
            No categories yet. Click &quot;New Category&quot; to create one.
          </div>
        ) : (
          [...categories]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center gap-4 p-4 border rounded transition-all ${
                  cat.isActive
                    ? "bg-primary/5 border-primary/30"
                    : "bg-primary/5 border-primary/10 opacity-50"
                }`}
              >
                {/* Drag Handle (visual) */}
                <GripVertical className="w-4 h-4 text-primary/20 flex-shrink-0" />

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded flex-shrink-0">
                  <DynamicIcon
                    name={cat.icon}
                    className="w-5 h-5 text-primary/60"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-tech text-primary truncate">
                      {cat.title}
                    </p>
                    <span
                      className={`text-[10px] font-tech px-2 py-0.5 rounded ${
                        cat.isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {cat.isActive ? "active" : "hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-primary/60 flex items-center gap-3 flex-wrap">
                    <span className="text-primary/40">{cat.href}</span>
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {cat.clickCount} clicks
                    </span>
                    <span className="text-primary/30">
                      Order: {cat.sortOrder}
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleResetClicks(cat.id)}
                    className="p-2 text-primary/30 hover:text-primary/60 transition-colors"
                    title="Reset clicks"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className="p-2 text-primary/60 hover:text-primary transition-colors"
                    title={cat.isActive ? "Hide" : "Show"}
                  >
                    {cat.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingItem(cat)}
                    className="p-2 text-primary/60 hover:text-primary transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
        <CategoryModal
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

function CategoryModal({
  item,
  onSave,
  onCancel,
  isSaving,
}: {
  item: Partial<Category>;
  onSave: (item: Partial<Category>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(item);

  const handleSave = () => {
    if (!form.title || !form.href) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f0a1a] border border-primary/30 p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-matrix text-primary">
          {item.id ? "Edit Category" : "New Category"}
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
              placeholder="e.g., Sweepstakes"
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short description shown on hover"
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Link (href) *
            </label>
            <input
              type="text"
              value={form.href || ""}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="/sweepstakes"
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2 p-3 bg-primary/5 border border-primary/30 max-h-40 overflow-y-auto">
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setForm({ ...form, icon: iconName })}
                  className={`p-2 rounded flex flex-col items-center gap-1 transition-colors ${
                    form.icon === iconName
                      ? "bg-primary/20 border border-primary/50"
                      : "hover:bg-primary/10 border border-transparent"
                  }`}
                  title={iconName}
                >
                  <DynamicIcon
                    name={iconName}
                    className="w-5 h-5 text-primary/60"
                  />
                  <span className="text-[8px] font-tech text-primary/40 truncate w-full text-center">
                    {iconName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder ?? 0}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sortOrder: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive ?? true}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-400"
                />
                <span className="text-sm font-tech text-primary/80">
                  Active (visible on homepage)
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !form.title || !form.href}
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
