"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Plus, Pencil, Trash2, X, Save, Upload, AlertTriangle, Quote, Users
} from "lucide-react"
import {
  getEmployeeStories, saveEmployeeStory, updateEmployeeStory, deleteEmployeeStory,
  type EmployeeStory
} from "@/lib/cms-store"

const EMPTY_FORM = { author: "", role: "", avatar: "", quote: "" }

export default function AdminEmployeeStoriesPage() {
  const [stories, setStories] = useState<EmployeeStory[]>([])
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<EmployeeStory | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => setStories(getEmployeeStories()), [])
  useEffect(() => { reload() }, [reload])

  function openAdd() {
    setSelected(null)
    setForm({ ...EMPTY_FORM })
    setModal("add")
  }

  function openEdit(s: EmployeeStory) {
    setSelected(s)
    setForm({ author: s.author, role: s.role, avatar: s.avatar, quote: s.quote })
    setModal("edit")
  }

  function openDelete(s: EmployeeStory) {
    setSelected(s)
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

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, avatar: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!form.author.trim()) return
    setSaving(true)
    if (modal === "add") {
      const s = saveEmployeeStory({ ...form, avatar: form.avatar || "/leader-ceo.png" })
      reload()
      flash(s.id)
    } else if (modal === "edit" && selected) {
      updateEmployeeStory(selected.id, { ...form })
      reload()
      flash(selected.id)
    }
    setSaving(false)
    closeModal()
  }

  function handleDelete() {
    if (!selected) return
    deleteEmployeeStory(selected.id)
    reload()
    closeModal()
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Executive Red & Black Textured Header Bar */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-4 px-6 lg:py-5 lg:px-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-red-900/40"
          style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
        >
          <div className="relative space-y-1 max-w-xl z-10">
            <div className="flex items-center gap-2">
              <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/15 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#E60012] animate-ping" />
                Stories &amp; Voices
              </span>
            </div>
            <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
              <Users className="size-5 text-[#E60012]" /> Employee Stories
            </h1>
            <p className="text-xs text-gray-200 leading-snug">
              Manage testimonials shown on the Corporate Communications page.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <Plus className="size-4" /> Add Story
            </button>
          </div>
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400 space-y-3">
            <Users className="size-12 opacity-30" />
            <p className="font-bold text-sm">No employee stories yet.</p>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#a80000]"
            >
              <Plus className="size-4" /> Add First Story
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div
                key={story.id}
                className={`group relative bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${
                  flashId === story.id ? "border-green-400 ring-2 ring-green-300/50" : "border-gray-200"
                }`}
              >
                {/* Top red accent bar */}
                <div className="relative bg-[#cc0000] text-white p-5 flex items-start gap-4">
                  <div className="relative size-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                    {story.avatar ? (
                      <Image
                        src={story.avatar}
                        alt={story.author}
                        fill
                        className="object-cover"
                        unoptimized={story.avatar.startsWith("data:")}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/20 flex items-center justify-center text-white font-black text-lg">
                        {story.author.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-black text-white leading-tight">{story.author}</p>
                    <p className="text-[11px] text-white/70 mt-0.5">{story.role}</p>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => openEdit(story)}
                      className="flex size-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => openDelete(story)}
                      className="flex size-7 items-center justify-center rounded-lg bg-white/10 hover:bg-red-500/50 text-white transition"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quote */}
                <div className="p-5 relative">
                  <Quote className="size-6 text-[#cc0000]/20 mb-2" />
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 italic">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                {/* Saved flash */}
                {flashId === story.id && (
                  <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center rounded-2xl pointer-events-none">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">✓ Saved</span>
                  </div>
                )}
              </div>
            ))}

            {/* Add card */}
            <button
              onClick={openAdd}
              className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[220px]"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors">
                <Plus className="size-6" />
              </span>
              <span className="text-sm font-bold">Add New Story</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── Add / Edit Modal ─────────────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">{modal === "add" ? "Add New Story" : "Edit Story"}</h2>
              <button onClick={closeModal} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Avatar upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="relative size-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shrink-0">
                    {form.avatar ? (
                      <Image src={form.avatar} alt="Preview" fill className="object-cover" unoptimized={form.avatar.startsWith("data:")} />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-black">
                        {form.author?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#cc0000] transition-colors">
                    <Upload className="size-4" />
                    Upload photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="e.g. Priyanka Bajaj"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Role / Designation</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. Chief Executive Officer"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition"
                />
              </div>

              {/* Quote */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Quote / Testimonial</label>
                <textarea
                  rows={4}
                  value={form.quote}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  placeholder="What they said about Nexus Hub..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.author.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000] disabled:opacity-50"
              >
                <Save className="size-4" />
                {saving ? "Saving…" : modal === "add" ? "Add Story" : "Save Changes"}
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
                  <h2 className="font-display text-base font-black text-gray-900">Delete Story?</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    This will permanently remove{" "}
                    <span className="font-bold text-gray-800">&ldquo;{selected.author}&rdquo;</span>&apos;s story.
                    This cannot be undone.
                  </p>
                </div>
              </div>
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
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
