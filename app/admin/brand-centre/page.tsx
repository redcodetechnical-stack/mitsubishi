"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Pencil, Trash2, Plus, Palette, Type, X, AlertTriangle,
  Save, Check, ChevronRight, RefreshCw, ExternalLink
} from "lucide-react"
import {
  getBrandColors, saveBrandColor, updateBrandColor, deleteBrandColor,
  getBrandTypography, saveBrandTypography, updateBrandTypography, deleteBrandTypography,
  getFontSpecimens, saveFontSpecimen, updateFontSpecimen, deleteFontSpecimen
} from "@/lib/cms-store"
import type { BrandColor, BrandTypography, FontSpecimen } from "@/lib/data"

type TabKey = "colors" | "typography"

const EMPTY_COLOR = {
  name: "",
  hex: "#cc0000",
  category: "Primary" as "Primary" | "Secondary" | "Functional",
}

const EMPTY_TYPO = {
  mediaType: "",
  westernFont: "",
  asianFont: "",
  notes: "",
}

const EMPTY_SPEC = {
  fontName: "",
  subtitle: "",
  sampleHeading: "Future-changing innovations",
  sampleBody: "Sample body text demonstrating font weights and character spacing.",
  sampleMeta: "MA-E100R-E Manual",
  headingWeight: "Medium",
  bodyWeight: "Regular",
  uiWeight: "Regular",
  guidelines: "Use Medium for headings and Regular for body text.",
  note: "",
}

export default function AdminBrandCentrePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("colors")
  const [colors, setColors] = useState<BrandColor[]>([])
  const [typography, setTypography] = useState<BrandTypography[]>([])
  const [specimens, setSpecimens] = useState<FontSpecimen[]>([])

  const [colorModal, setColorModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedColor, setSelectedColor] = useState<BrandColor | null>(null)
  const [colorForm, setColorForm] = useState<typeof EMPTY_COLOR>({ ...EMPTY_COLOR })

  const [typoModal, setTypoModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedTypo, setSelectedTypo] = useState<BrandTypography | null>(null)
  const [typoForm, setTypoForm] = useState<typeof EMPTY_TYPO>({ ...EMPTY_TYPO })

  const [specModal, setSpecModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedSpec, setSelectedSpec] = useState<FontSpecimen | null>(null)
  const [specForm, setSpecForm] = useState<typeof EMPTY_SPEC>({ ...EMPTY_SPEC })

  const [flashId, setFlashId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setColors(getBrandColors())
    setTypography(getBrandTypography())
    setSpecimens(getFontSpecimens())
  }, [])

  useEffect(() => { reload() }, [reload])

  function flash(id: string) {
    setFlashId(id)
    setTimeout(() => setFlashId(null), 2000)
  }

  // Color CRUD
  function openAddColor() {
    setSelectedColor(null)
    setColorForm({ ...EMPTY_COLOR })
    setColorModal("add")
  }

  function openEditColor(c: BrandColor) {
    setSelectedColor(c)
    setColorForm({ name: c.name, hex: c.hex, category: c.category })
    setColorModal("edit")
  }

  function openDeleteColor(c: BrandColor) {
    setSelectedColor(c)
    setColorModal("delete")
  }

  function handleSaveColor() {
    if (!colorForm.name.trim() || !colorForm.hex.trim()) return
    if (colorModal === "add") {
      const created = saveBrandColor({
        name: colorForm.name,
        hex: colorForm.hex,
        category: colorForm.category,
        bgClass: `bg-[${colorForm.hex}]`,
      })
      flash(created.id)
    } else if (colorModal === "edit" && selectedColor) {
      updateBrandColor(selectedColor.id, {
        name: colorForm.name,
        hex: colorForm.hex,
        category: colorForm.category,
        bgClass: `bg-[${colorForm.hex}]`,
      })
      flash(selectedColor.id)
    }
    setColorModal(null)
    reload()
  }

  function handleDeleteColor() {
    if (!selectedColor) return
    deleteBrandColor(selectedColor.id)
    setColorModal(null)
    reload()
  }

  // Typography Matrix CRUD
  function openAddTypo() {
    setSelectedTypo(null)
    setTypoForm({ ...EMPTY_TYPO })
    setTypoModal("add")
  }

  function openEditTypo(t: BrandTypography) {
    setSelectedTypo(t)
    setTypoForm({ mediaType: t.mediaType, westernFont: t.westernFont, asianFont: t.asianFont, notes: t.notes || "" })
    setTypoModal("edit")
  }

  function openDeleteTypo(t: BrandTypography) {
    setSelectedTypo(t)
    setTypoModal("delete")
  }

  function handleSaveTypo() {
    if (!typoForm.mediaType.trim() || !typoForm.westernFont.trim()) return
    if (typoModal === "add") {
      const created = saveBrandTypography({
        mediaType: typoForm.mediaType,
        westernFont: typoForm.westernFont,
        asianFont: typoForm.asianFont || "Noto Sans",
        notes: typoForm.notes,
      })
      flash(created.id)
    } else if (typoModal === "edit" && selectedTypo) {
      updateBrandTypography(selectedTypo.id, {
        mediaType: typoForm.mediaType,
        westernFont: typoForm.westernFont,
        asianFont: typoForm.asianFont,
        notes: typoForm.notes,
      })
      flash(selectedTypo.id)
    }
    setTypoModal(null)
    reload()
  }

  function handleDeleteTypo() {
    if (!selectedTypo) return
    deleteBrandTypography(selectedTypo.id)
    setTypoModal(null)
    reload()
  }

  // Font Specimen Showcase CRUD
  function openAddSpec() {
    setSelectedSpec(null)
    setSpecForm({ ...EMPTY_SPEC })
    setSpecModal("add")
  }

  function openEditSpec(s: FontSpecimen) {
    setSelectedSpec(s)
    setSpecForm({
      fontName: s.fontName,
      subtitle: s.subtitle,
      sampleHeading: s.sampleHeading,
      sampleBody: s.sampleBody,
      sampleMeta: s.sampleMeta || "",
      headingWeight: s.headingWeight,
      bodyWeight: s.bodyWeight,
      uiWeight: s.uiWeight || "",
      guidelines: s.guidelines,
      note: s.note || "",
    })
    setSpecModal("edit")
  }

  function openDeleteSpec(s: FontSpecimen) {
    setSelectedSpec(s)
    setSpecModal("delete")
  }

  function handleSaveSpec() {
    if (!specForm.fontName.trim()) return
    if (specModal === "add") {
      const created = saveFontSpecimen({
        fontName: specForm.fontName,
        subtitle: specForm.subtitle || "Primary Latin typography",
        sampleHeading: specForm.sampleHeading,
        sampleBody: specForm.sampleBody,
        sampleMeta: specForm.sampleMeta,
        headingWeight: specForm.headingWeight,
        bodyWeight: specForm.bodyWeight,
        uiWeight: specForm.uiWeight,
        guidelines: specForm.guidelines,
        note: specForm.note,
      })
      flash(created.id)
    } else if (specModal === "edit" && selectedSpec) {
      updateFontSpecimen(selectedSpec.id, {
        fontName: specForm.fontName,
        subtitle: specForm.subtitle,
        sampleHeading: specForm.sampleHeading,
        sampleBody: specForm.sampleBody,
        sampleMeta: specForm.sampleMeta,
        headingWeight: specForm.headingWeight,
        bodyWeight: specForm.bodyWeight,
        uiWeight: specForm.uiWeight,
        guidelines: specForm.guidelines,
        note: specForm.note,
      })
      flash(selectedSpec.id)
    }
    setSpecModal(null)
    reload()
  }

  function handleDeleteSpec() {
    if (!selectedSpec) return
    deleteFontSpecimen(selectedSpec.id)
    setSpecModal(null)
    reload()
  }

  const primaryColors = colors.filter((c) => c.category === "Primary")
  const secondaryColors = colors.filter((c) => c.category === "Secondary")
  const functionalColors = colors.filter((c) => c.category === "Functional")

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
              Brand Guidelines
            </span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <Palette className="size-5 text-[#E60012]" /> Brand Centre Management
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Add, edit, or change official color palettes, typography specifications, and brand font specimen cards.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Link
            href="/brand-centre"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-bold text-white hover:bg-black transition cursor-pointer"
          >
            <ExternalLink className="size-4" /> Live Preview
          </Link>
          {activeTab === "colors" ? (
            <button
              onClick={openAddColor}
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <Plus className="size-4" /> Add Brand Color
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openAddTypo}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Typeface Rule
              </button>
              <button
                onClick={openAddSpec}
                  className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Font Specimen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setActiveTab("colors")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
            activeTab === "colors"
              ? "bg-[#cc0000] text-white border-[#cc0000] shadow-md shadow-[#cc0000]/20"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
          }`}
        >
          <Palette className="size-4" />
          Color Palette
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
            {colors.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("typography")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
            activeTab === "typography"
              ? "bg-[#cc0000] text-white border-[#cc0000] shadow-md shadow-[#cc0000]/20"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
          }`}
        >
          <Type className="size-4" />
          Typography Specs &amp; Specimens
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
            {typography.length + specimens.length}
          </span>
        </button>
      </div>

      {/* ─── TAB 1: COLOR PALETTE MANAGEMENT ────────────────────────────── */}
      {activeTab === "colors" && (
        <div className="space-y-8">

          {/* Primary Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Primary Colors (Basic Colors)</h3>
              <span className="text-xs text-gray-400 font-semibold">{primaryColors.length} colors</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {primaryColors.map((c) => (
                <div key={c.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
                  <div>
                    <div className="h-28 w-full relative shadow-inner" style={{ backgroundColor: c.hex }}>
                      {flashId === c.id && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                          ✓ Color Saved
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-sm font-black text-gray-900">{c.name}</p>
                      <p className="text-xs font-mono font-bold text-gray-500">{c.hex.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditColor(c)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer"
                    >
                      <Pencil className="size-3.5" /> Edit / Change
                    </button>
                    <button
                      onClick={() => openDeleteColor(c)}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Secondary Colors (Supporting Colors)</h3>
              <span className="text-xs text-gray-400 font-semibold">{secondaryColors.length} colors</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {secondaryColors.map((c) => {
                const shadeList = c.shades && c.shades.length > 0 ? c.shades : [c.hex]
                return (
                  <div key={c.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
                    <div>
                      <div className="h-28 w-full relative flex flex-col shadow-inner overflow-hidden">
                        {shadeList.map((hex, idx) => (
                          <div key={idx} className="flex-1 w-full" style={{ backgroundColor: hex }} />
                        ))}
                        {flashId === c.id && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                            ✓ Saved
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="text-sm font-black text-gray-900">{c.name}</p>
                        <p className="text-xs font-mono font-bold text-gray-500">{c.hex.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditColor(c)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer"
                      >
                        <Pencil className="size-3.5" /> Edit / Change
                      </button>
                      <button
                        onClick={() => openDeleteColor(c)}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Functional Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Functional Colors</h3>
              <span className="text-xs text-gray-400 font-semibold">{functionalColors.length} colors</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {functionalColors.map((c) => {
                const shadeList = c.shades && c.shades.length > 0 ? c.shades : [c.hex]
                return (
                  <div key={c.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
                    <div>
                      <div className="h-28 w-full relative flex flex-col shadow-inner overflow-hidden">
                        {shadeList.map((hex, idx) => (
                          <div key={idx} className="flex-1 w-full" style={{ backgroundColor: hex }} />
                        ))}
                        {flashId === c.id && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                            ✓ Saved
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="text-sm font-black text-gray-900">{c.name}</p>
                        <p className="text-xs font-mono font-bold text-gray-500">{c.hex.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditColor(c)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer"
                      >
                        <Pencil className="size-3.5" /> Edit / Change
                      </button>
                      <button
                        onClick={() => openDeleteColor(c)}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* ─── TAB 2: TYPOGRAPHY SPECS & SPECIMENS MANAGEMENT ────────────── */}
      {activeTab === "typography" && (
        <div className="space-y-8">
          {/* Overview & Recommended Fonts Table Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-gray-900">Overview &amp; Recommended Fonts</h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage brand font assignments per media type and language.</p>
              </div>
              <button
                onClick={openAddTypo}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer"
              >
                <Plus className="size-4" /> Add Typeface Rule
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    <th className="p-3.5">Media Type / Application</th>
                    <th className="p-3.5">Western Languages Font</th>
                    <th className="p-3.5">Asian Languages Font</th>
                    <th className="p-3.5">Notes &amp; Rules</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {typography.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-3.5 text-xs font-bold text-gray-900">{t.mediaType}</td>
                      <td className="p-3.5 text-xs font-black text-[#cc0000]">{t.westernFont}</td>
                      <td className="p-3.5 text-xs font-bold text-gray-700">{t.asianFont}</td>
                      <td className="p-3.5 text-xs text-gray-500">{t.notes || "—"}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditTypo(t)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => openDeleteTypo(t)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Prohibited Fonts Banner Bar */}
            <div className="bg-[#cc0000] text-white p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                [Prohibited fonts] Songti and Heiti are copyrighted fonts owned by Beijing Zhongyi Zhongbiao Electronic Information Technology Co., Ltd., and therefore, their use without proper licensing is prohibited.
              </span>
            </div>
          </div>

          {/* Font Specimen Cards (Helvetica Neue, Roboto, etc.) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-black text-gray-900">Font Specimen Cards</h3>
                <p className="text-xs text-gray-500">Live sample heading, body specimen, weights, and usage guidelines.</p>
              </div>
              <button
                onClick={openAddSpec}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-4 py-2 text-xs font-bold text-white hover:bg-[#a80000] transition cursor-pointer"
              >
                <Plus className="size-4" /> Add Font Specimen
              </button>
            </div>

            <div className="space-y-6">
              {specimens.map((spec) => (
                <div key={spec.id} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative">
                  {/* Action Buttons top right */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-display text-xl font-black text-gray-900">{spec.fontName}</h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{spec.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditSpec(spec)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-100 text-xs font-bold text-gray-900 hover:bg-black hover:text-white transition cursor-pointer"
                      >
                        <Pencil className="size-3.5" /> Edit Specimen
                      </button>
                      <button
                        onClick={() => openDeleteSpec(spec)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Showcase */}
                  <div className="grid gap-8 lg:grid-cols-12 items-start">
                    {/* Left Column: Sample Specimen */}
                    <div className="lg:col-span-7 space-y-4">
                      <h4 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight leading-snug">
                        {spec.sampleHeading}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl">
                        {spec.sampleBody}
                      </p>
                      {spec.sampleMeta && (
                        <p className="text-xs font-bold text-gray-900 pt-2">
                          {spec.sampleMeta}
                        </p>
                      )}
                    </div>

                    {/* Right Column: Weights & Guidelines */}
                    <div className="lg:col-span-5 space-y-4 text-xs bg-gray-50/80 p-5 rounded-xl border border-gray-100">
                      <div className="space-y-1.5 border-b border-gray-200/80 pb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-700">Headings:</span>
                          <span className="font-semibold text-gray-500">{spec.headingWeight}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-700">Body text:</span>
                          <span className="font-semibold text-gray-500">{spec.bodyWeight}</span>
                        </div>
                        {spec.uiWeight && (
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-700">UI:</span>
                            <span className="font-semibold text-gray-500">{spec.uiWeight}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-500 leading-relaxed">
                        {spec.guidelines}
                      </p>

                      {spec.note && (
                        <p className="text-[10px] text-gray-400 leading-normal pt-2 border-t border-gray-200/60">
                          {spec.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Color Modal ─────────────────────────────────────── */}
      {(colorModal === "add" || colorModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden space-y-4">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h3 className="font-display text-base font-bold">
                {colorModal === "add" ? "Add New Brand Color" : "Edit / Change Brand Color"}
              </h3>
              <button onClick={() => setColorModal(null)} className="rounded-full p-1 text-gray-400 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Color Swatch &amp; Picker</label>
                <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div
                    className="size-14 rounded-xl border border-gray-300 shadow-sm shrink-0"
                    style={{ backgroundColor: colorForm.hex }}
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="color"
                      value={colorForm.hex.startsWith("#") ? colorForm.hex : "#cc0000"}
                      onChange={(e) => setColorForm((f) => ({ ...f, hex: e.target.value }))}
                      className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 bg-white p-1"
                    />
                    <p className="text-[10px] text-gray-400">Click color box above to choose exact color</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Color Name <span className="text-[#cc0000]">*</span></label>
                <input
                  type="text"
                  value={colorForm.name}
                  onChange={(e) => setColorForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Corporate Red"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Hex Code (#HEX) <span className="text-[#cc0000]">*</span></label>
                <input
                  type="text"
                  value={colorForm.hex}
                  onChange={(e) => setColorForm((f) => ({ ...f, hex: e.target.value }))}
                  placeholder="#CC0000"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 font-mono outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Palette Category</label>
                <select
                  value={colorForm.category}
                  onChange={(e) => setColorForm((f) => ({ ...f, category: e.target.value as any }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                >
                  <option value="Primary">Primary (Basic colors)</option>
                  <option value="Secondary">Secondary (Supporting colors)</option>
                  <option value="Functional">Functional colors</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setColorModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSaveColor}
                disabled={!colorForm.name.trim() || !colorForm.hex.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save Color
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Color Modal */}
      {colorModal === "delete" && selectedColor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Brand Color?</h3>
                <p className="text-xs text-gray-500">Remove color from brand palette specifications.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="size-10 rounded-lg border shadow-xs" style={{ backgroundColor: selectedColor.hex }} />
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedColor.name}</p>
                <p className="text-xs font-mono text-gray-500">{selectedColor.hex}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setColorModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteColor} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Color
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Typography Matrix Modal ───────────────────────── */}
      {(typoModal === "add" || typoModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden space-y-4">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h3 className="font-display text-base font-bold">
                {typoModal === "add" ? "Add Typeface Rule" : "Edit / Change Typeface Rule"}
              </h3>
              <button onClick={() => setTypoModal(null)} className="rounded-full p-1 text-gray-400 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Media Type / Application <span className="text-[#cc0000]">*</span></label>
                <input
                  type="text"
                  value={typoForm.mediaType}
                  onChange={(e) => setTypoForm((f) => ({ ...f, mediaType: e.target.value }))}
                  placeholder="e.g. Websites, Videos, Reports"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Western Languages Font <span className="text-[#cc0000]">*</span></label>
                <input
                  type="text"
                  value={typoForm.westernFont}
                  onChange={(e) => setTypoForm((f) => ({ ...f, westernFont: e.target.value }))}
                  placeholder="e.g. Helvetica Neue, Roboto, Arial"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Asian Languages Font</label>
                <input
                  type="text"
                  value={typoForm.asianFont}
                  onChange={(e) => setTypoForm((f) => ({ ...f, asianFont: e.target.value }))}
                  placeholder="e.g. Noto Sans"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Usage Notes &amp; Rules</label>
                <textarea
                  rows={2}
                  value={typoForm.notes}
                  onChange={(e) => setTypoForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Specific usage guidelines..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setTypoModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSaveTypo}
                disabled={!typoForm.mediaType.trim() || !typoForm.westernFont.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save Typeface
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Typo Modal */}
      {typoModal === "delete" && selectedTypo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Typeface Rule?</h3>
                <p className="text-xs text-gray-500">Remove from brand typography specs.</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedTypo.mediaType}&rdquo; ({selectedTypo.westernFont})
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setTypoModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteTypo} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Typeface
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Font Specimen Modal ─────────────────────────────── */}
      {(specModal === "add" || specModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <h3 className="font-display text-base font-bold">
                {specModal === "add" ? "Add Font Specimen Card" : "Edit Font Specimen Card"}
              </h3>
              <button onClick={() => setSpecModal(null)} className="rounded-full p-1 text-gray-400 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Font Name <span className="text-[#cc0000]">*</span></label>
                  <input
                    type="text"
                    value={specForm.fontName}
                    onChange={(e) => setSpecForm((f) => ({ ...f, fontName: e.target.value }))}
                    placeholder="e.g. Helvetica Neue"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Subtitle</label>
                  <input
                    type="text"
                    value={specForm.subtitle}
                    onChange={(e) => setSpecForm((f) => ({ ...f, subtitle: e.target.value }))}
                    placeholder="e.g. Primary Latin typography"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Sample Heading Text <span className="text-[#cc0000]">*</span></label>
                <input
                  type="text"
                  value={specForm.sampleHeading}
                  onChange={(e) => setSpecForm((f) => ({ ...f, sampleHeading: e.target.value }))}
                  placeholder="Future-changing innovations"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Sample Body Specimen Text</label>
                <textarea
                  rows={3}
                  value={specForm.sampleBody}
                  onChange={(e) => setSpecForm((f) => ({ ...f, sampleBody: e.target.value }))}
                  placeholder="Body text..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#cc0000] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Headings Weight</label>
                  <input
                    type="text"
                    value={specForm.headingWeight}
                    onChange={(e) => setSpecForm((f) => ({ ...f, headingWeight: e.target.value }))}
                    placeholder="Medium"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Body Weight</label>
                  <input
                    type="text"
                    value={specForm.bodyWeight}
                    onChange={(e) => setSpecForm((f) => ({ ...f, bodyWeight: e.target.value }))}
                    placeholder="Regular*"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">UI Weight</label>
                  <input
                    type="text"
                    value={specForm.uiWeight}
                    onChange={(e) => setSpecForm((f) => ({ ...f, uiWeight: e.target.value }))}
                    placeholder="Regular"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Usage Guidelines</label>
                <textarea
                  rows={2}
                  value={specForm.guidelines}
                  onChange={(e) => setSpecForm((f) => ({ ...f, guidelines: e.target.value }))}
                  placeholder="Guidelines for headings, body text, and titles..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-900 outline-none focus:border-[#cc0000] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Footnote / Notice</label>
                <input
                  type="text"
                  value={specForm.note}
                  onChange={(e) => setSpecForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="*Helvetica Neue LT Pro may also be used..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setSpecModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSaveSpec}
                disabled={!specForm.fontName.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save Specimen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Specimen Modal */}
      {specModal === "delete" && selectedSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Delete Font Specimen?</h3>
                <p className="text-xs text-gray-500">Remove specimen card from brand typography page.</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              &ldquo;{selectedSpec.fontName}&rdquo; ({selectedSpec.subtitle})
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSpecModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteSpec} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Specimen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
