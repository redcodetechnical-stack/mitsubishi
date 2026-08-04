"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Pencil, Trash2, Plus, LayoutGrid, List,
  ExternalLink, Calendar, X, AlertTriangle, FileText,
  Upload, Save, Download, FileCode, FileSpreadsheet, Package,
  FileArchive, Image as ImageIcon, Video, Star, Tag, Building2,
  FolderArchive, Search, CheckCircle, Filter
} from "lucide-react"
import {
  getResources, saveResource, updateResource, deleteResource
} from "@/lib/cms-store"
import type { Resource, FileType, Category, BusinessUnit } from "@/lib/data"

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
  category: "Marketing Assets" as Category,
  business: "Group" as BusinessUnit,
  fileType: "ZIP" as FileType,
  size: "45.2 MB",
  year: 2026,
  downloads: 1420,
  updated: "Jul 2026",
  featured: true,
  isHomeTrending: false,
  tags: "Logos, Brand, Campaign",
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
        if (!ctx) {
          resolve(reader.result as string)
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/webp", quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

function readDocumentFile(file: File): Promise<{ dataUrl: string; sizeStr: string; name: string; detectedType: FileType }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read document file"))
    reader.onload = () => {
      const ext = file.name.split('.').pop()?.toUpperCase() || ''
      let detectedType: FileType = "PDF"
      if (ext === "PDF") detectedType = "PDF"
      else if (ext === "PPT" || ext === "PPTX") detectedType = "PPT"
      else if (ext === "DOC" || ext === "DOCX") detectedType = "DOC"
      else if (ext === "XLS" || ext === "XLSX") detectedType = "XLS"
      else if (ext === "ZIP" || ext === "RAR" || ext === "7Z") detectedType = "ZIP"
      else if (ext === "MP4" || ext === "MOV" || ext === "AVI") detectedType = "Video"
      else if (ext === "PNG" || ext === "JPG" || ext === "JPEG" || ext === "SVG") detectedType = "Image"

      resolve({
        dataUrl: reader.result as string,
        sizeStr: formatBytes(file.size),
        name: file.name,
        detectedType,
      })
    }
    reader.readAsDataURL(file)
  })
}

export default function AdminMarketingAssetsPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [view, setView] = useState<"cards" | "table">("table")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Modal State
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<Resource | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [flashId, setFlashId] = useState<string | null>(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const reload = useCallback(() => {
    const all = getResources()
    setResources(all.filter((r) => r.category === "Marketing Assets"))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  function openAdd() {
    setSelected(null)
    setForm({
      title: "",
      description: "",
      category: "Marketing Assets",
      business: "Group",
      fileType: "ZIP",
      size: "45.2 MB",
      year: new Date().getFullYear(),
      downloads: Math.floor(Math.random() * 500) + 100,
      updated: "Aug 2026",
      featured: true,
      isHomeTrending: false,
      tags: "Marketing, Asset, Campaign",
      icon: "",
      fileUrl: "",
      fileName: "",
    })
    setUploadError(null)
    setModal("add")
  }

  function openEdit(item: Resource) {
    setSelected(item)
    setForm({
      title: item.title,
      description: item.description || "",
      category: "Marketing Assets",
      business: item.business,
      fileType: item.fileType,
      size: item.size || "",
      year: item.year || 2026,
      downloads: item.downloads || 0,
      updated: item.updated || "Aug 2026",
      featured: Boolean(item.featured),
      isHomeTrending: Boolean(item.isHomeTrending),
      tags: (item.tags || []).join(", "),
      icon: item.icon || "",
      fileUrl: item.fileUrl || "",
      fileName: item.fileName || "",
    })
    setUploadError(null)
    setModal("edit")
  }

  function openDelete(item: Resource) {
    setSelected(item)
    setModal("delete")
  }

  async function handleIconUpload(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploadingIcon(true)
    try {
      const url = await compressIconFile(file)
      setForm((f) => ({ ...f, icon: url }))
    } catch {
      setUploadError("Could not process thumbnail/icon image. Try SVG, PNG, or JPG.")
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
      setUploadError("Failed to upload asset file. Please try again.")
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
        category: "Marketing Assets",
        business: form.business,
        fileType: form.fileType,
        size: form.size || "10.0 MB",
        year: Number(form.year),
        tags: tagsList,
        downloads: Number(form.downloads),
        updated: form.updated || "Aug 2026",
        featured: form.featured,
        isHomeTrending: form.isHomeTrending,
        icon: form.icon,
        fileUrl: form.fileUrl,
        fileName: form.fileName,
      })
      flash(created.id)
    } else if (modal === "edit" && selected) {
      updateResource(selected.id, {
        title: form.title,
        description: form.description,
        category: "Marketing Assets",
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
      flash(selected.id)
    }

    setModal(null)
    setSelected(null)
    reload()
  }

  function handleDelete() {
    if (!selected) return
    deleteResource(selected.id)
    setModal(null)
    setSelected(null)
    reload()
  }

  function triggerDirectDownload(resource: Resource) {
    const filename = resource.fileName || `${resource.title.replace(/[^a-zA-Z0-9]+/g, "-")}.${resource.fileType.toLowerCase()}`
    const element = document.createElement("a")

    if (resource.fileUrl) {
      element.href = resource.fileUrl
      element.download = filename
    } else {
      const fileBlob = new Blob([
        `Mitsubishi Electric Marketing Asset Download\n\nTitle: ${resource.title}\nCategory: Marketing Assets\nFile Type: ${resource.fileType}\nFilename: ${filename}\nOfficial Marketing Asset - Nexus Hub`,
      ], { type: "text/plain" })
      element.href = URL.createObjectURL(fileBlob)
      element.download = filename
    }

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const filtered = resources.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.description?.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (typeFilter !== "all" && r.fileType.toLowerCase() !== typeFilter.toLowerCase()) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 lg:p-8 space-y-6">

      {/* Executive Red & Black Textured Header Bar */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-4 px-6 lg:py-5 lg:px-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-red-900/40"
        style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
      >
        <div className="relative space-y-1 max-w-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-white/15">
              Collateral &amp; Assets
            </span>
            <span className="text-gray-300 text-xs font-semibold">• Campaign Packs &amp; Guidelines</span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <FolderArchive className="size-6 text-[#E60012]" /> Marketing Assets Management
          </h1>
          <p className="text-xs text-gray-200 leading-relaxed">
            Manage official logos, presentation decks, campaign kits, social media collateral, and brand assets for the public portal.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Link
            href="/marketing-assets"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition"
          >
            <ExternalLink className="size-4" /> Live Page
          </Link>
          <button
            onClick={() => setView((v) => (v === "cards" ? "table" : "cards"))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            {view === "cards" ? <><List className="size-4" /> Table View</> : <><LayoutGrid className="size-4" /> Card View</>}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="size-4" /> Add Asset
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Filter className="size-3.5" /> File Type:
          </span>
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center ${
              typeFilter === "all"
                ? "bg-[#E60012] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>All Types</span>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1.5 ${
              typeFilter === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
            }`}>
              {resources.length}
            </span>
          </button>
          {FILE_TYPES.map((t) => {
            const count = resources.filter((r) => r.fileType === t).length
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

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search marketing assets..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#E60012]"
            />
          </div>
        </div>

      {/* Main Grid or Table View */}
      {view === "cards" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const meta = getFileTypeMeta(item.fileType)
            const TypeIcon = meta.icon
            const isFlashed = flashId === item.id

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                  isFlashed ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Icon Badge & Meta */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.icon ? (
                        <div className="relative size-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.icon} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`size-12 rounded-xl border flex items-center justify-center shrink-0 ${meta.color}`}>
                          <TypeIcon className="size-6" />
                        </div>
                      )}

                      <div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${meta.badge}`}>
                          {item.fileType} {item.size ? `· ${item.size}` : ""}
                        </span>
                        <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1">
                          <Building2 className="size-3 text-[#cc0000]" /> {item.business} Unit
                        </p>
                      </div>
                    </div>

                    {item.featured && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="size-3 fill-amber-500 text-amber-500" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-display text-base font-bold text-gray-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {item.description || "Official marketing asset file."}
                    </p>
                  </div>

                  {/* Tags List */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-gray-400">
                    {item.downloads.toLocaleString()} downloads
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => triggerDirectDownload(item)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#cc0000] hover:text-white transition cursor-pointer"
                      title="Download Asset"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                      title="Edit Asset"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => openDelete(item)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                      title="Delete Asset"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={openAdd}
            className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#cc0000] text-gray-400 hover:text-[#cc0000] transition-all min-h-[240px] cursor-pointer"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#cc0000]/10 transition-colors">
              <Plus className="size-6" />
            </span>
            <span className="text-sm font-bold">Add Marketing Asset</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* High-Density Executive Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black text-white border-b border-gray-800 uppercase tracking-wider text-[11px] font-black">
                  <th className="py-3.5 px-4 font-bold">Asset Info &amp; Icon</th>
                  <th className="py-3.5 px-4 font-bold">Business Unit</th>
                  <th className="py-3.5 px-4 font-bold">File Format</th>
                  <th className="py-3.5 px-4 font-bold">File Size</th>
                  <th className="py-3.5 px-4 font-bold">Downloads</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map((item) => {
                  const meta = getFileTypeMeta(item.fileType)
                  const Icon = meta.icon
                  const isFlashed = flashId === item.id

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-red-50/30 transition-colors ${
                        isFlashed ? "bg-green-50/80" : ""
                      }`}
                    >
                      {/* Asset Icon & Title */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.color}`}>
                            {item.icon ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={item.icon} alt="" className="size-full rounded-xl object-cover" />
                            ) : (
                              <Icon className="size-5" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-1 flex items-center gap-1.5">
                              {item.title}
                              {item.featured && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                                  ★ Featured
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Business Unit */}
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md text-[10px] font-bold">
                          {item.business} Unit
                        </span>
                      </td>

                      {/* File Format Badge */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${meta.badge}`}>
                          {item.fileType}
                        </span>
                      </td>

                      {/* Size */}
                      <td className="py-3 px-4 font-bold text-gray-700">
                        {item.size || "12.4 MB"}
                      </td>

                      {/* Downloads */}
                      <td className="py-3 px-4 font-bold text-gray-900">
                        ⚡ {item.downloads.toLocaleString()}
                      </td>

                      {/* Live Status Pill */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-green-200">
                          <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                          Available
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => triggerDirectDownload(item)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#E60012] hover:text-white transition cursor-pointer"
                            title="Download Asset"
                          >
                            <Download className="size-3.5" />
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                            title="Edit Asset"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => openDelete(item)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                            title="Delete Asset"
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

      {/* ─── ADD/EDIT MARKETING ASSET MODAL ─────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">Marketing Asset File</p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {modal === "add" ? "Add Marketing Asset" : "Edit Marketing Asset"}
                </h2>
              </div>
              <button onClick={() => setModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0" /> {uploadError}
                </div>
              )}

              {/* Document File Uploader Dropzone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Upload Asset File (PDF, PPT, DOC, XLS, ZIP, MP4, PNG)</label>
                <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-gray-300 hover:border-[#cc0000] rounded-2xl bg-gray-50 hover:bg-[#cc0000]/5 cursor-pointer transition-colors group">
                  <div className="size-11 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="size-5 text-[#cc0000]" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800">
                      {form.fileName ? (
                        <span className="text-[#cc0000] flex items-center gap-1.5 justify-center">
                          <CheckCircle className="size-4" /> Selected: {form.fileName} ({form.size})
                        </span>
                      ) : (
                        uploadingFile ? "Reading & processing asset file…" : "Click to browse or drag and drop marketing asset file here"
                      )}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Supports PDF, PPT, DOC, XLS, ZIP, MP4, PNG up to 100MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleDocFileUpload(e.target.files?.[0])}
                  />
                </label>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Asset Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Brand Asset Package 2026"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              {/* Category & Business Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category</label>
                  <input
                    type="text"
                    disabled
                    value="Marketing Assets"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-100 text-gray-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Business Unit</label>
                  <select
                    value={form.business}
                    onChange={(e) => setForm((f) => ({ ...f, business: e.target.value as BusinessUnit }))}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-[#cc0000]"
                  >
                    {BUSINESS_UNITS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Type & Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">File Type</label>
                  <select
                    value={form.fileType}
                    onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value as FileType }))}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-[#cc0000]"
                  >
                    {FILE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">File Size (e.g. 45.2 MB)</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    placeholder="e.g. 45.2 MB"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Asset Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Complete collection of official Mitsubishi Electric logos, presentation templates, and campaign collateral..."
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000] resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Search Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="Logos, Brand, Campaign, Video, Template"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#cc0000]"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="size-4 accent-[#cc0000] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-800">Featured Collection</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.title.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> {modal === "add" ? "Save Marketing Asset" : "Update Asset"}
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
                <h3 className="font-display text-base font-black text-gray-900">Delete Marketing Asset?</h3>
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
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
