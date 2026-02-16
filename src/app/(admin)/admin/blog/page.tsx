"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Save, Upload, X } from "lucide-react";
import type { BlogPost } from "@/lib/shared";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formPublished, setFormPublished] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormTitle(post.title);
      setFormContent(post.content);
      setFormExcerpt(post.excerpt || "");
      setFormPublished(post.published);
      setFormImageUrl(post.imageUrl || "");
    } else {
      setEditingPost(null);
      setFormTitle("");
      setFormContent("");
      setFormExcerpt("");
      setFormPublished(false);
      setFormImageUrl("");
    }
    setUploadError(null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }

      setFormImageUrl(data.url);
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

  const handleSave = async () => {
    if (!formTitle || !formContent) return;

    setIsSaving(true);
    try {
      const method = editingPost ? "PUT" : "POST";
      const body = editingPost
        ? {
            id: editingPost.id,
            title: formTitle,
            content: formContent,
            excerpt: formExcerpt || null,
            published: formPublished,
            imageUrl: formImageUrl || null,
          }
        : {
            title: formTitle,
            content: formContent,
            excerpt: formExcerpt || null,
            published: formPublished,
            imageUrl: formImageUrl || null,
          };

      const res = await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchPosts();
        closeEditor();
      }
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-matrix text-primary text-glow">Blog</h1>
          <p className="text-primary/60 font-tech mt-1">
            // {posts.length} POSTS | {posts.filter((p) => p.published).length}{" "}
            PUBLISHED
          </p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech text-sm hover:from-purple-500 hover:to-pink-500 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-primary/40 font-tech">
            No blog posts yet. Create your first post!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded"
            >
              {post.imageUrl && (
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-primary/20 mr-4">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-tech text-primary">{post.title}</h3>
                  {post.published ? (
                    <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary/60 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-primary/60 mt-1">
                  /{post.slug} | Created:{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublished(post)}
                  className="p-2 text-primary/60 hover:text-primary transition-colors"
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  {post.published ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEditor(post)}
                  className="p-2 text-primary/60 hover:text-primary transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-pink-400/60 hover:text-pink-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f0a1a] border border-primary/30 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-xl font-matrix text-primary">
              {editingPost ? "Edit Post" : "New Post"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Excerpt
                </label>
                <input
                  type="text"
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Brief summary of the post..."
                  className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-tech placeholder:text-primary/30 focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Featured Image
                </label>
                {formImageUrl ? (
                  <div className="relative border border-primary/30 rounded overflow-hidden">
                    <Image
                      src={formImageUrl}
                      alt="Blog post"
                      width={720}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => setFormImageUrl("")}
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

              <div>
                <label className="block text-sm font-tech text-primary/80 mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-2 bg-primary/5 border border-primary/30 text-primary font-mono text-sm focus:outline-none focus:border-primary/60"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-tech text-primary/80">
                  Publish immediately
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving || !formTitle || !formContent}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech disabled:opacity-50 transition-all"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingPost ? "Update" : "Create"}
              </button>
              <button
                onClick={closeEditor}
                className="px-4 py-2 border border-primary/30 text-primary font-tech hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
