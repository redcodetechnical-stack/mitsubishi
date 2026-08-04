"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Pencil, Trash2, Plus, LayoutGrid, List,
  ExternalLink, Calendar, User, Eye, X, AlertTriangle, Image as ImageIcon,
  BookOpen, Megaphone, Mail, Flame, Star, Upload, Save, Filter, Search
} from "lucide-react"
import {
  getKnowledge, saveKnowledge, updateKnowledge, deleteKnowledge,
  getNews, saveNews, updateNews, deleteNews,
  getNewsletters, saveNewsletter, updateNewsletter, deleteNewsletter
} from "@/lib/cms-store"
import type { KnowledgeArticle, NewsItem, NewsletterItem } from "@/lib/data"

type SectionKey = "knowledge-centre" | "popular-posts" | "announcements" | "communications"

const SECTIONS: { key: SectionKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: "knowledge-centre", label: "Knowledge Centre Blogs", icon: BookOpen, color: "bg-[#cc0000]" },
  { key: "popular-posts", label: "Popular Posts", icon: Flame, color: "bg-orange-500" },
  { key: "announcements", label: "Corporate Announcements", icon: Megaphone, color: "bg-[#cc0000]" },
  { key: "communications", label: "Corporate Communications", icon: Mail, color: "bg-cyan-600" },
]

const FALLBACK_IMAGES = ["/news-innovation.png", "/event-townhall.png", "/video-brandfilm.png"]
function fallbackImg(i: number) { return FALLBACK_IMAGES[i % FALLBACK_IMAGES.length] }

const KNOWLEDGE_CATEGORIES = ["How-to Guide", "Best Practice", "FAQ", "Process", "Training"]
const ANNOUNCEMENT_CATEGORIES = ["Announcements", "Campaigns", "Brand Centre", "Marketing Assets", "Communications", "Events", "Policies", "Knowledge Centre"]

type GenericBlogItem = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  author?: string
  image?: string
  readTime?: string
  isPopular?: boolean
  sectionOrigin: SectionKey
}

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  category: "How-to Guide",
  date: "",
  author: "",
  readTime: "4 min read",
  image: "",
  isPopular: false,
}

function compressImageFile(file: File, maxWidth = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("Could not load image"))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas not supported"))
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function AdminKnowledgePage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("knowledge-centre")
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeArticle[]>([])
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [commsList, setCommsList] = useState<NewsletterItem[]>([])
  const [view, setView] = useState<"cards" | "table">("cards")
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedItem, setSelectedItem] = useState<GenericBlogItem | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")
  const [flashId, setFlashId] = useState<string | null>(null)

  const reloadAll = useCallback(() => {
    setKnowledgeList(getKnowledge())
    setNewsList(getNews())
    setCommsList(getNewsletters())
  }, [])

  useEffect(() => { reloadAll() }, [reloadAll])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  // Normalize data lists into unified items per section
  const knowledgeItems: GenericBlogItem[] = knowledgeList.map((k) => ({
    id: k.id,
    title: k.title,
    excerpt: k.excerpt || "",
    category: k.category || "How-to Guide",
    date: k.date || "",
    author: k.author || "",
    image: k.image || "",
    readTime: k.readTime || "",
    isPopular: Boolean(k.isPopular),
    sectionOrigin: "knowledge-centre",
  }))

  const announcementItems: GenericBlogItem[] = newsList.map((n) => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt || "",
    category: n.tag || n.category || "Announcement",
    date: n.date || "",
    author: "Corporate Communications",
    image: n.image || "",
    readTime: n.readTime || "",
    isPopular: Boolean(n.isPopular),
    sectionOrigin: "announcements",
  }))

  const commsItems: GenericBlogItem[] = commsList.map((c) => ({
    id: c.id,
    title: c.title,
    excerpt: c.description || "",
    category: c.issue || "Newsletter",
    date: c.date || "",
    author: c.from || "Internal Comms",
    image: c.image || "",
    readTime: c.fileSize || "",
    isPopular: Boolean(c.isPopular),
    sectionOrigin: "communications",
  }))

  const popularItems: GenericBlogItem[] = [
    ...knowledgeItems.filter((i) => i.isPopular),
    ...announcementItems.filter((i) => i.isPopular),
    ...commsItems.filter((i) => i.isPopular),
  ]

  // If no items marked popular explicitly, fallback top entries for demo
  const displayedPopularItems = popularItems.length > 0 ? popularItems : [
    ...knowledgeItems.slice(0, 2).map(i => ({ ...i, isPopular: true })),
    ...announcementItems.slice(0, 1).map(i => ({ ...i, isPopular: true })),
  ]

  let currentItems: GenericBlogItem[] = []
  if (activeSection === "knowledge-centre") currentItems = knowledgeItems
  else if (activeSection === "popular-posts") currentItems = displayedPopularItems
  else if (activeSection === "announcements") currentItems = announcementItems
  else if (activeSection === "communications") currentItems = commsItems

  const filteredItems = currentItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setSelectedItem(null)
    setForm({
      ...EMPTY_FORM,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      category: activeSection === "announcements" ? "Announcements" : "How-to Guide",
      isPopular: activeSection === "popular-posts",
    })
    setModal("add")
  }

  function openEdit(item: GenericBlogItem) {
    setSelectedItem(item)
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      date: item.date,
      author: item.author || "",
      readTime: item.readTime || "",
      image: item.image || "",
      isPopular: Boolean(item.isPopular),
    })
    setModal("edit")
  }

  function openDelete(item: GenericBlogItem) {
    setSelectedItem(item)
    setModal("delete")
  }

  function togglePopular(item: GenericBlogItem) {
    const newStatus = !item.isPopular
    if (item.sectionOrigin === "knowledge-centre") {
      updateKnowledge(item.id, { isPopular: newStatus })
    } else if (item.sectionOrigin === "announcements") {
      updateNews(item.id, { isPopular: newStatus })
    } else if (item.sectionOrigin === "communications") {
      updateNewsletter(item.id, { isPopular: newStatus })
    }
    reloadAll()
    flash(item.id)
  }

  function handleSubmit() {
    if (!form.title.trim()) return
    const targetSection = selectedItem ? selectedItem.sectionOrigin : activeSection

    if (modal === "add") {
      if (targetSection === "announcements") {
        saveNews({
          title: form.title,
          excerpt: form.excerpt,
          category: form.category as any,
          tag: form.category,
          date: form.date || "Jul 12, 2026",
          readTime: form.readTime || "4 min read",
          image: form.image || "/news-innovation.png",
          isPopular: form.isPopular,
        })
      } else if (targetSection === "communications") {
        saveNewsletter({
          title: form.title,
          description: form.excerpt,
          issue: form.category || "Newsletter",
          date: form.date || "Jul 12, 2026",
          fileSize: form.readTime || "2.5 MB",
          downloads: 0,
          image: form.image || "/event-townhall.png",
          isPopular: form.isPopular,
        })
      } else {
        saveKnowledge({
          title: form.title,
          excerpt: form.excerpt,
          category: form.category as any,
          department: "Corporate Communications",
          author: form.author || "Admin Team",
          date: form.date || "Jul 12, 2026",
          readTime: form.readTime || "4 min read",
          views: 0,
          tags: [form.category],
          image: form.image || "/news-innovation.png",
          isPopular: form.isPopular,
        })
      }
    } else if (modal === "edit" && selectedItem) {
      if (targetSection === "announcements") {
        updateNews(selectedItem.id, {
          title: form.title,
          excerpt: form.excerpt,
          category: form.category as any,
          tag: form.category,
          date: form.date,
          readTime: form.readTime,
          image: form.image,
          isPopular: form.isPopular,
        })
      } else if (targetSection === "communications") {
        updateNewsletter(selectedItem.id, {
          title: form.title,
          description: form.excerpt,
          issue: form.category,
          date: form.date,
          fileSize: form.readTime,
          image: form.image,
          isPopular: form.isPopular,
        })
      } else {
        updateKnowledge(selectedItem.id, {
          title: form.title,
          excerpt: form.excerpt,
          category: form.category as any,
          author: form.author,
          date: form.date,
          readTime: form.readTime,
          image: form.image,
          isPopular: form.isPopular,
        })
      }
      flash(selectedItem.id)
    }

    setModal(null)
    setSelectedItem(null)
    reloadAll()
  }

  function handleDelete() {
    if (!selectedItem) return
    if (selectedItem.sectionOrigin === "announcements") {
      deleteNews(selectedItem.id)
    } else if (selectedItem.sectionOrigin === "communications") {
      deleteNewsletter(selectedItem.id)
    } else {
      deleteKnowledge(selectedItem.id)
    }
    setModal(null)
    setSelectedItem(null)
    reloadAll()
  }

  async function handleImage(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const url = await compressImageFile(file)
      setForm((f) => ({ ...f, image: url }))
    } catch {
      setUploadError("Could not process image. Try a JPG or PNG.")
    } finally {
      setUploading(false)
    }
  }

  function getPreviewUrl(item: GenericBlogItem) {
    if (item.sectionOrigin === "announcements") return "/announcements"
    if (item.sectionOrigin === "communications") return "/communications"
    return `/knowledge-centre/${item.id}`
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 lg:p-8 space-y-6">

      {/* Executive Red & Black Textured Header Bar */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-4 px-6 lg:py-5 lg:px-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-red-900/40"
        style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
      >
        <div className="relative space-y-1 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/15 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#E60012] animate-ping" />
              Knowledge Hub
            </span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <BookOpen className="size-5 text-[#E60012]" /> Blog &amp; Knowledge Management
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Add, edit, or manage blogs, popular posts, announcements, and communications.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => setView((v) => (v === "cards" ? "table" : "cards"))}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            {view === "cards" ? <><List className="size-4" /> Table View</> : <><LayoutGrid className="size-4" /> Card View</>}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="size-4" /> Add Blog / Post
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Filter className="size-3.5" /> Category:
          </span>
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const isActive = activeSection === s.key
            let count = 0
            if (s.key === "knowledge-centre") count = knowledgeItems.length
            else if (s.key === "popular-posts") count = displayedPopularItems.length
            else if (s.key === "announcements") count = announcementItems.length
            else if (s.key === "communications") count = commsItems.length

            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#E60012] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{s.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1 ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${SECTIONS.find((s) => s.key === activeSection)?.label}...`}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#E60012]"
          />
        </div>
      </div>

      {/* ─── Cards Grid View ────────────────────────────────────────────────── */}
      {view === "cards" && (
        <>
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200">
              <div className="size-16 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                <BookOpen className="size-8 text-[#cc0000]" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">No blog posts found in this section</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Click below to create your first article or announcement.</p>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#a80000] cursor-pointer"
              >
                <Plus className="size-4" /> Add Post
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, i) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-[#cc0000]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Thumbnail / Cover Image */}
                  <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image || fallbackImg(i)}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={(item.image || "").startsWith("data:")}
                    />

                    {/* Slot badge */}
                    <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      Slot {i + 1}
                    </span>

                    {/* Popular toggle button badge */}
                    <button
                      onClick={() => togglePopular(item)}
                      title={item.isPopular ? "Unmark Popular Post" : "Mark as Popular Post"}
                      className={`absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shadow transition-all cursor-pointer ${
                        item.isPopular
                          ? "bg-amber-500 text-white ring-2 ring-white"
                          : "bg-black/60 text-white/80 hover:bg-black/80"
                      }`}
                    >
                      <Star className={`size-3 ${item.isPopular ? "fill-white text-white" : ""}`} />
                      {item.isPopular ? "Popular Post" : "Make Popular"}
                    </button>

                    {/* Preview link */}
                    <Link
                      href={getPreviewUrl(item)}
                      target="_blank"
                      className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black transition"
                      title="Preview live"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>

                    {/* Flash saved message */}
                    {flashId === item.id && (
                      <div className="absolute inset-0 bg-green-500/30 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-green-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow">
                          ✓ Saved &amp; Updated
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col space-y-3">
                    {/* Meta row */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400">
                      <span className="bg-[#cc0000]/10 text-[#cc0000] font-bold px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> {item.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-sm font-bold text-gray-900 leading-snug group-hover:text-[#cc0000] transition-colors">
                      {item.title}
                    </h3>

                    {/* Subheading / Excerpt */}
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                      {item.excerpt}
                    </p>

                    {item.author && (
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <User className="size-3" /> {item.author}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-100 text-xs font-bold text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => openDelete(item)}
                        className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Card Button */}
              <button
                onClick={openAdd}
                className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[260px] cursor-pointer"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors">
                  <Plus className="size-6" />
                </span>
                <span className="text-sm font-bold">Add New Post</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ─── Table View ────────────────────────────────────────────────────── */}
      {view === "table" && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase text-gray-500">Title</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase text-gray-500">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase text-gray-500">Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase text-gray-500">Popular</th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-[#cc0000]/10 px-2.5 py-0.5 text-xs font-bold text-[#cc0000]">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{item.date}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => togglePopular(item)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer ${
                          item.isPopular ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.isPopular ? "★ Popular" : "☆ No"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={getPreviewUrl(item)} target="_blank" className="p-1.5 text-gray-400 hover:text-[#cc0000]">
                          <ExternalLink className="size-4" />
                        </Link>
                        <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 cursor-pointer">
                          <Pencil className="size-4" />
                        </button>
                        <button onClick={() => openDelete(item)} className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Modal ───────────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {SECTIONS.find((s) => s.key === activeSection)?.label}
                </p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {modal === "add" ? "Add New Blog / Post" : "Edit Post"}
                </h2>
              </div>
              <button onClick={() => setModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Cover Image</label>
                {form.image ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image: "" }))}
                      className="absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                    <ImageIcon className="size-6 text-gray-300" />
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full cursor-pointer border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl py-2 text-xs font-bold text-gray-700 transition">
                  <Upload className="size-4" /> Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
                </label>
                {uploading && <p className="text-xs text-gray-400">Processing image…</p>}
                {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="or paste image URL, e.g. /news-innovation.png"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-[#cc0000]"
                />
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Post Title <span className="text-[#cc0000]">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Enter title"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              {/* Excerpt / Subheading */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Subheading / Excerpt <span className="text-[#cc0000]">*</span></label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Short description..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] resize-none"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  >
                    {(activeSection === "announcements" ? ANNOUNCEMENT_CATEGORIES : KNOWLEDGE_CATEGORIES).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Date</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    placeholder="e.g. Jul 12, 2026"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              {/* Popular Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))}
                    className="size-4 accent-amber-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">Feature in Popular Posts sidebar</span>
                    <span className="text-[10px] text-amber-700 block">Displays this blog in the dark Popular Posts sidebar across pages.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setModal(null)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.title.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" />
                {modal === "add" ? "Add Post" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Modal ──────────────────────────────────────────────────── */}
      {modal === "delete" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Post?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedItem.title}&rdquo;
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
