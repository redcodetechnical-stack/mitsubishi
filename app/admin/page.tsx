"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Images, Video, Palette, FolderArchive, CalendarDays, Package, Users, BookOpen, HelpCircle, PhoneCall, Settings,
  Plus, Layers, ShieldCheck, ArrowUpRight, LayoutDashboard, Activity, TrendingUp, Zap
} from "lucide-react"
import {
  getBanners, getVideos, getBrandColors, getBrandTypography, getResources, getEvents, getLeaderMessages,
  getKnowledge, getFaqs, getContactTeamMembers, getCmsUsers
} from "@/lib/cms-store"

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    setCounts({
      banners: getBanners().length,
      videos: getVideos().length,
      brand: getBrandColors().length + getBrandTypography().length,
      marketing: getResources().filter((r) => r.category === "Marketing Assets").length,
      events: getEvents().length,
      resources: getResources().length,
      leaders: getLeaderMessages().length,
      knowledge: getKnowledge().length,
      faqs: getFaqs().length,
      contact: getContactTeamMembers().length,
      users: getCmsUsers().length,
    })
  }, [])

  const totalAssets = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-screen bg-[#f5f5f5]">

      {/* ── HERO HEADER ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-6 px-6 lg:py-8 lg:px-10 text-white shadow-xl border border-red-900/40"
        style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
      >
        {/* glow orbs */}
        <div className="absolute right-10 top-0 size-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 size-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          {/* Left text */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow border border-white/15 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#E60012] animate-ping" />
                Live Dashboard
              </span>
              <span className="text-gray-300 text-xs font-semibold">• Mitsubishi Electric Group CMS</span>
            </div>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-white tracking-tight drop-shadow-md flex items-center gap-3">
              <LayoutDashboard className="size-6 text-[#E60012]" />
              CMS Command Centre
            </h1>
            <p className="text-sm text-gray-200 leading-relaxed max-w-xl">
              Manage brand communications, digital assets, events, knowledge base, FAQs, and access permissions — all in one place.
            </p>
          </div>

          {/* Right metrics cluster */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 bg-black border border-white/10 rounded-2xl px-5 py-3 shadow-xl">
              <div className="size-10 rounded-xl bg-black border border-white/20 flex items-center justify-center">
                <Layers className="size-5 text-[#E60012]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total Assets</p>
                <p className="text-2xl font-black text-white leading-none">{totalAssets}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black border border-white/10 rounded-2xl px-5 py-3 shadow-xl">
              <div className="size-10 rounded-xl bg-black border border-white/20 flex items-center justify-center">
                <Activity className="size-5 text-green-400" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Modules</p>
                <p className="text-2xl font-black text-white leading-none">11</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ROW ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Banners",            value: counts.banners,   icon: Images,       href: "/admin/banners",   color: "text-gray-800", bg: "bg-gray-100", border: "border-gray-200" },
          { label: "Events",             value: counts.events,    icon: CalendarDays, href: "/admin/events",    color: "text-gray-800", bg: "bg-gray-100", border: "border-gray-200" },
          { label: "Knowledge Articles", value: counts.knowledge, icon: BookOpen,     href: "/admin/knowledge", color: "text-gray-800", bg: "bg-gray-100", border: "border-gray-200" },
          { label: "CMS Users",          value: counts.users,     icon: Users,        href: "/admin/settings",  color: "text-gray-800", bg: "bg-gray-100", border: "border-gray-200" },
        ].map((s) => (
          <Link key={s.href} href={s.href}
            className={`bg-white rounded-2xl border ${s.border} shadow-sm p-4 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all group`}
          >
            <div className={`size-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold truncate">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value ?? 0}</p>
            </div>
            <ArrowUpRight className="size-4 text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {/* ── MODULE CARDS GRID ───────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-3">

        {/* CARD 1: Brand & Media */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-red-50 to-white border-b border-gray-100">
            <span className="size-9 rounded-xl bg-[#E60012] text-white flex items-center justify-center shadow">
              <Palette className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-black text-gray-900">Brand & Media</h2>
              <p className="text-[10px] text-gray-400 font-medium">Banners, videos, brand assets</p>
            </div>
          </div>
          <div className="p-4 space-y-2 flex-1">
            {[
              { label: "Banner Management", count: counts.banners, href: "/admin/banners", icon: Images, desc: "Hero page banners" },
              { label: "Video Management", count: counts.videos, href: "/admin/videos", icon: Video, desc: "Corporate video gallery" },
              { label: "Brand Centre", count: counts.brand, href: "/admin/brand-centre", icon: Palette, desc: "Colors, fonts & specimens" },
              { label: "Marketing Assets", count: counts.marketing, href: "/admin/marketing-assets", icon: FolderArchive, desc: "Campaign collateral packs" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#E60012] hover:bg-red-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#E60012] group-hover:bg-red-50 transition-all">
                    <item.icon className="size-3.5 text-gray-500 group-hover:text-[#E60012] transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#E60012] transition-colors">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full group-hover:border-[#E60012] group-hover:text-[#E60012] transition-all">
                  {item.count ?? 0}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CARD 2: Knowledge & Comms */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
            <span className="size-9 rounded-xl bg-white/10 text-white flex items-center justify-center shadow border border-white/10">
              <BookOpen className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-black text-white">Knowledge & Comms</h2>
              <p className="text-[10px] text-gray-400 font-medium">Articles, FAQs, leadership, team</p>
            </div>
          </div>
          <div className="p-4 space-y-2 flex-1">
            {[
              { label: "Knowledge Centre", count: counts.knowledge, href: "/admin/knowledge", icon: BookOpen, desc: "Articles & best practices" },
              { label: "Leadership Messages", count: counts.leaders, href: "/admin/leaders", icon: Users, desc: "Leader statements & quotes" },
              { label: "FAQs Hub", count: counts.faqs, href: "/admin/faqs", icon: HelpCircle, desc: "Frequently asked questions" },
              { label: "Contact Directory", count: counts.contact, href: "/admin/contact", icon: PhoneCall, desc: "Team contacts & hotlines" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-800 hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-700 group-hover:bg-gray-900 transition-all">
                    <item.icon className="size-3.5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-gray-900 transition-colors">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full group-hover:border-gray-700 group-hover:text-gray-800 transition-all">
                  {item.count ?? 0}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CARD 3: Operations & Governance */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-red-50 to-white border-b border-gray-100">
            <span className="size-9 rounded-xl bg-[#E60012] text-white flex items-center justify-center shadow">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-black text-gray-900">Operations & Governance</h2>
              <p className="text-[10px] text-gray-400 font-medium">Events, resources, users, security</p>
            </div>
          </div>
          <div className="p-4 space-y-2 flex-1">
            {[
              { label: "Corporate Events", count: counts.events, href: "/admin/events", icon: CalendarDays, desc: "Events & toolkits" },
              { label: "Asset Library", count: counts.resources, href: "/admin/resources", icon: Package, desc: "Global document store" },
              { label: "Users & Settings", count: counts.users, href: "/admin/settings", icon: Settings, desc: "Roles & permissions matrix" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#E60012] hover:bg-red-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#E60012] group-hover:bg-red-50 transition-all">
                    <item.icon className="size-3.5 text-gray-500 group-hover:text-[#E60012] transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#E60012] transition-colors">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full group-hover:border-[#E60012] group-hover:text-[#E60012] transition-all">
                  {item.count ?? 0}
                </span>
              </Link>
            ))}

            {/* System Health Badge */}
            <div className="mt-2 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="size-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp className="size-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800">System Operational</p>
                <p className="text-[10px] text-emerald-600">All services running normally</p>
              </div>
              <span className="ml-auto size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
          </div>
        </div>

      </div>

      {/* ── QUICK ACTIONS BAR ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-[#E60012] flex items-center justify-center">
              <Zap className="size-3.5 text-white" />
            </div>
            <span className="text-sm font-black text-gray-800">Quick Actions</span>
            <span className="text-[10px] text-gray-400 font-medium ml-1">— jump directly to add content</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "+ Add Banner", href: "/admin/banners" },
              { label: "+ Add Asset", href: "/admin/marketing-assets" },
              { label: "+ Add Event", href: "/admin/events" },
              { label: "+ Add Article", href: "/admin/knowledge" },
              { label: "+ Add FAQ", href: "/admin/faqs" },
            ].map((a) => (
              <Link key={a.href} href={a.href}
                className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
              >
                {a.label}
              </Link>
            ))}
            <Link
              href="/admin/settings"
              className="px-3.5 py-2 rounded-xl bg-[#E60012] border border-[#E60012] text-xs font-bold text-white hover:bg-[#c40010] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Settings className="size-3.5" /> Settings
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
