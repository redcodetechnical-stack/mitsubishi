"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  Megaphone,
  Rocket,
  Package,
  Mail,
  ShieldCheck,
  BookOpen,
  Settings,
  Users,
  LogOut,
  Hexagon,
  ChevronRight,
  X,
  Images,
  Video,
  Palette,
  FolderArchive,
  PhoneCall,
  HelpCircle,
} from "lucide-react"
import { logout, getUser } from "@/lib/cms-auth"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Banner Management", href: "/admin/banners", icon: Images },
  { label: "Video Management", href: "/admin/videos", icon: Video },
  { label: "Brand Centre", href: "/admin/brand-centre", icon: Palette },
  { label: "Marketing Assets", href: "/admin/marketing-assets", icon: FolderArchive },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Asset Management", href: "/admin/resources", icon: Package },
  { label: "Leadership Management", href: "/admin/leaders", icon: Users },
  { label: "Knowledge Centre", href: "/admin/knowledge", icon: BookOpen },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Contact Us", href: "/admin/contact", icon: PhoneCall },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const user = getUser()

  function handleLogout() {
    logout()
    router.push("/admin/login")
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-gray-950 text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Mitsubishi Electric CMS Admin"
            width={160}
            height={36}
            className="h-8.5 w-auto object-contain"
            priority
          />
        </Link>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors lg:hidden">
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Content</p>
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-[#E60012] text-white shadow-sm"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </span>
              {active && <ChevronRight className="size-3.5 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3 px-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E60012] text-xs font-black">
            {user?.name?.charAt(0) ?? "A"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Admin"}</p>
            <p className="truncate text-[10px] text-white/40">{user?.role ?? "Admin"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/50 transition-all hover:bg-red-500/15 hover:text-red-400"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
