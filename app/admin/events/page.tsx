"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays, MapPin, Clock, Plus, Pencil, Trash2, X, Save, Upload, AlertTriangle, ExternalLink, Users, Image as ImageIcon, CheckCircle, Download, FolderArchive, Layers, List, LayoutGrid, Home, Filter, Search
} from "lucide-react"
import {
  getEvents, saveEvent, updateEvent, deleteEvent,
  getEventKits, saveEventKit, updateEventKit, deleteEventKit,
  getEventGalleries, saveEventGallery, updateEventGallery, deleteEventGallery,
  getSettings, saveSettingsData, defaultSettings, type SiteSettings,
  type EventKit, type EventGallery
} from "@/lib/cms-store"
import type { EventItem, EventSpeaker } from "@/lib/data"

type Tab = "home-events" | "events-page" | "kits" | "galleries"

const TABS: { key: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "home-events", label: "Main Home Page Events", icon: Home, desc: "Events showcased in the Upcoming Events section on the main home page" },
  { key: "events-page", label: "Public /events Page Events", icon: CalendarDays, desc: "Events displayed on the public /events portal page" },
  { key: "kits", label: "Event Kits & Templates", icon: Download, desc: "Manage downloadable event branding packs, templates, and slide decks" },
  { key: "galleries", label: "Past Event Galleries", icon: ImageIcon, desc: "Upload multi-photo albums for completed past events" },
]

const EVENT_TYPES: EventItem["type"][] = ["Town Hall", "Webinar", "Workshop", "Launch", "Conference"]

const DEFAULT_VENUE_PHOTOS = [
  "/event-townhall.png",
  "/news-innovation.png",
  "/video-brandfilm.png",
  "/campaign-sustainability.png",
  "/newsletter-cover.png",
]

const DEFAULT_SPEAKERS: EventSpeaker[] = [
  {
    name: "Michael Wilson",
    role: "Speaker",
    title: "Global Innovation Of Conference",
    time: "9:00 AM - 4:00 PM",
    location: "HUSBAND, LONDON",
    avatar: "/leader-ceo.png",
    isHighlighted: false,
  },
  {
    name: "Ramon Knight",
    role: "Speaker",
    title: "International Corporate Conventions",
    time: "7:00 AM - 3:00 PM",
    location: "LIVERPOOL, UK",
    avatar: "/leader-designer.png",
    isHighlighted: true,
  },
  {
    name: "Robert Reyes",
    role: "Speaker",
    title: "Sustainable Growth Of Conference",
    time: "9:00 AM - 4:00 PM",
    location: "SYDNEY, AUSTRALIA",
    avatar: "/leader-communications.png",
    isHighlighted: false,
  },
  {
    name: "Mary Banister",
    role: "Speaker",
    title: "Education & Research Conference",
    time: "10:00 AM - 6:00 PM",
    location: "MOSCOW, RUSSIA",
    avatar: "/leader-designer.png",
    isHighlighted: false,
  },
]

const EMPTY_EVENT = {
  title: "",
  type: "Town Hall" as EventItem["type"],
  date: "Jul 24, 2026",
  time: "10:00 AM - 4:00 PM",
  location: "Main Auditorium & Virtual Livestream",
  address: "O-56, Bihari Colony, Man Sarovar Park, Vishwas Nagar, Near Raj Banquet Hall, Shahdara Delhi-110032",
  description: "",
  registrationOpen: true,
  image: "/event-townhall.png",
  secondaryTitle: "Networking Solution Opportunities:",
  secondaryImage: "/news-innovation.png",
  secondaryDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum known been industry's standard dummy text ever since 1966, when designers towards Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
  promoTitle: "IN CONCERT",
  promoAccess: "FREE ACCESS",
  seatsFilled: "TOTAL 100 SEAT",
  venuePhotos: [...DEFAULT_VENUE_PHOTOS],
  speakers: JSON.parse(JSON.stringify(DEFAULT_SPEAKERS)),
  showOnHome: true,
  showOnEventsPage: true,
}

const EMPTY_KIT = { label: "", type: "ZIP · 45 MB", filename: "" }

const EMPTY_GALLERY = { title: "", date: "", location: "", image: "", images: [] as string[] }

export default function AdminEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home-events")
  const [events, setEvents] = useState<EventItem[]>([])
  const [kits, setKits] = useState<EventKit[]>([])
  const [galleries, setGalleries] = useState<EventGallery[]>([])
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [headerSaved, setHeaderSaved] = useState(false)

  // Modals state
  const [eventModal, setEventModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [eventForm, setEventForm] = useState<typeof EMPTY_EVENT>({ ...EMPTY_EVENT })
  const [modalTab, setModalTab] = useState<"general" | "secondary" | "sidebar" | "gallery" | "speakers">("general")

  const [kitModal, setKitModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedKit, setSelectedKit] = useState<EventKit | null>(null)
  const [kitForm, setKitForm] = useState<typeof EMPTY_KIT>({ ...EMPTY_KIT })

  const [galModal, setGalModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedGal, setSelectedGal] = useState<EventGallery | null>(null)
  const [galForm, setGalForm] = useState<typeof EMPTY_GALLERY>({ ...EMPTY_GALLERY })

  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [view, setView] = useState<"cards" | "table">("table")
  const [search, setSearch] = useState("")

  const reload = useCallback(() => {
    setEvents(getEvents())
    setKits(getEventKits())
    setGalleries(getEventGalleries())
    setSettings(getSettings())
  }, [])

  useEffect(() => { reload() }, [reload])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  function handleSaveHeader() {
    saveSettingsData(settings)
    setHeaderSaved(true)
    setTimeout(() => setHeaderSaved(false), 2500)
  }

  // ─── Event Handlers ────────────────────────────────────────────────────────
  function openAddEvent(target?: "home" | "events") {
    setSelectedEvent(null)
    setEventForm({
      ...EMPTY_EVENT,
      showOnHome: target === "home" || target === undefined || activeTab === "home-events",
      showOnEventsPage: target === "events" || target === undefined || activeTab === "events-page",
    })
    setModalTab("general")
    setEventModal("add")
  }

  function openEditEvent(item: EventItem) {
    setSelectedEvent(item)
    setEventForm({
      title: item.title,
      type: item.type,
      date: item.date,
      time: item.time,
      location: item.location,
      address: item.address || "O-56, Bihari Colony, Man Sarovar Park, Vishwas Nagar, Near Raj Banquet Hall, Shahdara Delhi-110032",
      description: item.description ?? "",
      registrationOpen: item.registrationOpen,
      image: item.image ?? "/event-townhall.png",
      secondaryTitle: item.secondaryTitle || "Networking Solution Opportunities:",
      secondaryImage: item.secondaryImage || "/news-innovation.png",
      secondaryDescription: item.secondaryDescription || "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      promoTitle: item.promoTitle || "IN CONCERT",
      promoAccess: item.promoAccess || "FREE ACCESS",
      seatsFilled: item.seatsFilled || "TOTAL 100 SEAT",
      venuePhotos: item.venuePhotos?.length ? [...item.venuePhotos] : [...DEFAULT_VENUE_PHOTOS],
      speakers: item.speakers?.length ? JSON.parse(JSON.stringify(item.speakers)) : JSON.parse(JSON.stringify(DEFAULT_SPEAKERS)),
      showOnHome: item.showOnHome !== false,
      showOnEventsPage: item.showOnEventsPage !== false,
    })
    setModalTab("general")
    setEventModal("edit")
  }

  async function handleSaveEvent() {
    if (!eventForm.title.trim()) return
    setSaving(true)
    if (eventModal === "add") {
      const created = saveEvent(eventForm)
      reload()
      flash(created.id)
    } else if (eventModal === "edit" && selectedEvent) {
      updateEvent(selectedEvent.id, eventForm)
      reload()
      flash(selectedEvent.id)
    }
    setSaving(false)
    setEventModal(null)
  }

  function handleDeleteEvent() {
    if (!selectedEvent) return
    deleteEvent(selectedEvent.id)
    reload()
    setEventModal(null)
  }

  // Speaker helper inside modal
  function addSpeakerToForm() {
    setEventForm((f) => ({
      ...f,
      speakers: [
        ...(f.speakers || []),
        {
          name: "New Speaker",
          role: "Keynote Speaker",
          title: "Strategic Innovation Conference",
          time: "10:00 AM - 12:00 PM",
          location: "LONDON, UK",
          avatar: "/leader-ceo.png",
          isHighlighted: false,
        },
      ],
    }))
  }

  function removeSpeakerFromForm(idx: number) {
    setEventForm((f) => ({
      ...f,
      speakers: (f.speakers || []).filter((_, i) => i !== idx),
    }))
  }

  function updateSpeakerForm(idx: number, updates: Partial<EventSpeaker>) {
    setEventForm((f) => ({
      ...f,
      speakers: (f.speakers || []).map((s, i) => (i === idx ? { ...s, ...updates } : s)),
    }))
  }

  // Gallery photo update inside modal
  function updateVenuePhoto(idx: number, url: string) {
    setEventForm((f) => {
      const photos = [...(f.venuePhotos || DEFAULT_VENUE_PHOTOS)]
      photos[idx] = url
      return { ...f, venuePhotos: photos }
    })
  }

  // ─── Kit Handlers ──────────────────────────────────────────────────────────
  function openAddKit() {
    setSelectedKit(null)
    setKitForm({ label: "", type: "ZIP · 45 MB", filename: "Event-Asset-Pack.zip" })
    setKitModal("add")
  }

  function openEditKit(item: EventKit) {
    setSelectedKit(item)
    setKitForm({ label: item.label, type: item.type, filename: item.filename })
    setKitModal("edit")
  }

  async function handleSaveKit() {
    if (!kitForm.label.trim()) return
    setSaving(true)
    if (kitModal === "add") {
      const created = saveEventKit(kitForm)
      reload()
      flash(created.id)
    } else if (kitModal === "edit" && selectedKit) {
      updateEventKit(selectedKit.id, kitForm)
      reload()
      flash(selectedKit.id)
    }
    setSaving(false)
    setKitModal(null)
  }

  function handleDeleteKit() {
    if (!selectedKit) return
    deleteEventKit(selectedKit.id)
    reload()
    setKitModal(null)
  }

  // ─── Gallery Handlers ──────────────────────────────────────────────────────
  function openAddGal() {
    setSelectedGal(null)
    setGalForm({
      title: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      location: "Global Headquarters",
      image: "/event-townhall.png",
      images: ["/event-townhall.png", "/news-innovation.png", "/video-brandfilm.png"],
    })
    setGalModal("add")
  }

  function openEditGal(item: EventGallery) {
    setSelectedGal(item)
    setGalForm({
      title: item.title,
      date: item.date,
      location: item.location,
      image: item.image,
      images: item.images?.length ? [...item.images] : ["/event-townhall.png"],
    })
    setGalModal("edit")
  }

  async function handleSaveGal() {
    if (!galForm.title.trim()) return
    setSaving(true)
    const galleryData = {
      ...galForm,
      image: galForm.image || galForm.images[0] || "/event-townhall.png",
      count: `${galForm.images.length} Images`,
    }
    if (galModal === "add") {
      const created = saveEventGallery(galleryData)
      reload()
      flash(created.id)
    } else if (galModal === "edit" && selectedGal) {
      updateEventGallery(selectedGal.id, galleryData)
      reload()
      flash(selectedGal.id)
    }
    setSaving(false)
    setGalModal(null)
  }

  function handleDeleteGal() {
    if (!selectedGal) return
    deleteEventGallery(selectedGal.id)
    reload()
    setGalModal(null)
  }

  const tabEvents = events.filter((e) => {
    if (activeTab === "home-events") return e.showOnHome !== false
    if (activeTab === "events-page") return e.showOnEventsPage !== false
    return true
  })
  const searchFiltered = search.trim() === "" ? tabEvents : tabEvents.filter(
    (e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())
  )
  const filteredEvents = typeFilter === "all" ? searchFiltered : searchFiltered.filter((e) => e.type.toLowerCase() === typeFilter.toLowerCase())

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 lg:p-8 space-y-6">

      {/* Executive Red & Black Textured Header Bar */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-4 px-6 lg:py-5 lg:px-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-red-900/40"
        style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
      >
        <div className="relative space-y-1 max-w-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/15 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#E60012] animate-ping" />
              Event Operations
            </span>
            <span className="text-gray-300 text-xs font-semibold">• Synced to Main Home Page &amp; /events Page</span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <CalendarDays className="size-5 text-[#E60012]" /> Events Management
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Manage upcoming events, venue photo galleries, and speaker schedules populated live across the platform.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => setView((v) => (v === "cards" ? "table" : "cards"))}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            {view === "cards" ? <><List className="size-4" /> Table Format</> : <><LayoutGrid className="size-4" /> Cards Format</>}
          </button>
          <Link
            href="/events"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            <ExternalLink className="size-3.5" /> Live Page
          </Link>
          <button
            onClick={openAddEvent}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="size-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 pt-1">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.key
          let count = 0
          if (t.key === "home-events") count = events.filter((e) => e.showOnHome !== false).length
          else if (t.key === "events-page") count = events.filter((e) => e.showOnEventsPage !== false).length
          else if (t.key === "kits") count = kits.length
          else if (t.key === "galleries") count = galleries.length

          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#E60012] text-white border-[#E60012] shadow-md shadow-[#E60012]/20"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className="size-4" />
              {t.label}
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">

        {/* Tab 1 & Tab 2: HOME EVENTS or EVENTS PAGE */}
        {(activeTab === "home-events" || activeTab === "events-page") && (
          <div className="space-y-6">
            {/* Filter Bar with Pills + Search on Right */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Filter className="size-3.5" /> Category:
                </span>
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center ${
                    typeFilter === "all"
                      ? "bg-[#E60012] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>All Event Types</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1.5 ${
                    typeFilter === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                  }`}>
                    {tabEvents.length}
                  </span>
                </button>
                {EVENT_TYPES.map((t) => {
                  const count = tabEvents.filter((e) => e.type === t).length
                  const isActive = typeFilter === t
                  return (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center ${
                        isActive
                          ? "bg-[#E60012] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span>{t}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1.5 ${
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
                  placeholder="Search events by title or location..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#E60012]"
                />
              </div>
            </div>

            {view === "table" ? (
              /* High-Density Executive Table View */
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-black text-white border-b border-gray-800 uppercase tracking-wider text-[11px] font-black">
                        <th className="py-3.5 px-4 font-bold">Event Photo</th>
                        <th className="py-3.5 px-4 font-bold">Type &amp; Status</th>
                        <th className="py-3.5 px-4 font-bold">Event Title &amp; Venue</th>
                        <th className="py-3.5 px-4 font-bold">Date &amp; Time</th>
                        <th className="py-3.5 px-4 font-bold text-center">Speakers</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredEvents.map((evt) => {
                        const cover = evt.image || "/event-townhall.png"
                        const isFlashed = flashId === evt.id

                        return (
                          <tr 
                            key={evt.id} 
                            className={`hover:bg-red-50/30 transition-colors ${
                              isFlashed ? "bg-green-50/80" : ""
                            }`}
                          >
                            {/* Photo */}
                            <td className="py-3 px-4">
                              <div className="relative h-12 w-20 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm shrink-0">
                                <Image src={cover} alt="" fill className="object-cover" unoptimized={cover.startsWith("data:")} />
                              </div>
                            </td>

                            {/* Type & Status */}
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <span className="inline-block bg-red-50 text-[#E60012] px-2.5 py-0.5 rounded-md text-[10px] font-black border border-red-100 uppercase tracking-wider">
                                  {evt.type}
                                </span>
                                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  evt.registrationOpen ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600"
                                }`}>
                                  {evt.registrationOpen ? "• Open" : "Closed"}
                                </span>
                              </div>
                            </td>

                            {/* Title & Venue */}
                            <td className="py-3 px-4 max-w-sm">
                              <div className="space-y-0.5">
                                <h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-1">
                                  {evt.title}
                                </h4>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 line-clamp-1">
                                  <MapPin className="size-3 text-[#E60012]" /> {evt.location}
                                </p>
                              </div>
                            </td>

                            {/* Date & Time */}
                            <td className="py-3 px-4">
                              <div className="space-y-0.5 text-gray-700 font-bold">
                                <p className="text-xs">{evt.date}</p>
                                <p className="text-[10px] text-gray-400 font-normal">{evt.time}</p>
                              </div>
                            </td>

                            {/* Speakers Count */}
                            <td className="py-3 px-4 text-center">
                              <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md text-[11px] font-bold">
                                👥 {(evt.speakers || []).length} Speakers
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditEvent(evt)}
                                  className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                                  title="Edit Event"
                                >
                                  <Pencil className="size-3.5" />
                                </button>
                                <button
                                  onClick={() => openDeleteEvent(evt)}
                                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                                  title="Delete Event"
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((evt) => {
                  const cover = evt.image || "/event-townhall.png"
                  return (
                    <div
                      key={evt.id}
                      className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                        flashId === evt.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"
                      }`}
                    >
                      <div>
                        <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                          <Image src={cover} alt={evt.title} fill className="object-cover" unoptimized={cover.startsWith("data:")} />
                          <span className="absolute top-3 left-3 bg-[#E60012] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {evt.type}
                          </span>
                          <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            evt.registrationOpen ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300"
                          }`}>
                            {evt.registrationOpen ? "Registration Open" : "Closed"}
                          </span>
                        </div>
                        <div className="p-5 space-y-2">
                          <h3 className="font-display text-base font-bold text-gray-900 leading-snug line-clamp-2">{evt.title}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5"><Clock className="size-3.5 text-[#E60012]" /> {evt.date} · {evt.time}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin className="size-3.5 text-[#E60012]" /> {evt.location}</p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-gray-100 mt-2">
                        <span className="text-[11px] text-gray-400 font-bold">{(evt.speakers || []).length} Speakers</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditEvent(evt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 hover:bg-black hover:text-white transition cursor-pointer"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => openDeleteEvent(evt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <button
                  onClick={openAddEvent}
                  className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#E60012] text-gray-400 hover:text-[#E60012] transition-all min-h-[260px] cursor-pointer"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#E60012]/10 transition-colors">
                    <Plus className="size-6 text-[#E60012]" />
                  </span>
                  <span className="text-xs font-bold">Add New Event</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: EVENT KITS & TEMPLATES */}
        {activeTab === "kits" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200">
              <div>
                <h2 className="font-display text-lg font-black text-[#cc0000] flex items-center gap-2 border-l-4 border-l-[#cc0000] pl-3">
                  <Download className="size-5 text-[#cc0000]" /> Event Kits &amp; Branding Templates
                </h2>
                <p className="text-xs text-gray-500 mt-1 pl-3">Downloadable branding packs, slide decks, and photography briefs on the /events page.</p>
              </div>
              <button
                onClick={openAddKit}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 hover:bg-[#a80000] cursor-pointer"
              >
                <Plus className="size-4" /> Add Event Kit
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kits.map((kit) => (
                <div key={kit.id} className={`bg-white border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:border-[#cc0000] transition-all ${flashId === kit.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center bg-[#cc0000]/10 text-[#cc0000] rounded-xl shrink-0">
                      <Download className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{kit.label}</p>
                      <p className="text-xs font-semibold text-[#cc0000] mt-0.5">{kit.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button onClick={() => openEditKit(kit)} className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition cursor-pointer" title="Edit"><Pencil className="size-3.5" /></button>
                    <button onClick={() => { setSelectedKit(kit); setKitModal("delete"); }} className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition cursor-pointer" title="Delete"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              ))}
              <button onClick={openAddKit} className="group flex items-center justify-center gap-2 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] p-5 transition-all cursor-pointer">
                <Plus className="size-5" /><span className="text-sm font-bold">Add Event Kit</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: PAST EVENT GALLERIES */}
        {activeTab === "galleries" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200">
              <div>
                <h2 className="font-display text-lg font-black text-gray-900 flex items-center gap-2 border-l-4 border-l-[#cc0000] pl-3">
                  <ImageIcon className="size-5 text-[#cc0000]" /> Past Event Photo Galleries
                </h2>
                <p className="text-xs text-gray-500 mt-1 pl-3">Multi-photo gallery albums from completed events shown on /events and dedicated gallery pages.</p>
              </div>
              <button
                onClick={openAddGal}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 hover:bg-[#a80000] cursor-pointer"
              >
                <Plus className="size-4" /> Add Event Gallery
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {galleries.map((gal) => {
                const cover = gal.image || gal.images[0] || "/event-townhall.png"
                return (
                  <div key={gal.id} className={`bg-white border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${flashId === gal.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"}`}>
                    <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden">
                      <Image src={cover} alt={gal.title} fill className="object-cover" unoptimized={cover.startsWith("data:")} />
                      <span className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {gal.images?.length || 0} Photos
                      </span>
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <Link href={`/events/gallery/${gal.id}`} target="_blank" className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black transition" title="Preview"><ExternalLink className="size-3.5" /></Link>
                        <button onClick={() => openEditGal(gal)} className="flex size-8 items-center justify-center rounded-lg bg-white text-gray-800 hover:bg-black hover:text-white transition cursor-pointer" title="Edit"><Pencil className="size-3.5" /></button>
                        <button onClick={() => { setSelectedGal(gal); setGalModal("delete"); }} className="flex size-8 items-center justify-center rounded-lg bg-white text-gray-800 hover:bg-red-600 hover:text-white transition cursor-pointer" title="Delete"><Trash2 className="size-3.5" /></button>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-display text-sm font-bold text-gray-900 leading-snug line-clamp-2">{gal.title}</h3>
                      <p className="text-xs text-gray-500 font-medium">{gal.location} · {gal.date}</p>
                    </div>
                  </div>
                )
              })}
              <button onClick={openAddGal} className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] min-h-[220px] transition-all cursor-pointer">
                <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10"><Plus className="size-6" /></span>
                <span className="text-sm font-bold">Add Event Gallery</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ─── FULL FEATURED ADD/EDIT EVENT MODAL ────────────────────────────── */}
      {(eventModal === "add" || eventModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">Event Editor</p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {eventModal === "add" ? "Add New Event (Full Details Page)" : "Edit Event Details & Schedule"}
                </h2>
              </div>
              <button onClick={() => setEventModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 bg-gray-50 border-b border-gray-200 overflow-x-auto shrink-0">
              <button
                onClick={() => setModalTab("general")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 ${
                  modalTab === "general"
                    ? "border-[#cc0000] text-[#cc0000] bg-white shadow-xs"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                1. General Info
              </button>
              <button
                onClick={() => setModalTab("secondary")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 ${
                  modalTab === "secondary"
                    ? "border-[#cc0000] text-[#cc0000] bg-white shadow-xs"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                2. Secondary Section
              </button>
              <button
                onClick={() => setModalTab("sidebar")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 ${
                  modalTab === "sidebar"
                    ? "border-[#cc0000] text-[#cc0000] bg-white shadow-xs"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                3. Address &amp; Promo Card
              </button>
              <button
                onClick={() => setModalTab("gallery")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 ${
                  modalTab === "gallery"
                    ? "border-[#cc0000] text-[#cc0000] bg-white shadow-xs"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                4. Venue Gallery ({eventForm.venuePhotos?.length || 0})
              </button>
              <button
                onClick={() => setModalTab("speakers")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 ${
                  modalTab === "speakers"
                    ? "border-[#cc0000] text-[#cc0000] bg-white shadow-xs"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                5. Speakers ({eventForm.speakers?.length || 0})
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

              {/* ─── TAB 1: GENERAL INFO ──────────────────────────────────── */}
              {modalTab === "general" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Main Event Banner Cover Photo <span className="text-[#cc0000]">*</span></label>
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
                      {eventForm.image ? (
                        <Image src={eventForm.image} alt="" fill className="object-cover" unoptimized={eventForm.image.startsWith("data:")} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <CalendarDays className="size-10 opacity-30" />
                        </div>
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl py-2 text-xs font-semibold text-gray-600 hover:text-[#cc0000] transition">
                      <Upload className="size-4" /> Upload Main Cover Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const r = new FileReader()
                          r.onload = (ev) => setEventForm((f) => ({ ...f, image: ev.target?.result as string }))
                          r.readAsDataURL(file)
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Event Title <span className="text-[#cc0000]">*</span></label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Global Town Hall Kickoff Global Meriline Show"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Event Category / Type</label>
                      <select
                        value={eventForm.type}
                        onChange={(e) => setEventForm((f) => ({ ...f, type: e.target.value as EventItem["type"] }))}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-[#cc0000]"
                      >
                        {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-gray-100 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={eventForm.registrationOpen}
                          onChange={(e) => setEventForm((f) => ({ ...f, registrationOpen: e.target.checked }))}
                          className="size-4 accent-[#E60012] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-800">Registration Open</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer bg-red-50/70 border border-red-100 px-3 py-1.5 rounded-xl">
                        <input
                          type="checkbox"
                          checked={eventForm.showOnHome !== false}
                          onChange={(e) => setEventForm((f) => ({ ...f, showOnHome: e.target.checked }))}
                          className="size-4 accent-[#E60012] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-[#E60012]">Display on Main Home Page</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-xl">
                        <input
                          type="checkbox"
                          checked={eventForm.showOnEventsPage !== false}
                          onChange={(e) => setEventForm((f) => ({ ...f, showOnEventsPage: e.target.checked }))}
                          className="size-4 accent-[#E60012] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-900">Display on Public /events Page</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Date</label>
                      <input
                        type="text"
                        value={eventForm.date}
                        onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))}
                        placeholder="24 July 2026"
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Time Range</label>
                      <input
                        type="text"
                        value={eventForm.time}
                        onChange={(e) => setEventForm((f) => ({ ...f, time: e.target.value }))}
                        placeholder="10:00 AM - 6:00 PM"
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Primary Description Paragraph</label>
                    <textarea
                      rows={3}
                      value={eventForm.description}
                      onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Detailed Event Overview Paragraph..."
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ─── TAB 2: SECONDARY SECTION ─────────────────────────────── */}
              {modalTab === "secondary" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Secondary Feature Image</label>
                    <div className="relative aspect-[16/7] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
                      {eventForm.secondaryImage ? (
                        <Image src={eventForm.secondaryImage} alt="" fill className="object-cover" unoptimized={eventForm.secondaryImage.startsWith("data:")} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <ImageIcon className="size-8 opacity-30" />
                        </div>
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-xl py-2 text-xs font-semibold text-gray-600 hover:text-[#cc0000] transition">
                      <Upload className="size-4" /> Upload Secondary Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const r = new FileReader()
                          r.onload = (ev) => setEventForm((f) => ({ ...f, secondaryImage: ev.target?.result as string }))
                          r.readAsDataURL(file)
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Secondary Section Title</label>
                    <input
                      type="text"
                      value={eventForm.secondaryTitle}
                      onChange={(e) => setEventForm((f) => ({ ...f, secondaryTitle: e.target.value }))}
                      placeholder="e.g. Networking Solution Opportunities:"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Secondary Section Description</label>
                    <textarea
                      rows={4}
                      value={eventForm.secondaryDescription}
                      onChange={(e) => setEventForm((f) => ({ ...f, secondaryDescription: e.target.value }))}
                      placeholder="Secondary section description text..."
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ─── TAB 3: SIDEBAR ADDRESS & PROMO ───────────────────────── */}
              {modalTab === "sidebar" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Venue Location Name</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. Main Auditorium, Headquarters"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Full Address Text (Shown under Map)</label>
                    <textarea
                      rows={2}
                      value={eventForm.address}
                      onChange={(e) => setEventForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="O-56, Bihari Colony, Man Sarovar Park, Vishwas Nagar, Near Raj Banquet Hall, Shahdara Delhi-110032"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Live Concert / Promo Sidebar Card</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700">Promo Badge Title</label>
                        <input
                          type="text"
                          value={eventForm.promoTitle}
                          onChange={(e) => setEventForm((f) => ({ ...f, promoTitle: e.target.value }))}
                          placeholder="IN CONCERT"
                          className="w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700">Access Subtitle</label>
                        <input
                          type="text"
                          value={eventForm.promoAccess}
                          onChange={(e) => setEventForm((f) => ({ ...f, promoAccess: e.target.value }))}
                          placeholder="FREE ACCESS"
                          className="w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700">Seats Info</label>
                        <input
                          type="text"
                          value={eventForm.seatsFilled}
                          onChange={(e) => setEventForm((f) => ({ ...f, seatsFilled: e.target.value }))}
                          placeholder="TOTAL 100 SEAT"
                          className="w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#cc0000]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 4: VENUE GALLERY (5 PHOTOS) ────────────────────── */}
              {modalTab === "gallery" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Venue Photo Gallery (5 Photos)</h4>
                      <p className="text-[11px] text-gray-500">Photo 1 is the large left tall photo; Photos 2-5 form the 2x2 grid on right.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const photoUrl = (eventForm.venuePhotos || [])[idx] || DEFAULT_VENUE_PHOTOS[idx]
                      return (
                        <div key={idx} className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-[10px] font-bold text-gray-700">
                            {idx === 0 ? "Photo 1 (Large Tall)" : `Photo ${idx + 1}`}
                          </p>
                          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-900 border border-gray-200">
                            <Image src={photoUrl} alt="" fill className="object-cover" unoptimized={photoUrl.startsWith("data:")} />
                          </div>
                          <label className="flex items-center justify-center gap-1.5 border border-gray-200 bg-white hover:border-[#cc0000] rounded-lg py-1 text-[11px] font-bold text-gray-700 hover:text-[#cc0000] cursor-pointer transition">
                            <Upload className="size-3" /> Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                const r = new FileReader()
                                r.onload = (ev) => updateVenuePhoto(idx, ev.target?.result as string)
                                r.readAsDataURL(file)
                              }}
                            />
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── TAB 5: SPEAKERS & SCHEDULE BUILDER ──────────────────── */}
              {modalTab === "speakers" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Event Speakers &amp; Sessions List</h4>
                      <p className="text-[11px] text-gray-500">Manage time slots, conference titles, speaker names, roles, and location.</p>
                    </div>
                    <button
                      onClick={addSpeakerToForm}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#cc0000] text-white text-xs font-bold shadow hover:bg-[#a80000] cursor-pointer"
                    >
                      <Plus className="size-3.5" /> Add Speaker Session
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(eventForm.speakers || []).map((spk, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <span className="text-xs font-black text-[#cc0000]">Session #{i + 1}</span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(spk.isHighlighted)}
                                onChange={(e) => updateSpeakerForm(i, { isHighlighted: e.target.checked })}
                                className="size-3.5 accent-[#cc0000] cursor-pointer"
                              />
                              Active Red Capsule Highlight
                            </label>
                            <button
                              onClick={() => removeSpeakerFromForm(i)}
                              className="text-xs text-red-600 font-bold hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700">Time Slot</label>
                            <input
                              type="text"
                              value={spk.time}
                              onChange={(e) => updateSpeakerForm(i, { time: e.target.value })}
                              placeholder="9:00 AM - 4:00 PM"
                              className="w-full border rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#cc0000]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700">Conference Session Title</label>
                            <input
                              type="text"
                              value={spk.title}
                              onChange={(e) => updateSpeakerForm(i, { title: e.target.value })}
                              placeholder="Global Innovation Of Conference"
                              className="w-full border rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#cc0000]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700">Speaker Name</label>
                            <input
                              type="text"
                              value={spk.name}
                              onChange={(e) => updateSpeakerForm(i, { name: e.target.value })}
                              placeholder="Michael Wilson"
                              className="w-full border rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#cc0000]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700">Speaker Role</label>
                            <input
                              type="text"
                              value={spk.role}
                              onChange={(e) => updateSpeakerForm(i, { role: e.target.value })}
                              placeholder="Speaker"
                              className="w-full border rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#cc0000]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700">Speaker Location</label>
                            <input
                              type="text"
                              value={spk.location}
                              onChange={(e) => updateSpeakerForm(i, { location: e.target.value })}
                              placeholder="LONDON, UK"
                              className="w-full border rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#cc0000]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Editing step {modalTab}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setEventModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  disabled={saving || !eventForm.title.trim()}
                  className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
                >
                  <Save className="size-4" /> {saving ? "Saving…" : "Save Full Event Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {eventModal === "delete" && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Event?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedEvent.title}&rdquo; ({selectedEvent.date})
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEventModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteEvent} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT KIT MODAL ─────────────────────────────────────────────── */}
      {(kitModal === "add" || kitModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">{kitModal === "add" ? "Add Event Kit" : "Edit Kit"}</h2>
              <button onClick={() => setKitModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 text-white cursor-pointer"><X className="size-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Kit Title / Label *</label>
                <input type="text" value={kitForm.label} onChange={(e) => setKitForm((f) => ({ ...f, label: e.target.value }))} placeholder="e.g. Conference Branding Pack" className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Upload File (PDF, ZIP, PPT, DOC)</label>
                <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-2xl bg-gray-50 hover:bg-[#cc0000]/5 cursor-pointer transition-colors group">
                  <div className="size-11 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="size-5 text-[#cc0000]" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800">
                      {kitForm.filename ? (
                        <span className="text-[#cc0000] flex items-center gap-1.5 justify-center">
                          <CheckCircle className="size-4" /> Selected: {kitForm.filename}
                        </span>
                      ) : (
                        "Click to browse or drag and drop file here"
                      )}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Supports ZIP, PPT, PDF, DOC, XLS up to 100MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE'
                      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
                      setKitForm((f) => ({
                        ...f,
                        filename: file.name,
                        type: `${ext} · ${sizeMb} MB`,
                        label: f.label || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                      }))
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">File Type &amp; Size</label>
                  <input type="text" value={kitForm.type} onChange={(e) => setKitForm((f) => ({ ...f, type: e.target.value }))} placeholder="e.g. ZIP · 45 MB" className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Filename</label>
                  <input type="text" value={kitForm.filename} onChange={(e) => setKitForm((f) => ({ ...f, filename: e.target.value }))} placeholder="e.g. Branding-Pack.zip" className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setKitModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
              <button onClick={handleSaveKit} disabled={saving || !kitForm.label.trim()} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer">
                <Save className="size-4" /> Save Kit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT GALLERY MODAL ─────────────────────────────────────────── */}
      {(galModal === "add" || galModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h2 className="font-display text-base font-black">{galModal === "add" ? "Add Event Gallery" : "Edit Event Gallery"}</h2>
              <button onClick={() => setGalModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 text-white cursor-pointer"><X className="size-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Gallery Title *</label>
                <input type="text" value={galForm.title} onChange={(e) => setGalForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title..." className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={galForm.date} onChange={(e) => setGalForm((f) => ({ ...f, date: e.target.value }))} placeholder="Date (e.g. Jul 2026)" className="border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]" />
                <input type="text" value={galForm.location} onChange={(e) => setGalForm((f) => ({ ...f, location: e.target.value }))} placeholder="Location" className="border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setGalModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
              <button onClick={handleSaveGal} disabled={saving || !galForm.title.trim()} className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer">
                <Save className="size-4" /> Save Gallery
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
