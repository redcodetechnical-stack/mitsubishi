"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Pencil, Trash2, Plus, LayoutGrid, List,
  ExternalLink, Calendar, X, AlertTriangle, Image as ImageIcon, Mail
} from "lucide-react"
import { getNewsletters, saveNewsletter, updateNewsletter, deleteNewsletter } from "@/lib/cms-store"
import type { NewsletterItem } from "@/lib/data"

const FALLBACK_IMAGES = ["/news-innovation.png", "/event-townhall.png", "/video-brandfilm.png"]
function fallbackImg(i: number) { return FALLBACK_IMAGES[i % FALLBACK_IMAGES.length] }

type Form = {
  title: string; issue: string; date: string;
  description: string; fileSize: string; downloads: number; image: string
}

const EMPTY_FORM: Form = {
  title: "", issue: "", date: "",
  description: "", fileSize: "", downloads: 0, image: ""
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

export default function AdminCommunicationsPage() {
  const [data, setData] = useState<NewsletterItem[]>([])
  const [view, setView] = useState<"cards" | "table">("cards")
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<NewsletterItem | null>(null)
  const [form, setForm] = useState<Form>(EMPTY_FORM)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")

  const load = useCallback(() => setData(getNewsletters()), [])
  useEffect(() => { load() }, [load])

  function openAdd() { setForm(EMPTY_FORM); setSelected(null); setModal("add") }
  function openEdit(item: NewsletterItem) {
    setForm({
      title: item.title, issue: item.issue || "", date: item.date || "",
      description: item.description || "", fileSize: item.fileSize || "",
      downloads: item.downloads ?? 0, image: item.image || ""
    })
    setSelected(item); setModal("edit")
  }
  function openDelete(item: NewsletterItem) { setSelected(item); setModal("delete") }

  function handleSubmit() {
    if (modal === "add") saveNewsletter(form as Omit<NewsletterItem, "id">)
    else if (modal === "edit" && selected) updateNewsletter(selected.id, form)
    setModal(null); setSelected(null); load()
  }

  function handleDelete() {
    if (selected) deleteNewsletter(selected.id)
    setModal(null); setSelected(null); load()
  }

  async function handleImage(file: File | undefined) {
    if (!file) return
    setUploadError(null); setUploading(true)
    try {
      const url = await compressImageFile(file)
      setForm(f => ({ ...f, image: url }))
    } catch { setUploadError("Could not process image. Try a JPG or PNG.") }
    finally { setUploading(false) }
  }

  const filtered = data.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.issue || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Executive Red & Black Textured Header Bar */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-4 px-6 lg:py-5 lg:px-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-red-900/40"
        style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
      >
        <div className="relative space-y-1 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/15 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#E60012] animate-ping" />
              Internal Comms
            </span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <Mail className="size-5 text-[#E60012]" /> Communications
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Manage newsletters and internal communications.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => setView(v => v === "cards" ? "table" : "cards")}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            {view === "cards" ? <><List className="size-4" /> Table View</> : <><LayoutGrid className="size-4" /> Card View</>}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="size-4" /> Add New
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search newsletters..."
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20"
      />

      {/* ── Card View ── */}
      {view === "cards" && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
                <Mail className="size-8 text-cyan-400" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">No newsletters found</h3>
              <p className="text-sm text-gray-500 mt-1">Add your first newsletter to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#cc0000]/40 hover:shadow-md transition-all group flex flex-col">
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image || fallbackImg(i)} alt={item.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={(item.image || "").startsWith("data:")}
                    />
                    {item.issue && (
                      <span className="absolute top-3 left-3 bg-[#cc0000] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                        {item.issue}
                      </span>
                    )}
                    <Link
                      href="/communications" target="_blank"
                      className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black transition"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col space-y-3">
                    {/* Date */}
                    {item.date && (
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
                        <Calendar className="size-3" /> {item.date}
                        {item.fileSize && <span className="ml-auto text-gray-300">{item.fileSize}</span>}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display text-sm font-bold text-gray-900 leading-snug group-hover:text-[#cc0000] transition-colors">
                      {item.title}
                    </h3>

                    {/* Subheading / Description */}
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{item.description}</p>

                    {item.downloads != null && (
                      <p className="text-[10px] text-gray-400">{item.downloads} downloads</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-100 text-xs font-bold text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => openDelete(item)}
                        className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Table View ── */}
      {view === "table" && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Title","Issue","Date","File Size","Downloads",""].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">No newsletters found.</td></tr>
                ) : filtered.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 max-w-[200px] truncate">{n.title}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{n.issue || "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{n.date || "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{n.fileSize || "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{n.downloads ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/communications" target="_blank" className="rounded-lg p-2 text-gray-400 hover:text-[#cc0000]"><ExternalLink className="size-4" /></Link>
                        <button onClick={() => openEdit(n)} className="rounded-lg p-2 text-gray-400 hover:text-blue-600 cursor-pointer"><Pencil className="size-4" /></button>
                        <button onClick={() => openDelete(n)} className="rounded-lg p-2 text-gray-400 hover:text-red-600 cursor-pointer"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">{modal === "add" ? "Add New Newsletter" : "Edit Newsletter"}</h3>
              <button onClick={() => setModal(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 cursor-pointer"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Image</label>
                {form.image ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setForm(f => ({ ...f, image: "" }))} className="absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80 cursor-pointer"><X className="size-3.5" /></button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center mb-2">
                    <ImageIcon className="size-6 text-gray-300" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e => handleImage(e.target.files?.[0])}
                  className="w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-bold cursor-pointer" />
                {uploading && <p className="text-xs text-gray-400 mt-1">Processing…</p>}
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
                <input type="text" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="or paste image URL, e.g. /news-innovation.png"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-[#cc0000]" />
              </div>
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title <span className="text-[#cc0000]">*</span></label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Newsletter title"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]" />
              </div>
              {/* Subheading / Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Subheading / Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#cc0000] resize-none" />
              </div>
              {/* Issue & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Issue <span className="text-[#cc0000]">*</span></label>
                  <input value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} placeholder="e.g. Vol. 8, Issue 2"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Date <span className="text-[#cc0000]">*</span></label>
                  <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="e.g. Jul 2, 2026"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]" />
                </div>
              </div>
              {/* File Size & Downloads */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">File Size</label>
                  <input value={form.fileSize} onChange={e => setForm(f => ({ ...f, fileSize: e.target.value }))} placeholder="e.g. 8.9 MB"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Downloads</label>
                  <input type="number" value={form.downloads} onChange={e => setForm(f => ({ ...f, downloads: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 rounded-xl bg-[#cc0000] py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer">{modal === "add" ? "Add Newsletter" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {modal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <h3 className="text-base font-black text-gray-900 text-center mb-2">Delete newsletter?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">&ldquo;{selected?.title}&rdquo;</p>
            <p className="text-xs text-gray-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
