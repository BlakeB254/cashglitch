"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Edit3,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
} from "lucide-react";
import type { PageContent, PageItem } from "@/lib/shared";
import { PAGE_SLUGS, PAGE_LABELS, type PageSlug } from "@/lib/shared";

export default function PagesAdminPage() {
  const [activeTab, setActiveTab] = useState<PageSlug>("npo");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Page content state
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [currentContent, setCurrentContent] = useState<PageContent | null>(null);

  // Page items state
  const [pageItems, setPageItems] = useState<PageItem[]>([]);
  const [editingItem, setEditingItem] = useState<PageItem | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [contentsRes, itemsRes] = await Promise.all([
          fetch("/api/admin/pages"),
          fetch("/api/admin/page-items"),
        ]);

        if (contentsRes.ok) {
          const contents = await contentsRes.json();
          setPageContents(contents);
        }

        if (itemsRes.ok) {
          const items = await itemsRes.json();
          setPageItems(items);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update current content when tab changes
  useEffect(() => {
    const content = pageContents.find((c) => c.pageSlug === activeTab);
    setCurrentContent(content || null);
  }, [activeTab, pageContents]);

  // Get items for current page
  const currentItems = pageItems.filter((item) => item.pageSlug === activeTab);

  // Save page content
  const handleSaveContent = async () => {
    if (!currentContent) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentContent),
      });
      if (res.ok) {
        const updated = await res.json();
        setPageContents((prev) =>
          prev.map((c) => (c.pageSlug === updated.pageSlug ? updated : c))
        );
      }
    } catch (error) {
      console.error("Failed to save page content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Save page item
  const handleSaveItem = async (item: Partial<PageItem>) => {
    setIsSaving(true);
    try {
      const method = item.id ? "PUT" : "POST";
      const body = item.id ? item : { ...item, pageSlug: activeTab };

      const res = await fetch("/api/admin/page-items", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updated = await res.json();
        if (item.id) {
          setPageItems((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i))
          );
        } else {
          setPageItems((prev) => [...prev, updated]);
        }
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete page item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch(`/api/admin/page-items?id=${id}`, { method: "DELETE" });
      setPageItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

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
      <div>
        <h1 className="text-3xl font-matrix text-primary text-glow">Page Content</h1>
        <p className="text-primary/60 font-tech mt-1">
          // MANAGE CONTENT FOR EACH PAGE SECTION
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 border-b border-primary/20 pb-2 overflow-x-auto">
        {PAGE_SLUGS.map((slug) => (
          <button
            key={slug}
            onClick={() => setActiveTab(slug)}
            className={`px-4 py-2 font-tech text-sm whitespace-nowrap transition-colors ${
              activeTab === slug
                ? "text-primary border-b-2 border-primary"
                : "text-primary/60 hover:text-primary"
            }`}
          >
            {PAGE_LABELS[slug]}
          </button>
        ))}
      </div>

      {/* Content Editor */}
      {currentContent && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hero Section */}
          <div className="space-y-4 p-4 border border-primary/20 rounded">
            <h2 className="text-lg font-matrix text-primary">Hero Section</h2>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={currentContent.heroBadgeText || ""}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, heroBadgeText: e.target.value })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Title
              </label>
              <input
                type="text"
                value={currentContent.heroTitle || ""}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, heroTitle: e.target.value })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={currentContent.heroSubtitle || ""}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, heroSubtitle: e.target.value })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Description
              </label>
              <textarea
                value={currentContent.heroDescription || ""}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, heroDescription: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4 p-4 border border-primary/20 rounded">
            <h2 className="text-lg font-matrix text-primary">CTA Section</h2>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                CTA Title
              </label>
              <input
                type="text"
                value={currentContent.ctaTitle || ""}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, ctaTitle: e.target.value })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                CTA Description
              </label>
              <textarea
                value={currentContent.ctaDescription || ""}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, ctaDescription: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={currentContent.ctaButtonText || ""}
                  onChange={(e) =>
                    setCurrentContent({ ...currentContent, ctaButtonText: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
                />
              </div>
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  value={currentContent.ctaButtonLink || ""}
                  onChange={(e) =>
                    setCurrentContent({ ...currentContent, ctaButtonLink: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="space-y-4 p-4 border border-primary/20 rounded lg:col-span-2">
            <h2 className="text-lg font-matrix text-primary">SEO & Meta</h2>

            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={currentContent.metaTitle || ""}
                  onChange={(e) =>
                    setCurrentContent({ ...currentContent, metaTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
                />
              </div>
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Meta Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={currentContent.metaKeywords || ""}
                  onChange={(e) =>
                    setCurrentContent({ ...currentContent, metaKeywords: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Meta Description
              </label>
              <textarea
                value={currentContent.metaDescription || ""}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, metaDescription: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentContent.isActive}
                  onChange={(e) =>
                    setCurrentContent({ ...currentContent, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-tech text-primary/80">Page Active</span>
              </label>

              <button
                onClick={handleSaveContent}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 transition-all"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Page Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-matrix text-primary">
            {PAGE_LABELS[activeTab]} Items
          </h2>
          <button
            onClick={() =>
              setEditingItem({
                id: 0,
                pageSlug: activeTab,
                title: "",
                description: "",
                category: "",
                location: "",
                deadline: "",
                value: "",
                website: "",
                imageUrl: null,
                tags: [],
                isFeatured: false,
                sortOrder: currentItems.length,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {currentItems.length === 0 ? (
            <div className="text-center py-8 text-primary/40 font-tech">
              No items yet. Click "Add Item" to create one.
            </div>
          ) : (
            currentItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 border rounded ${
                  item.isActive
                    ? "bg-primary/5 border-primary/30"
                    : "bg-primary/5 border-primary/10 opacity-50"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <button className="p-1 text-primary/30 hover:text-primary transition-colors">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-primary/30 hover:text-primary transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

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
                  <p className="font-tech text-primary truncate">{item.title}</p>
                  <p className="text-xs text-primary/60 truncate">
                    {item.category && <span>{item.category} | </span>}
                    {item.location && <span>{item.location} | </span>}
                    {item.value && <span>{item.value}</span>}
                  </p>
                </div>

                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary/40 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-primary/60 hover:text-primary transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-pink-400/60 hover:text-pink-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Item Edit Modal */}
      {editingItem && (
        <ItemModal
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => setEditingItem(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

// Item Edit Modal Component
function ItemModal({
  item,
  onSave,
  onCancel,
  isSaving,
}: {
  item: PageItem;
  onSave: (item: Partial<PageItem>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(item);
  const [tagsInput, setTagsInput] = useState(item.tags?.join(", ") || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...form, tags });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "pages");

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
          {item.id ? "Edit Item" : "Add Item"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
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
                  alt="Item"
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
                Category
              </label>
              <input
                type="text"
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g., Grants, Scholarships"
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Location
              </label>
              <input
                type="text"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g., National, New York"
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Deadline
              </label>
              <input
                type="text"
                value={form.deadline || ""}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                placeholder="e.g., Ongoing, Jan 2025"
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Value
              </label>
              <input
                type="text"
                value={form.value || ""}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="e.g., Up to $10,000"
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={form.website || ""}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., Education, Housing, Healthcare"
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-amber-400"
                />
                <span className="text-sm font-tech text-primary/80">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-tech text-primary/80">Active</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !form.title}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech disabled:opacity-50 transition-all"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
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
