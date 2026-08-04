"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Home, Users, Quote, Mail, CheckSquare, Square, Layers, Trash,
  Plus, Pencil, Trash2, X, Save, Upload, AlertTriangle, CheckCircle, FilePlus
} from "lucide-react"
import {
  getSettings, saveSettingsData, defaultSettings, type SiteSettings,
  getLeaderMessages, saveLeaderMessage, updateLeaderMessage, deleteLeaderMessage,
  getEmployeeStories, saveEmployeeStory, updateEmployeeStory, deleteEmployeeStory,
  getNewsletters, saveNewsletter, updateNewsletter, deleteNewsletter,
  deleteMultipleNewsletters, saveMultipleNewsletters,
  type EmployeeStory,
} from "@/lib/cms-store"
import type { LeaderMessage, NewsletterItem } from "@/lib/data"

// ─── Types ──────────────────────────────────────────────────────────────────
type Tab = "home" | "leaders" | "stories" | "mailers"

const TABS: { key: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "home", label: "Home Page Message", icon: Home, desc: "Edit the leadership message shown on the homepage" },
  { key: "leaders", label: "Leadership Messages", icon: Users, desc: "Add, edit and delete messages shown on Corporate Communications" },
  { key: "stories", label: "Employee Stories", icon: Quote, desc: "Manage employee testimonials on Corporate Communications" },
  { key: "mailers", label: "Recent Internal Mailers", icon: Mail, desc: "Batch add, multi-select delete & manage internal mailers" },
]

// ─── Shared Modal Helpers ────────────────────────────────────────────────────
const EMPTY_LEADER = { name: "", role: "", image: "", subject: "", excerpt: "", date: "", readTime: "" }
const EMPTY_STORY  = { author: "", role: "", avatar: "", quote: "" }
const EMPTY_MAILER = {
  title: "",
  from: "Communications Team",
  to: "All Mitsubishi Electric Group Employees",
  issue: "ALL STAFF",
  date: "Jul 2, 2026",
  salutation: "Dear Team,",
  description: "",
  signoff: "Best regards,",
  division: "Corporate Communications Division · Group Communications",
  fileSize: "2.4 MB",
  pdfUrl: "",
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Field({ label, name, value, onChange, type = "text", placeholder, required }: {
  label: string; name: string; value: string; onChange: (k: string, v: string) => void
  type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#cc0000] focus:bg-white focus:ring-2 focus:ring-[#cc0000]/20 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#cc0000] focus:bg-white focus:ring-2 focus:ring-[#cc0000]/20"
        />
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 1 — Home Page Message
// ────────────────────────────────────────────────────────────────────────────
function HomeMessageTab() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setSettings(getSettings()) }, [])

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleImgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setSettings((p) => ({ ...p, leaderImage: ev.target?.result as string })); setSaved(false) }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    saveSettingsData(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const leaderImg = settings.leaderImage || "/leader-ceo.png"

  return (
    <div className="space-y-6">
      {/* Save Banner */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
          <CheckCircle className="size-4" /> Changes saved successfully.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900">Home Page — Leadership Message</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000]"
          >
            {saved ? <CheckCircle className="size-4" /> : <Save className="size-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
        <div className="p-6 space-y-6">

          {/* Leader photo preview + upload */}
          <div className="flex items-center gap-6">
            <div className="relative size-20 rounded-full overflow-hidden border-4 border-[#cc0000]/20 shrink-0 shadow-lg">
              <Image
                src={leaderImg} alt="Leader"
                fill className="object-cover"
                unoptimized={leaderImg.startsWith("data:")}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Leader Photo</p>
              <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#cc0000] transition-colors">
                <Upload className="size-4" />
                Upload new photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImgUpload} />
              </label>
            </div>
          </div>

          {/* Name + Role */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Leader Name" name="leaderName" value={settings.leaderName} onChange={handleChange} placeholder="Full name" />
            <Field label="Role / Title" name="leaderRole" value={settings.leaderRole} onChange={handleChange} placeholder="e.g. Group CEO" />
          </div>

          {/* Heading (featuredCampaignTitle) */}
          <Field label="Section Heading" name="featuredCampaignTitle" value={settings.featuredCampaignTitle} onChange={handleChange} placeholder="e.g. Powering a Sustainable Tomorrow" />

          {/* Quote / paragraph 1 */}
          <Field label="Quote / First Paragraph" name="leaderQuote" value={settings.leaderQuote} onChange={handleChange} type="textarea" placeholder="The main message or quote from the leader..." />

          {/* Paragraph 2 */}
          <Field label="Second Paragraph" name="leaderParagraph" value={(settings as SiteSettings & { leaderParagraph?: string }).leaderParagraph || ""} onChange={handleChange} type="textarea" placeholder="Additional message body text..." />

        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider">Live Preview</h3>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative size-14 rounded-full overflow-hidden border-2 border-[#cc0000]/20 shrink-0">
              <Image src={leaderImg} alt="" fill className="object-cover" unoptimized={leaderImg.startsWith("data:")} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block bg-[#cc0000] text-white text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider rounded-sm mb-2">Message</span>
              <h2 className="font-display text-xl font-black text-gray-900 mb-2">{settings.featuredCampaignTitle || "Section Heading"}</h2>
              <p className="text-sm text-gray-600 italic mb-3">&ldquo;{settings.leaderQuote || "Leader quote will appear here."}&rdquo;</p>
              <p className="text-xs font-bold text-gray-900">{settings.leaderName || "Leader Name"}</p>
              <p className="text-xs text-gray-500">{settings.leaderRole || "Role"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 2 — Leadership Messages
// ────────────────────────────────────────────────────────────────────────────
function LeadershipMessagesTab() {
  const [items, setItems] = useState<LeaderMessage[]>([])
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<LeaderMessage | null>(null)
  const [form, setForm] = useState<typeof EMPTY_LEADER>({ ...EMPTY_LEADER })
  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => setItems(getLeaderMessages()), [])
  useEffect(() => { reload() }, [reload])

  function openAdd() { setSelected(null); setForm({ ...EMPTY_LEADER }); setModal("add") }
  function openEdit(item: LeaderMessage) {
    setSelected(item)
    setForm({ name: item.name, role: item.role, image: item.image || "", subject: item.subject || "", excerpt: item.excerpt, date: item.date || "", readTime: item.readTime || "" })
    setModal("edit")
  }
  function openDelete(item: LeaderMessage) { setSelected(item); setModal("delete") }
  function closeModal() { setModal(null); setSelected(null); setForm({ ...EMPTY_LEADER }) }

  function handleChange(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }
  function handleImgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  function flash(id: string) { setFlashId(id); setTimeout(() => setFlashId(null), 2000) }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    if (modal === "add") {
      const n = saveLeaderMessage(form as unknown as Omit<LeaderMessage, "id">); reload(); flash(n.id)
    } else if (modal === "edit" && selected) {
      updateLeaderMessage(selected.id, form as unknown as Partial<LeaderMessage>); reload(); flash(selected.id)
    }
    setSaving(false); closeModal()
  }

  function handleDelete() {
    if (!selected) return
    deleteLeaderMessage(selected.id); reload(); closeModal()
  }

  const img = form.image || ""
  const selImg = selected?.image || ""

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Leadership messages shown on the Corporate Communications page carousel.</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000]">
          <Plus className="size-4" /> Add Message
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
          <Users className="size-10 opacity-30" />
          <p className="font-bold text-sm">No leadership messages yet.</p>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#a80000]"><Plus className="size-4" /> Add First</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const avatar = item.image || "/leader-ceo.png"
            return (
              <div key={item.id} className={`group bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${flashId === item.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"}`}>
                <div className="relative bg-[#1a1a1a] p-5 flex items-start gap-4">
                  <div className="relative size-12 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                    <Image src={avatar} alt={item.name} fill className="object-cover" unoptimized={avatar.startsWith("data:")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-black text-white leading-tight">{item.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.role}</p>
                    {item.date && <p className="text-[10px] text-gray-500 mt-1">{item.date}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => openEdit(item)} className="flex size-7 items-center justify-center rounded-lg bg-white/10 hover:bg-blue-500/30 text-white transition" title="Edit"><Pencil className="size-3.5" /></button>
                    <button onClick={() => openDelete(item)} className="flex size-7 items-center justify-center rounded-lg bg-white/10 hover:bg-red-500/30 text-white transition" title="Delete"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-4">&ldquo;{item.excerpt}&rdquo;</p>
                </div>
                {flashId === item.id && (
                  <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center rounded-2xl pointer-events-none">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">✓ Saved</span>
                  </div>
                )}
              </div>
            )
          })}
          <button onClick={openAdd} className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[180px]">
            <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors"><Plus className="size-6" /></span>
            <span className="text-sm font-bold">Add Message</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">{modal === "add" ? "Add Leadership Message" : "Edit Message"}</h2>
              <button onClick={closeModal} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"><X className="size-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[68vh] overflow-y-auto">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shrink-0">
                  {img ? <Image src={img} alt="Preview" fill className="object-cover" unoptimized={img.startsWith("data:")} /> : <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 font-black text-lg">{form.name?.charAt(0) || "?"}</div>}
                </div>
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#cc0000] transition-colors">
                  <Upload className="size-4" /> Upload photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImgUpload} />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ananya Rao" required />
                <Field label="Role" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Group CEO" required />
              </div>
              <Field label="Quote / Message" name="excerpt" value={form.excerpt} onChange={handleChange} type="textarea" placeholder="Leadership message quote..." required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date" name="date" value={form.date} onChange={handleChange} placeholder="e.g. Jul 12, 2026" />
                <Field label="Read Time" name="readTime" value={form.readTime} onChange={handleChange} placeholder="e.g. 2 min read" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000] disabled:opacity-50">
                <Save className="size-4" />
                {saving ? "Saving…" : modal === "add" ? "Add Message" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="size-5 text-red-600" /></span>
                <div>
                  <h2 className="font-display text-base font-black text-gray-900">Delete Message?</h2>
                  <p className="mt-1 text-sm text-gray-500">This will permanently remove <span className="font-bold text-gray-800">&ldquo;{selected.name}&rdquo;</span>&apos;s message.</p>
                </div>
              </div>
              {selImg && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="relative size-10 rounded-full overflow-hidden"><Image src={selImg} alt="" fill className="object-cover" unoptimized={selImg.startsWith("data:")} /></div>
                  <div><p className="text-sm font-bold text-gray-900">{selected.name}</p><p className="text-xs text-gray-500">{selected.role}</p></div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700"><Trash2 className="size-4" /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 3 — Employee Stories
// ────────────────────────────────────────────────────────────────────────────
function EmployeeStoriesTab() {
  const [stories, setStories] = useState<EmployeeStory[]>([])
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<EmployeeStory | null>(null)
  const [form, setForm] = useState<typeof EMPTY_STORY>({ ...EMPTY_STORY })
  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => setStories(getEmployeeStories()), [])
  useEffect(() => { reload() }, [reload])

  function openAdd() { setSelected(null); setForm({ ...EMPTY_STORY }); setModal("add") }
  function openEdit(s: EmployeeStory) { setSelected(s); setForm({ author: s.author, role: s.role, avatar: s.avatar, quote: s.quote }); setModal("edit") }
  function openDelete(s: EmployeeStory) { setSelected(s); setModal("delete") }
  function closeModal() { setModal(null); setSelected(null); setForm({ ...EMPTY_STORY }) }

  function handleChange(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }
  function handleImgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, avatar: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  function flash(id: string) { setFlashId(id); setTimeout(() => setFlashId(null), 2000) }

  async function handleSave() {
    if (!form.author.trim()) return
    setSaving(true)
    if (modal === "add") {
      const s = saveEmployeeStory({ ...form, avatar: form.avatar || "/leader-ceo.png" }); reload(); flash(s.id)
    } else if (modal === "edit" && selected) {
      updateEmployeeStory(selected.id, { ...form }); reload(); flash(selected.id)
    }
    setSaving(false); closeModal()
  }

  function handleDelete() {
    if (!selected) return
    deleteEmployeeStory(selected.id); reload(); closeModal()
  }

  const avt = form.avatar || ""

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Employee testimonials shown on the Corporate Communications page.</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000]">
          <Plus className="size-4" /> Add Story
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
          <Quote className="size-10 opacity-30" />
          <p className="font-bold text-sm">No employee stories yet.</p>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#a80000]"><Plus className="size-4" /> Add First</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => {
            const avatar = story.avatar || "/leader-ceo.png"
            return (
              <div key={story.id} className={`relative group bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${flashId === story.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"}`}>
                <div className="relative bg-[#cc0000] p-5 flex items-start gap-4">
                  <div className="relative size-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                    <Image src={avatar} alt={story.author} fill className="object-cover" unoptimized={avatar.startsWith("data:")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-black text-white leading-tight">{story.author}</p>
                    <p className="text-[11px] text-white/70 mt-0.5">{story.role}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => openEdit(story)} className="flex size-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition" title="Edit"><Pencil className="size-3.5" /></button>
                    <button onClick={() => openDelete(story)} className="flex size-7 items-center justify-center rounded-lg bg-white/10 hover:bg-red-500/50 text-white transition" title="Delete"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-4">&ldquo;{story.quote}&rdquo;</p>
                </div>
                {flashId === story.id && (
                  <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center pointer-events-none">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">✓ Saved</span>
                  </div>
                )}
              </div>
            )
          })}
          <button onClick={openAdd} className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[180px]">
            <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors"><Plus className="size-6" /></span>
            <span className="text-sm font-bold">Add New Story</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">{modal === "add" ? "Add Employee Story" : "Edit Story"}</h2>
              <button onClick={closeModal} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"><X className="size-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shrink-0">
                  {avt ? <Image src={avt} alt="Preview" fill className="object-cover" unoptimized={avt.startsWith("data:")} /> : <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 font-black text-lg">{form.author?.charAt(0) || "?"}</div>}
                </div>
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#cc0000] transition-colors">
                  <Upload className="size-4" /> Upload photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImgUpload} />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="author" value={form.author} onChange={handleChange} placeholder="e.g. Priyanka Bajaj" required />
                <Field label="Role / Designation" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Chief Executive Officer" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Quote / Testimonial</label>
                <textarea rows={4} value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} placeholder="What they said about Nexus Hub..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20 transition resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.author.trim()} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000] disabled:opacity-50">
                <Save className="size-4" />
                {saving ? "Saving…" : modal === "add" ? "Add Story" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="size-5 text-red-600" /></span>
                <div>
                  <h2 className="font-display text-base font-black text-gray-900">Delete Story?</h2>
                  <p className="mt-1 text-sm text-gray-500">This will permanently remove <span className="font-bold">&ldquo;{selected.author}&rdquo;</span>&apos;s story.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700"><Trash2 className="size-4" /> Delete Story</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 4 — Recent Internal Mailers (Multi-Add & Multi-Delete)
// ────────────────────────────────────────────────────────────────────────────
function InternalMailersTab() {
  const [items, setItems] = useState<NewsletterItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [modal, setModal] = useState<"add" | "edit" | "delete" | "multi-add" | "multi-delete" | null>(null)
  const [selected, setSelected] = useState<NewsletterItem | null>(null)
  const [form, setForm] = useState<typeof EMPTY_MAILER>({ ...EMPTY_MAILER })
  
  // Multi-add state
  const [multiRows, setMultiRows] = useState<Array<{ title: string; from: string; issue: string; date: string; description: string; fileSize: string }>>([
    { title: "", from: "Corporate Communications Team", issue: "All Staff", date: "Jul 2026", description: "", fileSize: "2.4 MB" }
  ])

  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setItems(getNewsletters())
    setSelectedIds([])
  }, [])

  useEffect(() => { reload() }, [reload])

  function openAddSingle() { setSelected(null); setForm({ ...EMPTY_MAILER }); setModal("add") }
  function openMultiAdd() {
    setMultiRows([
      {
        title: "",
        from: "Corporate Communications Team",
        issue: "All Staff",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        description: "",
        fileSize: "1.5 MB",
      }
    ])
    setModal("multi-add")
  }
  function openEdit(m: NewsletterItem) {
    setSelected(m)
    setForm({
      title: m.title,
      from: m.from || "Communications Team",
      to: m.to || "All Mitsubishi Electric Group Employees",
      issue: m.issue || "ALL STAFF",
      date: m.date || "Jul 2, 2026",
      salutation: m.salutation || "Dear Team,",
      description: m.description || "",
      signoff: m.signoff || "Best regards,",
      division: m.division || "Corporate Communications Division · Group Communications",
      fileSize: m.fileSize || "2.4 MB",
      pdfUrl: m.pdfUrl || "",
    })
    setModal("edit")
  }
  function openSingleDelete(m: NewsletterItem) { setSelected(m); setModal("delete") }
  function openMultiDelete() {
    if (selectedIds.length === 0) return
    setModal("multi-delete")
  }
  function closeModal() { setModal(null); setSelected(null); setForm({ ...EMPTY_MAILER }) }

  function toggleSelectAll() {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((i) => i.id))
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function flash(id: string) { setFlashId(id); setTimeout(() => setFlashId(null), 2000) }

  function handleSingleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    if (modal === "add") {
      const created = saveNewsletter({
        title: form.title,
        from: form.from || "Communications Team",
        to: form.to || "All Mitsubishi Electric Group Employees",
        issue: form.issue || "ALL STAFF",
        date: form.date || "Jul 2, 2026",
        salutation: form.salutation || "Dear Team,",
        description: form.description || "Internal mailer content",
        signoff: form.signoff || "Best regards,",
        division: form.division || "Corporate Communications Division · Group Communications",
        fileSize: form.fileSize || "2.4 MB",
        pdfUrl: form.pdfUrl,
        downloads: 0,
        image: "/newsletter-cover.png",
      })
      reload()
      flash(created.id)
    } else if (modal === "edit" && selected) {
      updateNewsletter(selected.id, {
        title: form.title,
        from: form.from,
        to: form.to,
        issue: form.issue,
        date: form.date,
        salutation: form.salutation,
        description: form.description,
        signoff: form.signoff,
        division: form.division,
        fileSize: form.fileSize,
        pdfUrl: form.pdfUrl,
      })
      reload()
      flash(selected.id)
    }
    setSaving(false)
    closeModal()
  }

  function handleSingleDelete() {
    if (!selected) return
    deleteNewsletter(selected.id)
    reload()
    closeModal()
  }

  function handleMultiDeleteConfirm() {
    if (selectedIds.length === 0) return
    deleteMultipleNewsletters(selectedIds)
    reload()
    closeModal()
  }

  function handleMultiFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    const newRows = Array.from(files).map((file, idx) => {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB"
      return {
        title: nameWithoutExt,
        from: "Corporate Communications Team",
        issue: "All Staff",
        date: todayStr,
        description: `Internal mailer document: ${file.name}`,
        fileSize: sizeMb,
      }
    })
    setMultiRows((prev) => [...prev.filter((r) => r.title.trim() !== ""), ...newRows])
  }

  function addMultiRow() {
    setMultiRows((prev) => [
      ...prev,
      {
        title: "",
        from: "Corporate Communications Team",
        issue: "All Staff",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        description: "",
        fileSize: "1.5 MB",
      },
    ])
  }

  function removeMultiRow(idx: number) {
    setMultiRows((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateMultiRow(idx: number, key: string, val: string) {
    setMultiRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r)))
  }

  function handleMultiSave() {
    const valid = multiRows.filter((r) => r.title.trim().length > 0)
    if (valid.length === 0) return
    setSaving(true)
    saveMultipleNewsletters(
      valid.map((r) => ({
        title: r.title,
        from: r.from || "Corporate Communications Team",
        issue: r.issue || "All Staff",
        date: r.date || "Recent",
        description: r.description || "Internal mailer update.",
        fileSize: r.fileSize || "1.5 MB",
        downloads: 0,
        image: "/newsletter-cover.png",
      }))
    )
    setSaving(false)
    closeModal()
    reload()
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <div className="space-y-6">
      {/* Top Bar with Multi-Add and Multi-Delete buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 px-3 py-2 rounded-xl transition cursor-pointer"
          >
            {allSelected ? <CheckSquare className="size-4 text-[#cc0000]" /> : <Square className="size-4 text-gray-400" />}
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          {selectedIds.length > 0 && (
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">
              {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={openMultiDelete}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 cursor-pointer animate-in fade-in"
            >
              <Trash2 className="size-4" />
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <button
            onClick={openMultiAdd}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-gray-800 cursor-pointer"
          >
            <Layers className="size-4 text-red-400" />
            Multi-Add Mailers
          </button>

          <button
            onClick={openAddSingle}
            className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000] cursor-pointer"
          >
            <Plus className="size-4" />
            Add Single Mailer
          </button>
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 text-gray-400 space-y-3">
          <Mail className="size-10 opacity-30" />
          <p className="font-bold text-sm">No internal mailers added yet.</p>
          <div className="flex gap-3">
            <button onClick={openMultiAdd} className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800"><Layers className="size-3.5" /> Multi-Add Mailers</button>
            <button onClick={openAddSingle} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#a80000]"><Plus className="size-3.5" /> Add Mailer</button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 shadow-sm overflow-hidden">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                  isSelected ? "bg-red-50/50" : "hover:bg-gray-50/80"
                } ${flashId === item.id ? "bg-green-50" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => toggleSelect(item.id)} className="cursor-pointer">
                    {isSelected ? <CheckSquare className="size-5 text-[#cc0000]" /> : <Square className="size-5 text-gray-300 hover:text-gray-400" />}
                  </button>
                  <span className="flex size-10 shrink-0 items-center justify-center bg-[#cc0000] text-white rounded-xl shadow-xs">
                    <Mail className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    {item.from && <p className="text-[10px] text-gray-400">From: {item.from}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{item.issue}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.date} · {item.fileSize || "PDF"}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit Mailer"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => openSingleDelete(item)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Mailer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MULTI-ADD MODAL */}
      {modal === "multi-add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-[#cc0000]" />
                <h2 className="font-display text-base font-black">Multi-Add Internal Mailers</h2>
              </div>
              <button onClick={closeModal} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"><X className="size-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Batch Upload Drop Area */}
              <div className="border-2 border-dashed border-gray-300 hover:border-[#cc0000] bg-gray-50/50 rounded-2xl p-6 text-center space-y-2 transition-colors">
                <Upload className="size-8 text-[#cc0000] mx-auto" />
                <p className="text-sm font-bold text-gray-900">Upload Multiple Files at Once</p>
                <p className="text-xs text-gray-500">Select multiple PDF, Doc or Image mailer files from your computer</p>
                <label className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition cursor-pointer mt-2">
                  <FilePlus className="size-4" /> Select Files
                  <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={handleMultiFileUpload} />
                </label>
              </div>

              {/* Rows List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Mailer Items ({multiRows.length})</h3>
                  <button onClick={addMultiRow} className="flex items-center gap-1 text-xs font-bold text-[#cc0000] hover:underline cursor-pointer">
                    <Plus className="size-3.5" /> Add Row
                  </button>
                </div>

                {multiRows.map((row, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 relative group">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-xs font-black text-gray-700">Item #{idx + 1}</span>
                      {multiRows.length > 1 && (
                        <button onClick={() => removeMultiRow(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
                          <X className="size-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Subject / Title *</label>
                        <input
                          type="text"
                          value={row.title}
                          onChange={(e) => updateMultiRow(idx, "title", e.target.value)}
                          placeholder="e.g. Q3 Strategic Internal Update"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">From (Sender)</label>
                        <input
                          type="text"
                          value={row.from}
                          onChange={(e) => updateMultiRow(idx, "from", e.target.value)}
                          placeholder="e.g. Corporate Communications Team"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Department / Audience</label>
                        <input
                          type="text"
                          value={row.issue}
                          onChange={(e) => updateMultiRow(idx, "issue", e.target.value)}
                          placeholder="e.g. All Staff"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Date</label>
                        <input
                          type="text"
                          value={row.date}
                          onChange={(e) => updateMultiRow(idx, "date", e.target.value)}
                          placeholder="e.g. Jul 2026"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">File Size</label>
                        <input
                          type="text"
                          value={row.fileSize}
                          onChange={(e) => updateMultiRow(idx, "fileSize", e.target.value)}
                          placeholder="e.g. 2.5 MB"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Full Email Body / Content</label>
                      <textarea
                        rows={2}
                        value={row.description}
                        onChange={(e) => updateMultiRow(idx, "description", e.target.value)}
                        placeholder="Full mailer content message..."
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#cc0000] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={addMultiRow} className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3.5 py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                <Plus className="size-4" /> Add Another Row
              </button>

              <div className="flex items-center gap-3">
                <button onClick={closeModal} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition cursor-pointer">Cancel</button>
                <button
                  onClick={handleMultiSave}
                  disabled={saving || multiRows.every(r => !r.title.trim())}
                  className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000] disabled:opacity-50 cursor-pointer"
                >
                  <Save className="size-4" />
                  {saving ? "Saving All..." : `Save All Mailers (${multiRows.filter(r => r.title.trim()).length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-DELETE CONFIRM MODAL */}
      {modal === "multi-delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="size-5 text-red-600" /></span>
                <div>
                  <h2 className="font-display text-base font-black text-gray-900">Delete {selectedIds.length} Mailers?</h2>
                  <p className="mt-1 text-sm text-gray-500">This will permanently remove the selected {selectedIds.length} internal mailers.</p>
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1 divide-y divide-gray-100">
                {items.filter(i => selectedIds.includes(i.id)).map(i => (
                  <p key={i.id} className="text-xs font-bold text-gray-800 pt-1 first:pt-0 truncate">• {i.title}</p>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition cursor-pointer">Cancel</button>
              <button onClick={handleMultiDeleteConfirm} className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-red-700 cursor-pointer"><Trash2 className="size-4" /> Delete All Selected ({selectedIds.length})</button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE ADD / EDIT MODAL */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">{modal === "add" ? "Add Internal Mailer" : "Edit Mailer"}</h2>
              <button onClick={closeModal} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"><X className="size-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <Field label="Subject / Mailer Title" name="title" value={form.title} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. The Hub — Q2 2026 Edition" required />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Department Badge" name="issue" value={form.issue} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. ALL STAFF" />
                <Field label="Date" name="date" value={form.date} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. Jul 2, 2026" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="From (Sender)" name="from" value={form.from} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. Communications Team" />
                <Field label="To (Recipient Audience)" name="to" value={form.to} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. All Mitsubishi Electric Group Employees" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Salutation / Greeting" name="salutation" value={form.salutation} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. Dear Team," />
                <Field label="Sign-off / Regard" name="signoff" value={form.signoff} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. Best regards," />
              </div>

              <Field label="Division / Sub-caption" name="division" value={form.division} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} placeholder="e.g. Corporate Communications Division · Group Communications" />

              <Field label="Email Body / Message Content" name="description" value={form.description} onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))} type="textarea" placeholder="Quarterly digest covering the sustainability campaign launch..." />

              {/* PDF Attachment Upload */}
              <div className="space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-700">Official PDF Document Attachment</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition">
                    <Upload className="size-3.5" />
                    {form.pdfUrl ? "Replace PDF File" : "Upload PDF File"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB"
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          setForm((f) => ({ ...f, pdfUrl: ev.target?.result as string, fileSize: sizeMb }))
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {form.pdfUrl && <span className="text-xs font-bold text-green-600">✓ PDF Attached ({form.fileSize})</span>}
                </div>
              </div>

            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSingleSave} disabled={saving || !form.title.trim()} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000] disabled:opacity-50 cursor-pointer">
                <Save className="size-4" />
                {saving ? "Saving…" : modal === "add" ? "Add Mailer" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE DELETE CONFIRM MODAL */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="size-5 text-red-600" /></span>
                <div>
                  <h2 className="font-display text-base font-black text-gray-900">Delete Mailer?</h2>
                  <p className="mt-1 text-sm text-gray-500">This will permanently remove <span className="font-bold">&ldquo;{selected.title}&rdquo;</span>.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleSingleDelete} className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-red-700"><Trash2 className="size-4" /> Delete Mailer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────────────────
export default function AdminLeadersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const activeTabMeta = TABS.find((t) => t.key === activeTab)!

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
                Leadership
              </span>
            </div>
            <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
              <Users className="size-5 text-[#E60012]" /> Leadership Management
            </h1>
            <p className="text-xs text-gray-200 leading-snug">
              Manage leadership content, communications carousel, employee stories, and internal mailers.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-2 transition-all ${
                  isActive
                    ? "border-[#cc0000] text-[#cc0000] bg-white shadow-sm"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Description */}
        <div className="flex items-center gap-2 text-xs text-gray-400 -mt-4">
          <activeTabMeta.icon className="size-3.5" />
          {activeTabMeta.desc}
        </div>

        {/* Tab Content */}
        {activeTab === "home" && <HomeMessageTab />}
        {activeTab === "leaders" && <LeadershipMessagesTab />}
        {activeTab === "stories" && <EmployeeStoriesTab />}
        {activeTab === "mailers" && <InternalMailersTab />}

      </div>
    </div>
  )
}

