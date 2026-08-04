"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Images, Plus, Pencil, Trash2, X, Save, Upload, Search, LayoutGrid, List, AlertTriangle, ExternalLink, Filter, Layers, CheckCircle
} from "lucide-react"
import {
  getBanners, saveBanner, updateBanner, deleteBanner, type PageBanner
} from "@/lib/cms-store"

const PAGES_CONFIG: { key: string; label: string; href: string }[] = [
  { key: "home", label: "Home Page", href: "/" },
  { key: "announcements", label: "Corporate Announcements", href: "/announcements" },
  { key: "campaigns", label: "Marketing Campaigns", href: "/campaigns" },
  { key: "brand-centre", label: "Brand Centre", href: "/brand-centre" },
  { key: "communications", label: "Corporate Communications", href: "/communications" },
  { key: "events", label: "Events", href: "/events" },
  { key: "marketing-assets", label: "Marketing Assets", href: "/marketing-assets" },
  { key: "knowledge-centre", label: "Knowledge Centre", href: "/knowledge-centre" },
  { key: "about", label: "About the Hub", href: "/about" },
  { key: "contact", label: "Contact Us", href: "/contact" },
  { key: "search", label: "Search & Discovery", href: "/search" },
  { key: "policies", label: "Policies & Guidelines", href: "/policies" },
]

const EMPTY_BANNER: Omit<PageBanner, "id"> = {
  pageKey: "home",
  pageName: "Home Page",
  title: "",
  subtitle: "",
  image: "/news-innovation.png",
  displayOrder: 1,
  badge: "Primary Banner",
  isActive: true,
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<PageBanner[]>([])
  const [selectedPage, setSelectedPage] = useState<string>("all")
  const [search, setSearch] = useState<string>("")
  const [view, setView] = useState<"cards" | "table">("table")

  // Modal State
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedBanner, setSelectedBanner] = useState<PageBanner | null>(null)
  const [form, setForm] = useState<typeof EMPTY_BANNER>({ ...EMPTY_BANNER })

  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setBanners(getBanners())
  }, [])

  useEffect(() => { reload() }, [reload])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  const filtered = banners.filter((b) => {
    const matchPage = selectedPage === "all" || b.pageKey === selectedPage
    const matchSearch =
      search.trim() === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.pageName.toLowerCase().includes(search.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(search.toLowerCase())
    return matchPage && matchSearch
  })

  function openAdd(pageKey = "home") {
    const pageCfg = PAGES_CONFIG.find((p) => p.key === pageKey) || PAGES_CONFIG[0]
    const existingCount = banners.filter((b) => b.pageKey === pageCfg.key).length

    setSelectedBanner(null)
    setForm({
      pageKey: pageCfg.key,
      pageName: pageCfg.label,
      title: "",
      subtitle: "",
      image: "/news-innovation.png",
      displayOrder: existingCount + 1,
      badge: existingCount === 0 ? "Primary Banner" : `Banner #${existingCount + 1}`,
      isActive: true,
    })
    setModal("add")
  }

  function openEdit(item: PageBanner) {
    setSelectedBanner(item)
    setForm({
      pageKey: item.pageKey || "home",
      pageName: item.pageName,
      title: item.title,
      subtitle: item.subtitle,
      image: item.image || "/news-innovation.png",
      displayOrder: item.displayOrder || 1,
      badge: item.badge || "Primary Banner",
      isActive: item.isActive ?? true,
    })
    setModal("edit")
  }

  function openDelete(item: PageBanner) {
    setSelectedBanner(item)
    setModal("delete")
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)

    const pageCfg = PAGES_CONFIG.find((p) => p.key === form.pageKey)
    const pageName = pageCfg ? pageCfg.label : form.pageName

    const payload = { ...form, pageName }

    if (modal === "add") {
      const created = saveBanner(payload)
      reload()
      flash(created.id)
    } else if (modal === "edit" && selectedBanner) {
      updateBanner(selectedBanner.id, payload)
      reload()
      flash(selectedBanner.id)
    }

    setSaving(false)
    setModal(null)
  }

  function handleDelete() {
    if (!selectedBanner) return
    deleteBanner(selectedBanner.id)
    reload()
    setModal(null)
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
              Content Management
            </span>
            <span className="text-gray-300 text-xs font-semibold">• 12 Platform Pages</span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <Images className="size-5 text-[#E60012]" /> Multi-Banner Management
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Configure single or multi-hero banner carousels across all 12 portal pages with real-time display ordering.
          </p>
        </div>

        {/* Action Control */}
        <div className="relative z-10">
          <button
            onClick={() => openAdd(selectedPage !== "all" ? selectedPage : "home")}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="size-4" /> Add Banner
          </button>
        </div>
      </div>

      {/* Filter Bar — 12 Pages */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
            <Filter className="size-3.5 text-[#E60012]" /> Select Page Filter (12 Pages):
          </span>
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search banners by title or page…"
              className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#E60012]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
          <button
            onClick={() => setSelectedPage("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedPage === "all"
                ? "bg-[#E60012] text-white border-[#E60012] shadow-md shadow-red-600/20"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
            }`}
          >
            All Pages ({banners.length})
          </button>

          {PAGES_CONFIG.map((p) => {
            const pageBannersCount = banners.filter((b) => b.pageKey === p.key).length
            const isSelected = selectedPage === p.key

            return (
              <button
                key={p.key}
                onClick={() => setSelectedPage(p.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#E60012] text-white border-[#E60012] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                  {pageBannersCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Grid or Table View */}
      {view === "cards" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const isFlashed = flashId === item.id
            const pageCfg = PAGES_CONFIG.find((p) => p.key === item.pageKey)

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isFlashed ? "border-green-400 ring-2 ring-green-200" : "border-gray-200 hover:border-[#E60012]/50"
                }`}
              >
                <div>
                  {/* Banner Image Preview Header */}
                  <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden group">
                    {item.image ? (
                      <Image src={item.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={item.image.startsWith("data:")} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xs">
                        No Banner Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-[#E60012] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                        {item.pageName}
                      </span>
                      {item.displayOrder && (
                        <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/20">
                          Banner #{item.displayOrder}
                        </span>
                      )}
                    </div>

                    {pageCfg && (
                      <Link
                        href={pageCfg.href}
                        target="_blank"
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-[#E60012] transition"
                        title="View Public Page"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-base font-bold text-gray-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Footer Controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                    <Layers className="size-3.5 text-[#E60012]" /> ID: {item.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-900 text-xs font-bold hover:bg-black hover:text-white transition cursor-pointer"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => openDelete(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={() => openAdd(selectedPage !== "all" ? selectedPage : "home")}
            className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#E60012] text-gray-400 hover:text-[#E60012] transition-all min-h-[260px] cursor-pointer"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#E60012]/10 transition-colors">
              <Plus className="size-6 text-[#E60012]" />
            </span>
            <span className="text-xs font-bold">Add Banner to {selectedPage !== "all" ? PAGES_CONFIG.find(p=>p.key===selectedPage)?.label : "Page"}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* High-Density Executive Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black text-white border-b border-gray-800 uppercase tracking-wider text-[11px] font-black">
                  <th className="py-3.5 px-4 font-bold">Banner Preview</th>
                  <th className="py-3.5 px-4 font-bold">Target Page</th>
                  <th className="py-3.5 px-4 font-bold">Order</th>
                  <th className="py-3.5 px-4 font-bold">Banner Heading &amp; Details</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map((item) => {
                  const pageCfg = PAGES_CONFIG.find((p) => p.key === item.pageKey)
                  const isFlashed = flashId === item.id

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-red-50/30 transition-colors ${
                        isFlashed ? "bg-green-50/80" : ""
                      }`}
                    >
                      {/* Banner Image Preview */}
                      <td className="py-3 px-4">
                        <div className="relative h-12 w-20 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm shrink-0">
                          {item.image ? (
                            <Image 
                              src={item.image} 
                              alt="" 
                              fill 
                              className="object-cover" 
                              unoptimized={item.image.startsWith("data:")} 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Target Page Badge & Link */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-block bg-red-50 text-[#E60012] px-2.5 py-1 rounded-lg text-[11px] font-black border border-red-100 uppercase tracking-wider">
                            {item.pageName}
                          </span>
                          {pageCfg && (
                            <p className="text-[10px] text-gray-400 font-mono">
                              Path: {pageCfg.href}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Order Badge */}
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <span className="bg-black text-white px-2.5 py-1 rounded-md text-[11px] font-black shadow-sm">
                          #{item.displayOrder || 1}
                        </span>
                      </td>

                      {/* Title & Subtitle */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {item.subtitle}
                          </p>
                        </div>
                      </td>

                      {/* Live Status Pill */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-green-200">
                          <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                          Active
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pageCfg && (
                            <Link
                              href={pageCfg.href}
                              target="_blank"
                              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition cursor-pointer"
                              title="View Live Page"
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                            title="Edit Banner"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => openDelete(item)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                            title="Delete Banner"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT BANNER MODAL ─────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">Hero Banner Settings</p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {modal === "add" ? "Add Banner to Page" : "Edit Banner Details"}
                </h2>
              </div>
              <button onClick={() => setModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Target Page *</label>
                  <select
                    value={form.pageKey}
                    onChange={(e) => {
                      const key = e.target.value
                      const cfg = PAGES_CONFIG.find((p) => p.key === key)
                      setForm((f) => ({ ...f, pageKey: key, pageName: cfg ? cfg.label : key }))
                    }}
                    className="w-full border rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 bg-white outline-none focus:border-[#cc0000]"
                  >
                    {PAGES_CONFIG.map((p) => (
                      <option key={p.key} value={p.key}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Banner Order</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.displayOrder || 1}
                    onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-center text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Banner Heading / Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Find every asset, campaign, and update in one place"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Banner Paragraph / Subtitle *</label>
                <textarea
                  rows={3}
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Search approved brand assets, download collateral..."
                  className="w-full border rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:border-[#cc0000] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Banner Cover Image</label>
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
                  {form.image ? (
                    <Image src={form.image} alt="" fill className="object-cover" unoptimized={form.image.startsWith("data:")} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Images className="size-10 opacity-30" />
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl py-2.5 text-xs font-semibold text-gray-600 hover:text-[#cc0000] transition">
                  <Upload className="size-4" /> Upload Banner Cover Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const r = new FileReader()
                      r.onload = (ev) => setForm((f) => ({ ...f, image: ev.target?.result as string }))
                      r.readAsDataURL(file)
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 shrink-0">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === "delete" && selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Banner?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedBanner.title}&rdquo; ({selectedBanner.pageName})
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
