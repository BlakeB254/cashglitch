"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SiteSettings, Category, IntroScreen, AVAILABLE_ICONS } from "@/lib/shared";

const ICON_OPTIONS: (typeof AVAILABLE_ICONS)[number][] = [
  "Heart", "Gift", "Plane", "Briefcase", "Handshake", "Laptop", "Monitor",
  "Home", "Users", "DollarSign", "BookOpen", "GraduationCap", "Building",
  "Globe", "Star", "Award", "Shield", "Zap",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"site" | "categories" | "intro">("site");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Site settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Intro screens state
  const [introScreens, setIntroScreens] = useState<IntroScreen[]>([]);
  const [editingScreen, setEditingScreen] = useState<IntroScreen | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [settingsRes, categoriesRes, screensRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/intro-screens"),
        ]);

        if (settingsRes.ok) setSettings(await settingsRes.json());
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        if (screensRes.ok) setIntroScreens(await screensRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save site settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Category CRUD
  const handleSaveCategory = async (category: Partial<Category>) => {
    setIsSaving(true);
    try {
      const method = category.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const updated = await res.json();
        if (category.id) {
          setCategories((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
        } else {
          setCategories((prev) => [...prev, updated]);
        }
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // Intro screen CRUD
  const handleSaveScreen = async (screen: Partial<IntroScreen>) => {
    setIsSaving(true);
    try {
      const method = screen.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/intro-screens", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(screen),
      });
      if (res.ok) {
        const updated = await res.json();
        if (screen.id) {
          setIntroScreens((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
        } else {
          setIntroScreens((prev) => [...prev, updated]);
        }
        setEditingScreen(null);
      }
    } catch (error) {
      console.error("Failed to save intro screen:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteScreen = async (id: number) => {
    if (!confirm("Are you sure you want to delete this intro screen?")) return;
    try {
      await fetch(`/api/admin/intro-screens?id=${id}`, { method: "DELETE" });
      setIntroScreens((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete intro screen:", error);
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
        <h1 className="text-3xl font-matrix text-primary text-glow">Settings</h1>
        <p className="text-primary/60 font-tech mt-1">
          // CONFIGURE SITE, CATEGORIES & INTRO SEQUENCE
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-primary/20 pb-2">
        {[
          { id: "site", label: "Site Settings" },
          { id: "categories", label: "Categories" },
          { id: "intro", label: "Intro Sequence" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 font-tech text-sm transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-primary/60 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Site Settings Tab */}
      {activeTab === "site" && settings && (
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-tech text-primary/80 mb-2">
                Site Title
              </label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) =>
                  setSettings({ ...settings, siteTitle: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-2">
                Site Tagline
              </label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) =>
                  setSettings({ ...settings, siteTagline: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-2">
                Site Description (SEO)
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) =>
                  setSettings({ ...settings, siteDescription: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-2">
                OG Title (Social Sharing)
              </label>
              <input
                type="text"
                value={settings.ogTitle}
                onChange={(e) =>
                  setSettings({ ...settings, ogTitle: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-2">
                OG Description
              </label>
              <textarea
                value={settings.ogDescription}
                onChange={(e) =>
                  setSettings({ ...settings, ogDescription: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="block text-sm font-tech text-primary/80 mb-2">
                Meta Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={settings.metaKeywords}
                onChange={(e) =>
                  setSettings({ ...settings, metaKeywords: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, twitterUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
                />
              </div>
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, instagramUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.featureBlog}
                  onChange={(e) =>
                    setSettings({ ...settings, featureBlog: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-tech text-primary/80">
                  Enable Blog
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.featureAccessGate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      featureAccessGate: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-tech text-primary/80">
                  Enable Access Gate
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Settings
          </button>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <button
            onClick={() =>
              setEditingCategory({
                id: 0,
                title: "",
                description: "",
                href: "/",
                icon: "Gift",
                sortOrder: categories.length,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>

          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center gap-4 p-4 border rounded ${
                  category.isActive
                    ? "bg-primary/5 border-primary/30"
                    : "bg-primary/5 border-primary/10 opacity-50"
                }`}
              >
                <GripVertical className="w-4 h-4 text-primary/30 cursor-move" />
                <div className="flex-1">
                  <p className="font-tech text-primary">{category.title}</p>
                  <p className="text-xs text-primary/60">
                    {category.href} | Icon: {category.icon}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="px-3 py-1 text-xs font-tech text-primary/60 hover:text-primary transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-pink-400/60 hover:text-pink-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Category Edit Modal */}
          {editingCategory && (
            <CategoryModal
              category={editingCategory}
              onSave={handleSaveCategory}
              onCancel={() => setEditingCategory(null)}
              isSaving={isSaving}
            />
          )}
        </div>
      )}

      {/* Intro Sequence Tab */}
      {activeTab === "intro" && (
        <div className="space-y-4">
          <button
            onClick={() =>
              setEditingScreen({
                id: 0,
                screenType: "question",
                title: "",
                subtitle: "",
                options: [],
                sortOrder: introScreens.length,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-tech text-sm hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Screen
          </button>

          <div className="space-y-2">
            {introScreens.map((screen, index) => (
              <div
                key={screen.id}
                className={`flex items-center gap-4 p-4 border rounded ${
                  screen.isActive
                    ? "bg-primary/5 border-primary/30"
                    : "bg-primary/5 border-primary/10 opacity-50"
                }`}
              >
                <div className="flex flex-col">
                  <button
                    disabled={index === 0}
                    className="p-1 text-primary/30 hover:text-primary disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === introScreens.length - 1}
                    className="p-1 text-primary/30 hover:text-primary disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="font-tech text-primary">{screen.title}</p>
                  <p className="text-xs text-primary/60">
                    Type: {screen.screenType} | Order: {screen.sortOrder}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingScreen(screen)}
                    className="px-3 py-1 text-xs font-tech text-primary/60 hover:text-primary transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteScreen(screen.id)}
                    className="p-1 text-pink-400/60 hover:text-pink-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Screen Edit Modal */}
          {editingScreen && (
            <IntroScreenModal
              screen={editingScreen}
              onSave={handleSaveScreen}
              onCancel={() => setEditingScreen(null)}
              isSaving={isSaving}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Category Edit Modal Component
function CategoryModal({
  category,
  onSave,
  onCancel,
  isSaving,
}: {
  category: Category;
  onSave: (category: Partial<Category>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(category);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f0a1a] border border-primary/30 p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-matrix text-primary">
          {category.id ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Title
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
            <input
              type="text"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Link (href)
            </label>
            <input
              type="text"
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Icon
            </label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: parseInt(e.target.value, 10) })
              }
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

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

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => onSave(form)}
            disabled={isSaving || !form.title || !form.href}
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

// Intro Screen Edit Modal Component
function IntroScreenModal({
  screen,
  onSave,
  onCancel,
  isSaving,
}: {
  screen: IntroScreen;
  onSave: (screen: Partial<IntroScreen>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(screen);
  const [optionsJson, setOptionsJson] = useState(
    JSON.stringify(screen.options || {}, null, 2)
  );

  const handleSave = () => {
    try {
      const parsedOptions = JSON.parse(optionsJson);
      onSave({ ...form, options: parsedOptions });
    } catch {
      alert("Invalid JSON in options field");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f0a1a] border border-primary/30 p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-matrix text-primary">
          {screen.id ? "Edit Intro Screen" : "Add Intro Screen"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Screen Type
            </label>
            <select
              value={form.screenType}
              onChange={(e) =>
                setForm({
                  ...form,
                  screenType: e.target.value as IntroScreen["screenType"],
                })
              }
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            >
              <option value="question">Question (Yes/No buttons)</option>
              <option value="email">Email Capture</option>
              <option value="info">Information (Text only)</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Title
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
              Subtitle
            </label>
            <input
              type="text"
              value={form.subtitle || ""}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Options (JSON)
            </label>
            <textarea
              value={optionsJson}
              onChange={(e) => setOptionsJson(e.target.value)}
              rows={6}
              placeholder='For questions: [{"label": "YES", "value": "yes", "style": "primary"}]
For email: {"showSkipButton": true, "skipButtonText": "no email"}'
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-mono text-xs focus:outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-primary/80 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: parseInt(e.target.value, 10) })
              }
              className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
            />
          </div>

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
