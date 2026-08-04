"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  HelpCircle, Plus, Pencil, Trash2, X, Save, Search, LayoutGrid, List, AlertTriangle, ExternalLink, Filter, CheckCircle
} from "lucide-react"
import {
  getFaqs, saveFaq, updateFaq, deleteFaq
} from "@/lib/cms-store"
import type { FaqItem, FaqCategory } from "@/lib/data"

const CATEGORIES: FaqCategory[] = ["Knowledge Centre", "Marketing Campaigns", "General"]

const EMPTY_FAQ: Omit<FaqItem, "id"> = {
  question: "",
  answer: "",
  category: "Knowledge Centre",
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [catFilter, setCatFilter] = useState<string>("all")
  const [search, setSearch] = useState<string>("")
  const [view, setView] = useState<"cards" | "table">("cards")

  // Modal
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FAQ>({ ...EMPTY_FAQ })

  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setFaqs(getFaqs())
  }, [])

  useEffect(() => { reload() }, [reload])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  const filtered = faqs.filter((item) => {
    const matchCat = catFilter === "all" || item.category === catFilter
    const matchSearch =
      search.trim() === "" ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function openAdd() {
    setSelectedFaq(null)
    setForm({
      question: "",
      answer: "",
      category: catFilter !== "all" ? (catFilter as FaqCategory) : "Knowledge Centre",
    })
    setModal("add")
  }

  function openEdit(item: FaqItem) {
    setSelectedFaq(item)
    setForm({
      question: item.question,
      answer: item.answer,
      category: item.category,
    })
    setModal("edit")
  }

  function openDelete(item: FaqItem) {
    setSelectedFaq(item)
    setModal("delete")
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) return
    setSaving(true)

    if (modal === "add") {
      const created = saveFaq(form)
      reload()
      flash(created.id)
    } else if (modal === "edit" && selectedFaq) {
      updateFaq(selectedFaq.id, form)
      reload()
      flash(selectedFaq.id)
    }

    setSaving(false)
    setModal(null)
  }

  function handleDelete() {
    if (!selectedFaq) return
    deleteFaq(selectedFaq.id)
    reload()
    setModal(null)
  }

  function getBadgeColor(cat: FaqCategory) {
    switch (cat) {
      case "Knowledge Centre":
        return "bg-red-50 text-[#E60012] border-red-200"
      case "Marketing Campaigns":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
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
              Information &amp; Help
            </span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <HelpCircle className="size-5 text-[#E60012]" /> FAQ Management
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Add, edit, and organize frequently asked questions across Knowledge Centre and Marketing Campaigns.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Link
            href="/knowledge-centre"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            <ExternalLink className="size-4" /> View Knowledge Centre
          </Link>
          <button
            onClick={() => setView((v) => (v === "cards" ? "table" : "cards"))}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            {view === "cards" ? <><List className="size-4" /> Table View</> : <><LayoutGrid className="size-4" /> Card View</>}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="size-4" /> Add New FAQ
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Filter className="size-3.5" /> Category:
          </span>
          <button
            onClick={() => setCatFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center ${
              catFilter === "all"
                ? "bg-[#E60012] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>All FAQs</span>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1.5 ${
              catFilter === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
            }`}>
              {faqs.length}
            </span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = faqs.filter((f) => f.category === cat).length
            const isActive = catFilter === cat
            return (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center ${
                  isActive
                    ? "bg-[#E60012] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1.5 ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs by question or answer…"
            className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#cc0000]"
          />
        </div>
      </div>

      {/* Grid or Table View */}
      {view === "cards" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const isFlashed = flashId === item.id

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                  isFlashed ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">#{item.id}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-sm font-black text-gray-900 leading-snug flex items-start gap-2">
                      <HelpCircle className="size-4 text-[#cc0000] shrink-0 mt-0.5" />
                      <span>{item.question}</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 line-clamp-4">
                      {item.answer}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-900 text-xs font-bold hover:bg-black hover:text-white transition cursor-pointer"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => openDelete(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </div>
            )
          })}

          <button
            onClick={openAdd}
            className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[220px] cursor-pointer"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors">
              <Plus className="size-6" />
            </span>
            <span className="text-sm font-bold">Add New FAQ</span>
          </button>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-950 text-white border-b border-gray-800">
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Question</th>
                <th className="p-4 font-bold">Answer Snippet</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900 max-w-xs">{item.question}</td>
                  <td className="p-4 text-gray-600 max-w-sm line-clamp-2">{item.answer}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"><Pencil className="size-3.5" /></button>
                      <button onClick={() => openDelete(item)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"><Trash2 className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── ADD/EDIT FAQ MODAL ────────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">FAQ Item</p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {modal === "add" ? "Add New FAQ" : "Edit FAQ Item"}
                </h2>
              </div>
              <button onClick={() => setModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Category Area *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FaqCategory }))}
                  className="w-full border rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 bg-white outline-none focus:border-[#cc0000]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Question *</label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="e.g. Who can use these campaign assets?"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Detailed Answer *</label>
                <textarea
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                  placeholder="Provide clear, concise answer instructions..."
                  className="w-full border rounded-xl px-4 py-2.5 text-xs text-gray-800 leading-relaxed outline-none focus:border-[#cc0000] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.question.trim() || !form.answer.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === "delete" && selectedFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete FAQ Item?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedFaq.question}&rdquo;
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete FAQ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
