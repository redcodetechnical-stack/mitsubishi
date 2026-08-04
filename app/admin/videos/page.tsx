"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Video, Play, Pencil, X, Save, Upload, Home, Megaphone, Mail, BookOpen, Plus, Trash2, AlertTriangle, List, LayoutGrid } from "lucide-react"
import { getVideos, updateVideo, addVideo, deleteVideo, type VideoItem } from "@/lib/cms-store"

type Section = VideoItem["section"]

const SECTIONS: { key: Section; label: string; icon: React.ElementType; color: string }[] = [
  { key: "home", label: "Home – Featured Videos", icon: Home, color: "bg-[#E60012]" },
  { key: "campaigns", label: "Marketing Campaigns", icon: Megaphone, color: "bg-black" },
  { key: "communications", label: "Corporate Communications", icon: Mail, color: "bg-[#E60012]" },
  { key: "knowledge-centre", label: "Knowledge Centre", icon: BookOpen, color: "bg-gray-800" },
]

const SECTION_LABEL: Record<Section, string> = {
  home: "Home – Featured Videos",
  campaigns: "Marketing Campaigns",
  communications: "Corporate Communications",
  "knowledge-centre": "Knowledge Centre",
}

const EMPTY_FORM = {
  title: "",
  description: "",
  duration: "",
  category: "",
  image: "",
}

export default function AdminVideosPage() {
  const [activeSection, setActiveSection] = useState<Section>("home")
  const [allVideos, setAllVideos] = useState<VideoItem[]>([])
  const [view, setView] = useState<"cards" | "table">("table")
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<VideoItem | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => setAllVideos(getVideos()), [])
  useEffect(() => { reload() }, [reload])

  const sectionVideos = allVideos.filter((v) => v.section === activeSection)
  const activeSecMeta = SECTIONS.find((s) => s.key === activeSection)!

  function openAdd() {
    setSelected(null)
    setForm({ ...EMPTY_FORM })
    setModal("add")
  }

  function openEdit(v: VideoItem) {
    setSelected(v)
    setForm({ title: v.title, description: v.description, duration: v.duration, category: v.category, image: v.image })
    setModal("edit")
  }

  function openDelete(v: VideoItem) {
    setSelected(v)
    setModal("delete")
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
    setForm({ ...EMPTY_FORM })
  }

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    if (modal === "add") {
      const v = addVideo({
        section: activeSection,
        sectionLabel: SECTION_LABEL[activeSection],
        title: form.title,
        description: form.description,
        duration: form.duration,
        category: form.category,
        image: form.image || "/video-brandfilm.png",
      })
      reload()
      flash(v.id)
    } else if (modal === "edit" && selected) {
      updateVideo(selected.id, { ...form })
      reload()
      flash(selected.id)
    }
    setSaving(false)
    closeModal()
  }

  function handleDelete() {
    if (!selected) return
    deleteVideo(selected.id)
    reload()
    closeModal()
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Executive Red & Black Textured Header Bar */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-4 px-6 lg:py-5 lg:px-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-red-900/40"
          style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
        >
          <div className="relative space-y-1 max-w-2xl z-10">
            <div className="flex items-center gap-2">
              <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-white/15">
                Media Management
              </span>
              <span className="text-gray-300 text-xs font-semibold">• Video Gallery Store</span>
            </div>
            <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
              <Video className="size-6 text-[#E60012]" /> Video Management
            </h1>
            <p className="text-xs text-gray-200 leading-relaxed">
              Add, edit, categorise, or remove brand videos across all sections of the platform.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <Plus className="size-4" /> Add Video
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const isActive = activeSection === s.key
            const count = allVideos.filter((v) => v.section === s.key).length
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-all ${
                  isActive
                    ? "border-[#cc0000] text-[#cc0000] bg-white shadow-sm"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <Icon className="size-4" />
                {s.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full text-white ${isActive ? "bg-[#cc0000]" : "bg-gray-400"}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Video Cards or Table View */}
        {sectionVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400 space-y-3 bg-white rounded-2xl border border-gray-200">
            <Play className="size-12 opacity-30 text-[#E60012]" />
            <p className="font-bold text-sm text-gray-700">No videos in this section yet.</p>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-[#E60012] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#c40010] transition"
            >
              <Plus className="size-4" /> Add First Video
            </button>
          </div>
        ) : view === "table" ? (
          /* High-Density Executive Table View */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-black text-white border-b border-gray-800 uppercase tracking-wider text-[11px] font-black">
                    <th className="py-3.5 px-4 font-bold">Video Thumbnail</th>
                    <th className="py-3.5 px-4 font-bold">Section &amp; Slot</th>
                    <th className="py-3.5 px-4 font-bold">Video Title &amp; Details</th>
                    <th className="py-3.5 px-4 font-bold">Category &amp; Duration</th>
                    <th className="py-3.5 px-4 font-bold text-center">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {sectionVideos.map((vid, i) => {
                    const isFlashed = flashId === vid.id

                    return (
                      <tr 
                        key={vid.id} 
                        className={`hover:bg-red-50/30 transition-colors ${
                          isFlashed ? "bg-green-50/80" : ""
                        }`}
                      >
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="relative h-12 w-20 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm shrink-0 group">
                            {vid.image ? (
                              <Image 
                                src={vid.image} 
                                alt="" 
                                fill 
                                className="object-cover" 
                                unoptimized={vid.image.startsWith("data:")} 
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                No Image
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="size-4 text-white" fill="currentColor" />
                            </div>
                          </div>
                        </td>

                        {/* Section & Slot */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span className="inline-block bg-red-50 text-[#E60012] px-2.5 py-0.5 rounded-md text-[10px] font-black border border-red-100 uppercase tracking-wider">
                              {SECTION_LABEL[vid.section]}
                            </span>
                            <p className="text-[10px] text-gray-500 font-bold">
                              Slot #{i + 1}
                            </p>
                          </div>
                        </td>

                        {/* Title & Description */}
                        <td className="py-3 px-4 max-w-md">
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-1">
                              {vid.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              {vid.description}
                            </p>
                          </div>
                        </td>

                        {/* Category & Duration */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              {vid.category || "General"}
                            </span>
                            {vid.duration && (
                              <p className="text-[10px] text-gray-500 font-bold">
                                ⏱ {vid.duration}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Live Status Pill */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-green-200">
                            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                            Published
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(vid)}
                              className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                              title="Edit Video"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              onClick={() => openDelete(vid)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                              title="Delete Video"
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
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sectionVideos.map((vid, i) => (
              <div
                key={vid.id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  {vid.image ? (
                    <Image
                      src={vid.image}
                      alt={vid.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={vid.image.startsWith("data:")}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <Play className="size-10 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-[#E60012]/90 text-white shadow-lg">
                      <Play className="size-5 translate-x-0.5" fill="currentColor" />
                    </span>
                  </div>

                  {/* Slot badge */}
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Slot {i + 1}
                  </div>

                  {/* Duration badge */}
                  {vid.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {vid.duration}
                    </div>
                  )}

                  {/* Saved flash */}
                  {flashId === vid.id && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                        ✓ Saved
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-red-50 text-[#E60012] text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 border border-red-100">
                        {vid.category || "General"}
                      </span>
                      <h3 className="font-display text-sm font-black text-gray-900 leading-snug line-clamp-2">
                        {vid.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                        {vid.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => openEdit(vid)}
                        className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-[#E60012] transition-colors"
                        title="Edit video"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => openDelete(vid)}
                        className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Video Card */}
            <button
              onClick={openAdd}
              className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#E60012] text-gray-400 hover:text-[#E60012] transition-all min-h-[220px] cursor-pointer"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#E60012]/10 transition-colors">
                <Plus className="size-6 text-[#E60012]" />
              </span>
              <span className="text-xs font-bold">Add New Video</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── Add / Edit Modal ─────────────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {activeSecMeta.label}
                </p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {modal === "add" ? "Add New Video" : "Edit Video"}
                </h2>
              </div>
              <button onClick={closeModal} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4 max-h-[68vh] overflow-y-auto">

              {/* Section selector (only in add mode) */}
              {modal === "add" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Page Section</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTIONS.map((s) => {
                      const Icon = s.icon
                      const isActive = activeSection === s.key
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setActiveSection(s.key)}
                          className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all text-left ${
                            isActive
                              ? "border-[#cc0000] bg-[#cc0000]/5 text-[#cc0000]"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="size-4 shrink-0" />
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Thumbnail preview + upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Thumbnail Image</label>
                <div className="relative aspect-video w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {form.image ? (
                    <Image
                      src={form.image}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                      unoptimized={form.image.startsWith("data:")}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Play className="size-10" />
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl py-3 text-xs font-semibold text-gray-500 hover:text-[#cc0000] transition-colors">
                  <Upload className="size-4" />
                  Upload thumbnail
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Video Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Enter video title"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown under the video card"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition resize-none"
                />
              </div>

              {/* Duration & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 3:45"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. Corporate"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000] disabled:opacity-50"
              >
                <Save className="size-4" />
                {saving ? "Saving…" : modal === "add" ? "Add Video" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="size-5 text-red-600" />
                </span>
                <div>
                  <h2 className="font-display text-base font-black text-gray-900">Delete Video?</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    This will permanently remove <span className="font-bold text-gray-800">&ldquo;{selected.title}&rdquo;</span> from{" "}
                    <span className="font-bold text-gray-800">{selected.sectionLabel}</span>.
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Thumbnail preview in confirm */}
              {selected.image && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100">
                  <Image src={selected.image} alt={selected.title} fill className="object-cover opacity-60" unoptimized={selected.image.startsWith("data:")} />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700"
              >
                <Trash2 className="size-4" />
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
