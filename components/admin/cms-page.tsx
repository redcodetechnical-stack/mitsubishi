"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Pencil, Trash2, X, ChevronUp, ChevronDown, AlertTriangle, Eye, Image as ImageIcon } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────────

export type Column<T> = {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
}

export type CMSPageProps<T extends { id: string }> = {
  title: string
  description: string
  columns: Column<T>[]
  data: T[]
  onAdd?: (item: Omit<T, "id">) => void
  onEdit: (id: string, updates: Partial<T>) => void
  onDelete?: (id: string) => void
  formFields: FormField[]
  itemToForm: (item: T) => Record<string, string | boolean | number>
  accentColor?: string
  previewPath?: (item: T) => string
}

export type FormField = {
  key: string
  label: string
  type: "text" | "textarea" | "select" | "checkbox" | "number" | "date" | "image"
  options?: string[]
  placeholder?: string
  required?: boolean
}

// Resize + compress an uploaded image client-side so it stays small enough
// for localStorage (which has a ~5-10MB total budget per origin).
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

// ── Main component ─────────────────────────────────────────────────────────────

export function CMSPage<T extends { id: string }>({
  title, description, columns, data, onAdd, onEdit, onDelete, formFields, itemToForm, previewPath,
}: CMSPageProps<T>) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<T | null>(null)
  const [form, setForm] = useState<Record<string, string | boolean | number>>({})
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  function openAdd() {
    const defaults: Record<string, string | boolean | number> = {}
    formFields.forEach((f) => {
      defaults[f.key] = f.type === "checkbox" ? false : f.type === "number" ? 0 : ""
    })
    setForm(defaults)
    setModal("add")
  }

  function openEdit(item: T) {
    setSelected(item)
    setForm(itemToForm(item))
    setModal("edit")
  }

  function openDelete(item: T) {
    setSelected(item)
    setModal("delete")
  }

  function handleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  async function handleImageUpload(key: string, file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploadingKey(key)
    try {
      const dataUrl = await compressImageFile(file)
      // Guard against filling up localStorage: a single compressed image
      // should land well under ~250KB, but warn if it's unexpectedly large.
      if (dataUrl.length > 700_000) {
        setUploadError("Image is still large after compression — try a smaller photo.")
      }
      handleFormChange(key, dataUrl)
    } catch {
      setUploadError("Could not process that image. Try a JPG or PNG file.")
    } finally {
      setUploadingKey(null)
    }
  }

  function handleFormChange(key: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    if (modal === "add" && onAdd) onAdd(form as Omit<T, "id">)
    else if (modal === "edit" && selected) onEdit(selected.id, form as Partial<T>)
    setModal(null)
    setSelected(null)
  }

  function handleDelete() {
    if (selected && onDelete) onDelete(selected.id)
    setModal(null)
    setSelected(null)
  }

  // Filter + sort
  let filtered = data.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(query.toLowerCase())
    )
  )
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = String((a as Record<string, unknown>)[sortKey] ?? "")
      const bv = String((b as Record<string, unknown>)[sortKey] ?? "")
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [query])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        {onAdd && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#cc0000]/20 transition hover:bg-[#a80000]"
          >
            <Plus className="size-4" /> Add New
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    {col.sortable !== false ? (
                      <button
                        onClick={() => handleSort(String(col.key))}
                        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                      >
                        {col.label}
                        {sortKey === col.key
                          ? (sortDir === "asc" ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />)
                          : <ChevronUp className="size-3.5 opacity-30" />}
                      </button>
                    ) : col.label}
                  </th>
                ))}
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-12 text-center text-sm text-gray-400">
                    No items found.
                  </td>
                </tr>
              ) : paginated.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-5 py-3.5 text-sm text-gray-700 max-w-xs">
                      {col.render
                        ? col.render(row)
                        : <span className="truncate block max-w-[200px]">{String((row as Record<string, unknown>)[String(col.key)] ?? "—")}</span>
                      }
                    </td>
                  ))}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {previewPath && (
                        <a
                          href={previewPath(row)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-[#cc0000]"
                          title="Preview"
                        >
                          <Eye className="size-4" />
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(row)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => openDelete(row)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 bg-gray-50">
            <p className="text-xs text-gray-500">{filtered.length} items · Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`size-7 rounded-lg text-xs font-bold transition ${
                    p === page ? "bg-[#cc0000] text-white" : "text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-black text-gray-900">
                  {modal === "add" ? "Add New" : "Edit"} {title.replace(/s$/, "")}
                </h3>
                {modal === "edit" && selected && previewPath && (
                  <a
                    href={previewPath(selected)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[#cc0000] hover:bg-red-50 transition-colors"
                    title="Preview Live"
                  >
                    <Eye className="size-3.5" /> Preview Live
                  </a>
                )}
              </div>
              <button onClick={() => setModal(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X className="size-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {formFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {field.label} {field.required && <span className="text-[#cc0000]">*</span>}
                  </label>
                  {field.type === "image" ? (
                    <div className="space-y-2">
                      {form[field.key] ? (
                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={String(form[field.key])} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleFormChange(field.key, "")}
                            className="absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                          <ImageIcon className="size-6 text-gray-300" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(field.key, e.target.files?.[0])}
                        className="w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-gray-700 hover:file:bg-gray-200"
                      />
                      {uploadingKey === field.key && <p className="text-xs text-gray-400">Processing image…</p>}
                      <input
                        type="text"
                        value={String(form[field.key] ?? "")}
                        onChange={(e) => handleFormChange(field.key, e.target.value)}
                        placeholder="or paste an image URL, e.g. /event-townhall.png"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#cc0000] focus:bg-white focus:ring-2 focus:ring-[#cc0000]/20"
                      />
                      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={String(form[field.key] ?? "")}
                      onChange={(e) => handleFormChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#cc0000] focus:bg-white focus:ring-2 focus:ring-[#cc0000]/20 resize-none"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={String(form[field.key] ?? "")}
                      onChange={(e) => handleFormChange(field.key, e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#cc0000] focus:ring-2 focus:ring-[#cc0000]/20"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.key])}
                        onChange={(e) => handleFormChange(field.key, e.target.checked)}
                        className="size-4 accent-[#cc0000]"
                      />
                      <span className="text-sm text-gray-700">{field.placeholder ?? "Enabled"}</span>
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      value={String(form[field.key] ?? "")}
                      onChange={(e) => handleFormChange(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#cc0000] focus:bg-white focus:ring-2 focus:ring-[#cc0000]/20"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 rounded-xl bg-[#cc0000] py-2.5 text-sm font-bold text-white hover:bg-[#a80000] transition-colors">
                {modal === "add" ? "Add" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {modal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <h3 className="text-base font-black text-gray-900 text-center mb-2">Delete item?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
