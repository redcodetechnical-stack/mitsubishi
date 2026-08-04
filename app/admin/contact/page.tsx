"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Users, PhoneCall, Plus, Pencil, Trash2, X, Save, Upload, AlertTriangle, ExternalLink, Mail, Phone, Globe, MapPin, CheckCircle, ShieldCheck
} from "lucide-react"
import {
  getContactTeamMembers, saveContactTeamMember, updateContactTeamMember, deleteContactTeamMember,
  getContactChannels, saveContactChannel, updateContactChannel, deleteContactChannel,
  getBanner, updateBanner, type PageBanner
} from "@/lib/cms-store"
import type { ContactTeamMember, ContactChannel } from "@/lib/data"

type Tab = "team" | "channels" | "banner"

const TABS: { key: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "team", label: "Team Contacts", icon: Users, desc: "Manage corporate communications & regional contact team members" },
  { key: "channels", label: "Other Channels", icon: PhoneCall, desc: "Manage general enquiries email, hotline numbers, and portal links" },
  { key: "banner", label: "Page Banner & Hero Settings", icon: ShieldCheck, desc: "Edit hero title, subtitle, cover photo, and contact form banner" },
]

const ICON_OPTIONS = [
  { key: "Mail", label: "Email (Mail Icon)", icon: Mail },
  { key: "Phone", label: "Phone (Hotline Icon)", icon: Phone },
  { key: "Globe", label: "Globe (Website / Portal Icon)", icon: Globe },
  { key: "MapPin", label: "Location (Map Pin Icon)", icon: MapPin },
]

const EMPTY_TEAM_MEMBER: Omit<ContactTeamMember, "id"> = {
  name: "",
  role: "",
  email: "",
  region: "Group",
  initials: "",
}

const EMPTY_CHANNEL: Omit<ContactChannel, "id"> = {
  label: "",
  value: "",
  icon: "Mail",
}

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<Tab>("team")
  const [teamMembers, setTeamMembers] = useState<ContactTeamMember[]>([])
  const [channels, setChannels] = useState<ContactChannel[]>([])
  const [banner, setBanner] = useState<PageBanner>({
    pageKey: "contact",
    title: "Talk to the Communications Team",
    subtitle: "Submit a request, report an issue, or share feedback. We're here to help.",
    image: "/news-innovation.png",
  })
  const [bannerSaved, setBannerSaved] = useState(false)

  // Team Modal
  const [teamModal, setTeamModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<ContactTeamMember | null>(null)
  const [teamForm, setTeamForm] = useState<typeof EMPTY_TEAM_MEMBER>({ ...EMPTY_TEAM_MEMBER })

  // Channel Modal
  const [channelModal, setChannelModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel | null>(null)
  const [channelForm, setChannelForm] = useState<typeof EMPTY_CHANNEL>({ ...EMPTY_CHANNEL })

  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setTeamMembers(getContactTeamMembers())
    setChannels(getContactChannels())
    const b = getBanner("contact")
    if (b) setBanner(b)
  }, [])

  useEffect(() => { reload() }, [reload])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  // ─── Team Handlers ──────────────────────────────────────────────────────────
  function openAddTeam() {
    setSelectedTeam(null)
    setTeamForm({
      name: "",
      role: "Corporate Comms Lead",
      email: "contact@nexusgroup.example",
      region: "Group",
      initials: "",
    })
    setTeamModal("add")
  }

  function openEditTeam(item: ContactTeamMember) {
    setSelectedTeam(item)
    setTeamForm({
      name: item.name,
      role: item.role,
      email: item.email,
      region: item.region,
      initials: item.initials,
    })
    setTeamModal("edit")
  }

  async function handleSaveTeam() {
    if (!teamForm.name.trim()) return
    setSaving(true)

    // Auto generate initials if not provided
    const initials = teamForm.initials.trim() || teamForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    const payload = { ...teamForm, initials }

    if (teamModal === "add") {
      const created = saveContactTeamMember(payload)
      reload()
      flash(created.id)
    } else if (teamModal === "edit" && selectedTeam) {
      updateContactTeamMember(selectedTeam.id, payload)
      reload()
      flash(selectedTeam.id)
    }

    setSaving(false)
    setTeamModal(null)
  }

  function handleDeleteTeam() {
    if (!selectedTeam) return
    deleteContactTeamMember(selectedTeam.id)
    reload()
    setTeamModal(null)
  }

  // ─── Channel Handlers ───────────────────────────────────────────────────────
  function openAddChannel() {
    setSelectedChannel(null)
    setChannelForm({
      label: "",
      value: "",
      icon: "Mail",
    })
    setChannelModal("add")
  }

  function openEditChannel(item: ContactChannel) {
    setSelectedChannel(item)
    setChannelForm({
      label: item.label,
      value: item.value,
      icon: item.icon,
    })
    setChannelModal("edit")
  }

  async function handleSaveChannel() {
    if (!channelForm.label.trim()) return
    setSaving(true)

    if (channelModal === "add") {
      const created = saveContactChannel(channelForm)
      reload()
      flash(created.id)
    } else if (channelModal === "edit" && selectedChannel) {
      updateContactChannel(selectedChannel.id, channelForm)
      reload()
      flash(selectedChannel.id)
    }

    setSaving(false)
    setChannelModal(null)
  }

  function handleDeleteChannel() {
    if (!selectedChannel) return
    deleteContactChannel(selectedChannel.id)
    reload()
    setChannelModal(null)
  }

  // ─── Banner Settings Handler ───────────────────────────────────────────────
  function handleSaveBanner() {
    updateBanner("contact", banner)
    setBannerSaved(true)
    setTimeout(() => setBannerSaved(false), 2500)
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
              Contacts &amp; Support
            </span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <PhoneCall className="size-5 text-[#E60012]" /> Contact Us Management
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Add, edit, or remove team contacts, support hotlines, general enquiry channels, and page hero banners on the public /contact page.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Link
            href="/contact"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            <ExternalLink className="size-4" /> Live Public Page
          </Link>
          {activeTab === "team" && (
            <button
              onClick={openAddTeam}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <Plus className="size-4" /> Add Team Contact
            </button>
          )}
          {activeTab === "channels" && (
            <button
              onClick={openAddChannel}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <Plus className="size-4" /> Add Contact Channel
            </button>
          )}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 pt-1">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.key
          let count = 0
          if (t.key === "team") count = teamMembers.length
          else if (t.key === "channels") count = channels.length

          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#cc0000] text-white border-[#cc0000] shadow-md shadow-[#cc0000]/20"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className="size-4" />
              {t.label}
              {t.key !== "banner" && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">

        {/* TAB 1: TEAM CONTACTS */}
        {activeTab === "team" && (
          <div className="space-y-6">


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((m) => (
                <div
                  key={m.id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                    flashId === m.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="flex size-11 shrink-0 items-center justify-center bg-[#cc0000] text-white font-black text-sm rounded-full shadow-md">
                        {m.initials || "SM"}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold text-gray-900 truncate">{m.name}</h3>
                        <p className="text-[11px] text-gray-500 font-medium truncate">{m.role}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{m.email}</p>
                      </div>
                    </div>

                    <span className="shrink-0 bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200">
                      {m.region}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditTeam(m)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-900 text-xs font-bold hover:bg-black hover:text-white transition cursor-pointer"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { setSelectedTeam(m); setTeamModal("delete"); }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={openAddTeam}
                className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[160px] cursor-pointer"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors">
                  <Plus className="size-5" />
                </span>
                <span className="text-xs font-bold">Add Team Contact</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: OTHER CHANNELS */}
        {activeTab === "channels" && (
          <div className="space-y-6">


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((c) => {
                let Icon = Mail
                if (c.icon === "Phone") Icon = Phone
                else if (c.icon === "Globe") Icon = Globe
                else if (c.icon === "MapPin") Icon = MapPin

                return (
                  <div
                    key={c.id}
                    className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                      flashId === c.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex size-11 shrink-0 items-center justify-center bg-[#cc0000] text-white rounded-full shadow-md">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{c.label}</p>
                        <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{c.value}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditChannel(c)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-900 text-xs font-bold hover:bg-black hover:text-white transition cursor-pointer"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => { setSelectedChannel(c); setChannelModal("delete"); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                )
              })}

              <button
                onClick={openAddChannel}
                className="group flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[120px] cursor-pointer"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors">
                  <Plus className="size-4" />
                </span>
                <span className="text-xs font-bold">Add Contact Channel</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BANNER & HERO SETTINGS */}
        {activeTab === "banner" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-display text-lg font-black text-gray-900 flex items-center gap-2 border-l-4 border-l-[#cc0000] pl-3">
                  <ShieldCheck className="size-5 text-[#cc0000]" /> Contact Page Hero Banner Settings
                </h2>
                <p className="text-xs text-gray-500 mt-1 pl-3">Customize dark hero header title, description, and right feature image.</p>
              </div>
              <button
                onClick={handleSaveBanner}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#cc0000]/20 hover:bg-[#a80000] cursor-pointer"
              >
                <Save className="size-4" /> Save Banner Settings
              </button>
            </div>

            {bannerSaved && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="size-4" /> Banner settings updated successfully!
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Hero Banner Title</label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => setBanner((b) => ({ ...b, title: e.target.value }))}
                    placeholder="Talk to the Communications Team"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Hero Banner Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={banner.subtitle || ""}
                    onChange={(e) => setBanner((b) => ({ ...b, subtitle: e.target.value }))}
                    placeholder="Submit a request, report an issue, or share feedback. We're here to help."
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Right Hero Feature Photo</label>
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
                  {banner.image ? (
                    <Image src={banner.image} alt="" fill className="object-cover" unoptimized={banner.image.startsWith("data:")} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <PhoneCall className="size-10 opacity-30" />
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl py-2 text-xs font-semibold text-gray-600 hover:text-[#cc0000] transition">
                  <Upload className="size-4" /> Upload Hero Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const r = new FileReader()
                      r.onload = (ev) => setBanner((b) => ({ ...b, image: ev.target?.result as string }))
                      r.readAsDataURL(file)
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── ADD/EDIT TEAM MEMBER MODAL ─────────────────────────────────────── */}
      {(teamModal === "add" || teamModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">
                {teamModal === "add" ? "Add Team Contact" : "Edit Team Contact"}
              </h2>
              <button onClick={() => setTeamModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Sarah Mitchell"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Initials</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={teamForm.initials}
                    onChange={(e) => setTeamForm((f) => ({ ...f, initials: e.target.value.toUpperCase() }))}
                    placeholder="SM"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-center text-[#cc0000] uppercase outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Job Title / Role</label>
                <input
                  type="text"
                  value={teamForm.role}
                  onChange={(e) => setTeamForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. Head of Corporate Communications"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="sarah.mitchell@nexusgroup.example"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Region / Group Tag</label>
                <input
                  type="text"
                  value={teamForm.region}
                  onChange={(e) => setTeamForm((f) => ({ ...f, region: e.target.value }))}
                  placeholder="e.g. Group / Asia Pacific / Europe"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setTeamModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSaveTeam}
                disabled={saving || !teamForm.name.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Member Confirmation Modal */}
      {teamModal === "delete" && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Team Contact?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedTeam.name}&rdquo; ({selectedTeam.role})
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setTeamModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteTeam} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT CHANNEL MODAL ─────────────────────────────────────────── */}
      {(channelModal === "add" || channelModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">
                {channelModal === "add" ? "Add Contact Channel" : "Edit Contact Channel"}
              </h2>
              <button onClick={() => setChannelModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Channel Label *</label>
                <input
                  type="text"
                  value={channelForm.label}
                  onChange={(e) => setChannelForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. General enquiries / Group comms hotline"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Contact Value / Info *</label>
                <input
                  type="text"
                  value={channelForm.value}
                  onChange={(e) => setChannelForm((f) => ({ ...f, value: e.target.value }))}
                  placeholder="e.g. example@gmail.com or +91 95 9900 4245"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Icon Type</label>
                <select
                  value={channelForm.icon}
                  onChange={(e) => setChannelForm((f) => ({ ...f, icon: e.target.value as ContactChannel["icon"] }))}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-[#cc0000]"
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setChannelModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSaveChannel}
                disabled={saving || !channelForm.label.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Channel Confirmation Modal */}
      {channelModal === "delete" && selectedChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Channel?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedChannel.label}&rdquo; ({selectedChannel.value})
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setChannelModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteChannel} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Channel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
