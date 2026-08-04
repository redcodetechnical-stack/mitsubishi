"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Pencil, Trash2, Plus, LayoutGrid, List,
  ExternalLink, Calendar, X, AlertTriangle, FileText,
  Upload, Save, Download, FileCode, FileSpreadsheet, Package,
  FileArchive, FolderArchive, Image as ImageIcon, Video, File, Star, Tag, Building2,
  Home, Rocket, Palette, CalendarDays, Search, ShieldCheck, Filter
} from "lucide-react"
import {
  getResources, saveResource, updateResource, deleteResource,
  getEventKits, saveEventKit, updateEventKit, deleteEventKit, type EventKit,
  getPolicies, savePolicy, updatePolicy, deletePolicy
} from "@/lib/cms-store"
import type { Resource, FileType, Category, BusinessUnit, PolicyDocument } from "@/lib/data"

type SectionKey = "home-trending" | "marketing-assets" | "brand-centre" | "events-toolkits" | "policies-guidelines" | "search-discovery"

const SECTIONS: { key: SectionKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: "home-trending", label: "Home Page (Trending)", icon: Home, color: "bg-[#E60012]" },
  { key: "marketing-assets", label: "Marketing Campaigns", icon: Rocket, color: "bg-black" },
  { key: "brand-centre", label: "Brand Centre", icon: Palette, color: "bg-[#E60012]" },
  { key: "events-toolkits", label: "Events Toolkits", icon: CalendarDays, color: "bg-gray-800" },
  { key: "policies-guidelines", label: "Policies & Guidelines", icon: ShieldCheck, color: "bg-[#E60012]" },
  { key: "search-discovery", label: "Search & Discovery", icon: Search, color: "bg-black" },
]

const CATEGORIES: Category[] = [
  "Brand Centre",
  "Marketing Assets",
  "Communications",
  "Campaigns",
  "Events",
  "Policies",
  "Knowledge Centre",
  "Announcements",
]

const BUSINESS_UNITS: BusinessUnit[] = [
  "Group",
  "Technology",
  "Consumer",
  "Industrial",
  "Financial Services",
  "Healthcare",
]

const FILE_TYPES: FileType[] = ["PDF", "PPT", "DOC", "XLS", "Image", "Video", "ZIP"]

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Brand Centre" as Category,
  business: "Group" as BusinessUnit,
  fileType: "PDF" as FileType,
  size: "",
  year: 2026,
  downloads: 0,
  updated: "Jul 2026",
  featured: false,
  isHomeTrending: false,
  tags: "",
  icon: "",
  fileUrl: "",
  fileName: "",
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

function getFileTypeMeta(type: FileType | string) {
  const t = (type || "").toUpperCase()
  if (t === "PDF") return { icon: FileText, color: "text-[#E60012] bg-red-50 border-red-200", badge: "bg-[#E60012] text-white" }
  if (t === "PPT") return { icon: FileCode, color: "text-gray-900 bg-gray-100 border-gray-300", badge: "bg-black text-white" }
  if (t === "DOC") return { icon: FileText, color: "text-[#E60012] bg-red-50 border-red-200", badge: "bg-[#E60012] text-white" }
  if (t === "XLS") return { icon: FileSpreadsheet, color: "text-gray-900 bg-gray-100 border-gray-300", badge: "bg-gray-800 text-white" }
  if (t === "ZIP") return { icon: FileArchive, color: "text-[#E60012] bg-red-50 border-red-200", badge: "bg-[#E60012] text-white" }
  if (t === "VIDEO" || t === "MP4") return { icon: Video, color: "text-gray-900 bg-gray-100 border-gray-300", badge: "bg-black text-white" }
  if (t === "IMAGE" || t === "PNG" || t === "JPG") return { icon: ImageIcon, color: "text-[#E60012] bg-red-50 border-red-200", badge: "bg-[#E60012] text-white" }
  return { icon: Package, color: "text-gray-600 bg-gray-50 border-gray-200", badge: "bg-gray-700 text-white" }
}

function compressIconFile(file: File, maxWidth = 250, quality = 0.8): Promise<string> {
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
        resolve(canvas.toDataURL("image/png", quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

function readDocumentFile(file: File): Promise<{ dataUrl: string; sizeStr: string; name: string; detectedType: FileType }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.onload = () => {
      const sizeStr = formatBytes(file.size)
      const name = file.name
      const ext = name.split(".").pop()?.toUpperCase() || ""
      let detectedType: FileType = "PDF"
      if (ext === "PPT" || ext === "PPTX") detectedType = "PPT"
      else if (ext === "DOC" || ext === "DOCX") detectedType = "DOC"
      else if (ext === "XLS" || ext === "XLSX" || ext === "CSV") detectedType = "XLS"
      else if (ext === "ZIP" || ext === "RAR" || ext === "7Z") detectedType = "ZIP"
      else if (ext === "PNG" || ext === "JPG" || ext === "JPEG" || ext === "SVG") detectedType = "Image"
      else if (ext === "MP4" || ext === "MOV" || ext === "AVI") detectedType = "Video"

      resolve({
        dataUrl: reader.result as string,
        sizeStr,
        name,
        detectedType,
      })
    }
    reader.readAsDataURL(file)
  })
}

export default function AdminResourcesPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("home-trending")
  const [resources, setResources] = useState<Resource[]>([])
  const [eventKits, setEventKits] = useState<EventKit[]>([])
  const [policiesData, setPoliciesData] = useState<PolicyDocument[]>([])
  const [view, setView] = useState<"cards" | "table">("table")
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<Resource | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [flashId, setFlashId] = useState<string | null>(null)

  const reloadAll = useCallback(() => {
    setResources(getResources())
    setEventKits(getEventKits())
    setPoliciesData(getPolicies())
  }, [])

  useEffect(() => { reloadAll() }, [reloadAll])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  // Map event kits to resource format
  const eventKitResources: Resource[] = eventKits.map((k) => {
    const parts = k.type.split("·").map((s) => s.trim())
    const fType = (parts[0] || "ZIP") as FileType
    const fSize = parts[1] || "45 MB"
    return {
      id: k.id,
      title: k.label,
      description: "Official event toolkit & branding resource pack.",
      category: "Events",
      business: "Group",
      fileType: FILE_TYPES.includes(fType) ? fType : "ZIP",
      size: fSize,
      year: 2026,
      tags: ["Event", "Kit", "Branding"],
      downloads: 1250,
      updated: "Jul 2026",
      featured: true,
      fileName: k.filename,
    }
  })

  // Map policy documents to resource format
  const policyResources: Resource[] = policiesData.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: "Policies",
    business: "Group",
    fileType: "PDF",
    size: p.fileSize || "1.8 MB",
    year: 2026,
    tags: [p.category, "Policy", "Governance"],
    downloads: p.downloads || 420,
    updated: p.updated || "Jul 2026",
    featured: true,
    fileName: `${p.title.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf`,
  }))

  // Determine current section resources
  let sectionResources: Resource[] = []
  if (activeSection === "home-trending") {
    const trending = resources.filter((r) => r.isHomeTrending)
    sectionResources = trending.length > 0 ? trending : [...resources].sort((a, b) => b.downloads - a.downloads).slice(0, 4)
  } else if (activeSection === "marketing-assets") {
    sectionResources = resources.filter((r) => r.category === "Marketing Assets" || r.category === "Campaigns")
  } else if (activeSection === "brand-centre") {
    sectionResources = resources.filter((r) => r.category === "Brand Centre")
  } else if (activeSection === "events-toolkits") {
    sectionResources = [...resources.filter((r) => r.category === "Events"), ...eventKitResources]
  } else if (activeSection === "policies-guidelines") {
    sectionResources = [...resources.filter((r) => r.category === "Policies"), ...policyResources]
  } else if (activeSection === "search-discovery") {
    sectionResources = resources
  }

  const filtered = sectionResources.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    (item.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  function openAdd() {
    setSelected(null)
    setForm({
      ...EMPTY_FORM,
      category: activeSection === "brand-centre" ? "Brand Centre" : activeSection === "marketing-assets" ? "Marketing Assets" : activeSection === "events-toolkits" ? "Events" : activeSection === "policies-guidelines" ? "Policies" : "Brand Centre",
      isHomeTrending: activeSection === "home-trending",
    })
    setModal("add")
  }

  function openEdit(item: Resource) {
    setSelected(item)
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      business: item.business,
      fileType: item.fileType,
      size: item.size || "",
      year: item.year || 2026,
      downloads: item.downloads || 0,
      updated: item.updated || "Jul 2026",
      featured: Boolean(item.featured),
      isHomeTrending: Boolean(item.isHomeTrending),
      tags: (item.tags || []).join(", "),
      icon: item.icon || "",
      fileUrl: item.fileUrl || "",
      fileName: item.fileName || "",
    })
    setModal("edit")
  }

  function openDelete(item: Resource) {
    setSelected(item)
    setModal("delete")
  }

  function toggleHomeTrending(item: Resource) {
    updateResource(item.id, { isHomeTrending: !item.isHomeTrending })
    reloadAll()
    flash(item.id)
  }

  async function handleIconUpload(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploadingIcon(true)
    try {
      const url = await compressIconFile(file)
      setForm((f) => ({ ...f, icon: url }))
    } catch {
      setUploadError("Could not process icon file. Try an SVG, PNG or JPG.")
    } finally {
      setUploadingIcon(false)
    }
  }

  async function handleDocFileUpload(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploadingFile(true)
    try {
      const res = await readDocumentFile(file)
      setForm((f) => ({
        ...f,
        fileUrl: res.dataUrl,
        size: res.sizeStr,
        fileName: res.name,
        fileType: res.detectedType,
      }))
    } catch {
      setUploadError("Failed to upload document file. Please try again.")
    } finally {
      setUploadingFile(false)
    }
  }

  function handleSubmit() {
    if (!form.title.trim()) return

    const tagsList = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    if (modal === "add") {
      const created = saveResource({
        title: form.title,
        description: form.description,
        category: form.category,
        business: form.business,
        fileType: form.fileType,
        size: form.size || "2.5 MB",
        year: Number(form.year) || 2026,
        tags: tagsList,
        downloads: Number(form.downloads) || 0,
        updated: form.updated || "Jul 2026",
        featured: form.featured,
        isHomeTrending: form.isHomeTrending,
        icon: form.icon,
        fileUrl: form.fileUrl,
        fileName: form.fileName,
      })

      if (form.category === "Events") {
        saveEventKit({
          label: form.title,
          type: `${form.fileType} · ${form.size || "2.5 MB"}`,
          filename: form.fileName || `${form.title}.zip`,
        })
      } else if (form.category === "Policies") {
        savePolicy({
          title: form.title,
          description: form.description,
          category: "Communication",
          version: "v2026.1",
          updated: form.updated || "Jul 2026",
          fileSize: form.size || "1.8 MB",
          downloads: Number(form.downloads) || 0,
          effective: "Immediate",
        })
      }

      flash(created.id)
    } else if (modal === "edit" && selected) {
      if (selected.id.startsWith("kit-")) {
        updateEventKit(selected.id, {
          label: form.title,
          type: `${form.fileType} · ${form.size}`,
          filename: form.fileName || `${form.title}.zip`,
        })
      } else if (selected.id.startsWith("pol-")) {
        updatePolicy(selected.id, {
          title: form.title,
          description: form.description,
          fileSize: form.size,
          updated: form.updated,
        })
      } else {
        updateResource(selected.id, {
          title: form.title,
          description: form.description,
          category: form.category,
          business: form.business,
          fileType: form.fileType,
          size: form.size,
          year: Number(form.year),
          tags: tagsList,
          downloads: Number(form.downloads),
          updated: form.updated,
          featured: form.featured,
          isHomeTrending: form.isHomeTrending,
          icon: form.icon,
          fileUrl: form.fileUrl,
          fileName: form.fileName,
        })
      }
      flash(selected.id)
    }

    setModal(null)
    setSelected(null)
    reloadAll()
  }

  function handleDelete() {
    if (!selected) return
    if (selected.id.startsWith("kit-")) {
      deleteEventKit(selected.id)
    } else if (selected.id.startsWith("pol-")) {
      deletePolicy(selected.id)
    } else {
      deleteResource(selected.id)
    }
    setModal(null)
    setSelected(null)
    reloadAll()
  }

  function triggerDirectDownload(resource: Resource) {
    const filename = resource.fileName || `${resource.title.replace(/[^a-zA-Z0-9]+/g, "-")}.${resource.fileType.toLowerCase()}`
    const element = document.createElement("a")

    if (resource.fileUrl) {
      element.href = resource.fileUrl
      element.download = filename
    } else {
      const fileBlob = new Blob([
        `Mitsubishi Electric Group Resource Download\n\nTitle: ${resource.title}\nCategory: ${resource.category}\nFile Type: ${resource.fileType}\nFilename: ${filename}\nOfficial Resource - Nexus Hub`,
      ], { type: "text/plain" })
      element.href = URL.createObjectURL(fileBlob)
      element.download = filename
    }

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

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
              Repository Management
            </span>
            <span className="text-gray-300 text-xs font-semibold">• Downloadable Assets Store</span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <FolderArchive className="size-5 text-[#E60012]" /> Asset Management
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Manage downloadable resources, toolkits, brand assets, policy guidelines, and search discovery collateral across all pages.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {/* View Toggle */}
          <button
            onClick={() => setView((v) => (v === "cards" ? "table" : "cards"))}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            {view === "cards" ? <><List className="size-4" /> Table Format</> : <><LayoutGrid className="size-4" /> Cards Format</>}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="size-4" /> Add Resource File
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
            if (s.key === "home-trending") {
              const tr = resources.filter((r) => r.isHomeTrending)
              count = tr.length > 0 ? tr.length : Math.min(4, resources.length)
            } else if (s.key === "marketing-assets") {
              count = resources.filter((r) => r.category === "Marketing Assets" || r.category === "Campaigns").length
            } else if (s.key === "brand-centre") {
              count = resources.filter((r) => r.category === "Brand Centre").length
            } else if (s.key === "events-toolkits") {
              count = resources.filter((r) => r.category === "Events").length + eventKits.length
            } else if (s.key === "policies-guidelines") {
              count = resources.filter((r) => r.category === "Policies").length + policiesData.length
            } else if (s.key === "search-discovery") {
              count = resources.length
            }

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

      {/* ─── Card Grid View ────────────────────────────────────────────────── */}
      {view === "cards" && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200">
              <div className="size-16 rounded-2xl bg-[#cc0000]/10 flex items-center justify-center mb-3">
                <Package className="size-8 text-[#cc0000]" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">No resources found in this section</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Click below to upload and add a resource file to this page.</p>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#a80000] cursor-pointer"
              >
                <Plus className="size-4" /> Add Resource File
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => {
                const meta = getFileTypeMeta(item.fileType)
                const FileIcon = meta.icon

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-[#cc0000]/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Icon Card Header */}
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100/80 border-b border-gray-100 relative flex items-center gap-4">
                      {/* Icon Display */}
                      <div className={`relative size-16 shrink-0 rounded-2xl border flex items-center justify-center shadow-sm ${meta.color}`}>
                        {item.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.icon} alt="Resource Icon" className="size-10 object-contain" />
                        ) : (
                          <FileIcon className="size-8" />
                        )}
                      </div>

                      {/* File Info Header */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${meta.badge}`}>
                            {item.fileType}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {item.size || "2.5 MB"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.fileName || `${item.title}.${item.fileType.toLowerCase()}`}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Slot {i + 1} · {item.business} Unit
                        </p>
                      </div>

                      {/* Home Trending Star Badge Toggle */}
                      <button
                        onClick={() => toggleHomeTrending(item)}
                        title={item.isHomeTrending ? "Remove from Home Trending" : "Add to Home Trending"}
                        className={`absolute top-3 right-3 p-1.5 rounded-full transition-all cursor-pointer ${
                          item.isHomeTrending
                            ? "bg-red-100 text-[#E60012] hover:bg-red-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-[#E60012]"
                        }`}
                      >
                        <Home className={`size-4 ${item.isHomeTrending ? "fill-[#E60012] text-[#E60012]" : ""}`} />
                      </button>

                      {/* Saved Flash */}
                      {flashId === item.id && (
                        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-xs flex items-center justify-center">
                          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                            ✓ Saved
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400">
                        <span className="bg-[#cc0000]/10 text-[#cc0000] font-bold px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <span>{item.downloads.toLocaleString()} downloads</span>
                      </div>

                      <h3 className="font-display text-sm font-bold text-gray-900 leading-snug group-hover:text-[#cc0000] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                        {item.description}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => triggerDirectDownload(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-[#cc0000] transition cursor-pointer"
                          title="Download Resource File"
                        >
                          <Download className="size-3.5" /> Download
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-100 text-xs font-bold text-gray-900 hover:bg-black hover:text-white transition cursor-pointer ml-auto"
                        >
                          <Pencil className="size-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => openDelete(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Add New Card */}
              <button
                onClick={openAdd}
                className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[260px] cursor-pointer"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors">
                  <Plus className="size-6" />
                </span>
                <span className="text-sm font-bold">Add Resource File</span>
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
                <tr className="bg-black text-white border-b border-gray-800 uppercase tracking-wider text-[11px] font-black">
                  <th className="px-5 py-3.5 font-bold">Icon</th>
                  <th className="px-5 py-3.5 font-bold">Asset Title</th>
                  <th className="px-5 py-3.5 font-bold">Category</th>
                  <th className="px-5 py-3.5 font-bold">File Format &amp; Size</th>
                  <th className="px-5 py-3.5 font-bold">Home Trending</th>
                  <th className="px-5 py-3.5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const meta = getFileTypeMeta(item.fileType)
                  const FileIcon = meta.icon
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className={`size-9 rounded-lg border flex items-center justify-center ${meta.color}`}>
                          {item.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.icon} alt="" className="size-5 object-contain" />
                          ) : (
                            <FileIcon className="size-5" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900 max-w-xs truncate">
                        {item.title}
                        {item.fileName && <span className="block text-[10px] text-gray-400 font-mono">{item.fileName}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs">
                        <span className={`px-2 py-0.5 rounded font-bold mr-1.5 ${meta.badge}`}>{item.fileType}</span>
                        <span className="text-gray-500">{item.size}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleHomeTrending(item)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer ${
                            item.isHomeTrending ? "bg-red-100 text-[#E60012]" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.isHomeTrending ? "🏠 Home" : "☆ No"}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => triggerDirectDownload(item)}
                            className="p-1.5 text-gray-400 hover:text-gray-900 cursor-pointer"
                          >
                            <Download className="size-4" />
                          </button>
                          <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 cursor-pointer">
                            <Pencil className="size-4" />
                          </button>
                          <button onClick={() => openDelete(item)} className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer">
                            <Trash2 className="size-4" />
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

      {/* ─── Add / Edit Modal ───────────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {SECTIONS.find((s) => s.key === activeSection)?.label}
                </p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {modal === "add" ? "Add Resource File" : "Edit Resource File"}
                </h2>
              </div>
              <button onClick={() => setModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              {/* Document File Upload */}
              <div className="space-y-2 p-4 rounded-xl border-2 border-dashed border-[#cc0000]/30 bg-[#cc0000]/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Upload className="size-4 text-[#cc0000]" />
                    Document File Upload (PDF, PPT, DOC, ZIP, Image, Video)
                  </label>
                  {form.size && (
                    <span className="text-[10px] font-black bg-[#cc0000] text-white px-2 py-0.5 rounded-full">
                      {form.size}
                    </span>
                  )}
                </div>

                {form.fileName ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="size-5 text-[#cc0000] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{form.fileName}</p>
                        <p className="text-[10px] text-gray-400">{form.fileType} · {form.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, fileUrl: "", fileName: "", size: "" }))}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 w-full py-4 bg-white rounded-xl border border-gray-200 hover:border-[#cc0000] cursor-pointer transition text-center">
                    <Upload className="size-6 text-[#cc0000]" />
                    <span className="text-xs font-bold text-gray-800">Click to upload document file</span>
                    <span className="text-[10px] text-gray-400">PDF, PPTX, DOCX, XLSX, ZIP, PNG, MP4 up to 50MB</span>
                    <input type="file" onChange={(e) => handleDocFileUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
                {uploadingFile && <p className="text-xs text-[#cc0000] font-bold">Uploading &amp; calculating file size…</p>}
              </div>

              {/* Icon Upload */}
              <div className="space-y-2 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <ImageIcon className="size-4 text-gray-600" />
                  Icon Upload (SVG / PNG Icon or Logo)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative size-14 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {form.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.icon} alt="" className="size-8 object-contain" />
                    ) : (
                      <Package className="size-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:border-[#cc0000] hover:text-[#cc0000] cursor-pointer transition">
                      <Upload className="size-3.5" /> Upload Custom Icon
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleIconUpload(e.target.files?.[0])} />
                    </label>
                    <input
                      type="text"
                      value={form.icon}
                      onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                      placeholder="or paste icon URL, e.g. /icons/pdf-brand.svg"
                      className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#cc0000]"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Resource Title <span className="text-[#cc0000]">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Title"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description <span className="text-[#cc0000]">*</span></label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] resize-none"
                />
              </div>

              {/* Category & Business Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Business Unit</label>
                  <select
                    value={form.business}
                    onChange={(e) => setForm((f) => ({ ...f, business: e.target.value as BusinessUnit }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  >
                    {BUSINESS_UNITS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* File Type & File Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">File Type</label>
                  <select
                    value={form.fileType}
                    onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value as FileType }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  >
                    {FILE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">File Size</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    placeholder="e.g. 4.2 MB"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              {/* Home Trending Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-red-200 bg-red-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isHomeTrending}
                    onChange={(e) => setForm((f) => ({ ...f, isHomeTrending: e.target.checked }))}
                    className="size-4 accent-purple-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-purple-900 block">Feature on Home Page (Trending Assets)</span>
                    <span className="text-[10px] text-purple-700 block">Displays this asset in the Home Page Trending Assets section.</span>
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
                {modal === "add" ? "Save Resource File" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Resource File?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selected.title}&rdquo; ({selected.fileType} · {selected.size})
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
