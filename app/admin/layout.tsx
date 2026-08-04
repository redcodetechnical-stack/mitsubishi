"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isLoggedIn } from "@/lib/cms-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Menu } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    // Login page ko auth guard ki zaroorat nahi
    if (isLoginPage) {
      setChecked(true)
      return
    }
    if (!isLoggedIn()) {
      router.replace("/admin/login")
    } else {
      setChecked(true)
    }
  }, [router, isLoginPage])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  // Loading spinner — sirf non-login pages ke liye
  if (!checked && !isLoginPage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="size-8 rounded-full border-2 border-[#cc0000] border-t-transparent animate-spin" />
      </div>
    )
  }

  // Login page — sirf children, koi sidebar/layout nahi
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex-shrink-0 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={closeSidebar} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile topbar */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <span className="font-display text-sm font-bold text-gray-900">Nexus Hub CMS</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
