"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Save, RotateCcw, CheckCircle, Settings, TrendingUp, Star, MessageSquare,
  Users, Shield, ShieldCheck, Plus, Pencil, Trash2, X, Search, Lock, UserCheck, ShieldAlert,
  Sliders, Check, AlertTriangle
} from "lucide-react"
import {
  getSettings as loadSettings, saveSettingsData as saveSettings, defaultSettings, type SiteSettings,
  getCmsUsers, saveCmsUser, updateCmsUser, deleteCmsUser,
  getRolePermissions, updateRolePermission
} from "@/lib/cms-store"
import type { CmsUser, UserRole, RolePermission } from "@/lib/data"

function Field({
  label, name, value, onChange, type = "text", placeholder
}: {
  label: string; name: string; value: string; onChange: (k: string, v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#cc0000] focus:bg-white focus:ring-2 focus:ring-[#cc0000]/20 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#cc0000] focus:bg-white focus:ring-2 focus:ring-[#cc0000]/20"
        />
      )}
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-6 py-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#cc0000]/10 text-[#cc0000]">
          <Icon className="size-4" />
        </span>
        <h2 className="text-sm font-black text-gray-900">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  )
}

const EMPTY_USER: Omit<CmsUser, "id"> = {
  name: "",
  email: "",
  role: "Editor",
  department: "Corporate Comms",
  status: "Active",
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users")

  // General Settings state
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)

  // Users state
  const [users, setUsers] = useState<CmsUser[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [userModal, setUserModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedUser, setSelectedUser] = useState<CmsUser | null>(null)
  const [userForm, setUserForm] = useState<typeof EMPTY_USER>({ ...EMPTY_USER })

  // Roles State
  const [roles, setRoles] = useState<RolePermission[]>([])

  const reloadData = useCallback(() => {
    setSettings(loadSettings())
    setUsers(getCmsUsers())
    setRoles(getRolePermissions())
  }, [])

  useEffect(() => { reloadData() }, [reloadData])

  // General Settings Handlers
  function handleGeneralChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSaveGeneral() {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleResetGeneral() {
    setSettings(defaultSettings)
    setSaved(false)
  }

  // Users Handlers
  function openAddUser() {
    setSelectedUser(null)
    setUserForm({ ...EMPTY_USER })
    setUserModal("add")
  }

  function openEditUser(user: CmsUser) {
    setSelectedUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "",
      status: user.status,
    })
    setUserModal("edit")
  }

  function openDeleteUser(user: CmsUser) {
    setSelectedUser(user)
    setUserModal("delete")
  }

  function handleSaveUser() {
    if (!userForm.name.trim() || !userForm.email.trim()) return

    if (userModal === "add") {
      saveCmsUser(userForm)
    } else if (userModal === "edit" && selectedUser) {
      updateCmsUser(selectedUser.id, userForm)
    }
    reloadData()
    setUserModal(null)
  }

  function handleDeleteUser() {
    if (!selectedUser) return
    deleteCmsUser(selectedUser.id)
    reloadData()
    setUserModal(null)
  }

  // Roles Permission Toggle Handler
  function togglePermission(role: UserRole, permKey: keyof RolePermission["permissions"]) {
    const roleItem = roles.find((r) => r.role === role)
    if (!roleItem) return

    const updatedPermissions = {
      ...roleItem.permissions,
      [permKey]: !roleItem.permissions[permKey],
    }

    updateRolePermission(role, { permissions: updatedPermissions })
    reloadData()
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(userSearch.toLowerCase()))
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Executive Red & Black Textured Header Bar */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat py-4 px-6 lg:py-5 lg:px-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-red-900/40"
        style={{ backgroundImage: "url('/images/red-black-banner-texture.png')" }}
      >
        <div className="relative space-y-1 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/15 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#E60012] animate-ping" />
              System Config
            </span>
          </div>
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 drop-shadow-md">
            <Settings className="size-5 text-[#E60012]" /> Admin Settings &amp; User Permissions
          </h1>
          <p className="text-xs text-gray-200 leading-snug">
            Manage site configurations, system users, user roles, and access control permissions.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {activeTab === "users" && (
            <button
              onClick={openAddUser}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="size-4" /> Add New User
            </button>
          )}
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-2 bg-white px-4 pt-2 rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === "users"
              ? "border-[#E60012] text-[#E60012]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="size-4" /> Users &amp; Accounts ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === "roles"
              ? "border-[#E60012] text-[#E60012]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Shield className="size-4" /> Roles &amp; Permission Matrix
        </button>
      </div>

      {/* ─── TAB 2: USERS & ACCOUNTS MANAGEMENT ───────────────────────────────── */}
      {activeTab === "users" && (
        <div className="space-y-6">

          {/* Search Bar & Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">Total Users</p>
                <p className="text-xl font-black text-gray-900">{users.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">Super Admins</p>
                <p className="text-xl font-black text-gray-900">{users.filter((u) => u.role === "Super Admin").length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black">
                <UserCheck className="size-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">Content Managers</p>
                <p className="text-xl font-black text-gray-900">{users.filter((u) => u.role === "Content Manager").length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black">
                <CheckCircle className="size-6 text-gray-900" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">Active Accounts</p>
                <p className="text-xl font-black text-gray-900">{users.filter((u) => u.status === "Active").length}</p>
              </div>
            </div>
          </div>

          {/* User Search & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, department, or role…"
                className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#E60012]"
              />
            </div>
            <span className="text-xs font-bold text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-950 text-white border-b border-gray-800">
                  <th className="p-4 font-bold">User Name</th>
                  <th className="p-4 font-bold">Email Address</th>
                  <th className="p-4 font-bold">Department</th>
                  <th className="p-4 font-bold">Assigned Role</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Last Active</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#E60012]/10 text-[#E60012] flex items-center justify-center font-black text-xs">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      {u.name}
                    </td>
                    <td className="p-4 font-medium text-gray-600">{u.email}</td>
                    <td className="p-4 text-gray-700 font-semibold">{u.department || "General"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                          u.role === "Super Admin"
                            ? "bg-red-100 text-[#E60012]"
                            : u.role === "Content Manager"
                            ? "bg-gray-900 text-white"
                            : u.role === "Editor"
                            ? "bg-gray-200 text-gray-900"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "Active" ? "bg-red-50 text-[#E60012]" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${u.status === "Active" ? "bg-[#E60012]" : "bg-gray-400"}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 font-medium">{u.lastLogin || "N/A"}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditUser(u)}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white transition cursor-pointer"
                          title="Edit User Role"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteUser(u)}
                          className="p-1.5 rounded-lg bg-red-50 text-[#E60012] hover:bg-[#E60012] hover:text-white transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: ROLES & PERMISSIONS MATRIX ───────────────────────────────── */}
      {activeTab === "roles" && (
        <div className="space-y-6">

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-950 flex items-start gap-3">
            <Lock className="size-5 text-[#E60012] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#E60012]">Granular Access Control Matrix</h3>
              <p className="text-xs leading-relaxed text-gray-700">
                Toggle access permissions per role. Changes take effect immediately across all active sessions. Super Admin permissions are permanently locked to guarantee system access.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((r) => (
              <div key={r.role} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                          r.role === "Super Admin"
                            ? "bg-red-100 text-[#E60012]"
                            : r.role === "Content Manager"
                            ? "bg-gray-900 text-white"
                            : r.role === "Editor"
                            ? "bg-gray-200 text-gray-900"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {r.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Granted Permissions:</h4>

                    {([
                      { key: "manageUsers", label: "User Management (Add/Edit/Delete)" },
                      { key: "manageSettings", label: "System & Branding Settings" },
                      { key: "publishContent", label: "Publish Live Content" },
                      { key: "editContent", label: "Create & Edit Content / Assets" },
                      { key: "deleteContent", label: "Delete Assets & Records" },
                      { key: "viewAnalytics", label: "View Analytics & Reports" },
                    ] as const).map((perm) => {
                      const isGranted = r.permissions[perm.key]
                      const isLocked = r.role === "Super Admin"

                      return (
                        <div key={perm.key} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                          <span className="text-xs font-bold text-gray-800">{perm.label}</span>

                          <button
                            onClick={() => !isLocked && togglePermission(r.role, perm.key)}
                            disabled={isLocked}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isGranted
                                ? "bg-red-100 text-[#E60012] border border-red-200"
                                : "bg-gray-200 text-gray-500 border border-gray-300"
                            } ${isLocked ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                          >
                            {isGranted ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                            {isGranted ? "Allowed" : "Denied"}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                  <span className="text-[11px] font-bold text-gray-400">
                    Active users with this role: {users.filter((u) => u.role === r.role).length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT USER MODAL ──────────────────────────────────────────────── */}
      {(userModal === "add" || userModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">System Access</p>
                <h2 className="font-display text-base font-black text-white mt-0.5">
                  {userModal === "add" ? "Add New CMS User" : "Edit User Account"}
                </h2>
              </div>
              <button onClick={() => setUserModal(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Sarah Mitchell"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. sarah.mitchell@nexusgroup.example"
                  className="w-full border rounded-xl px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#cc0000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Department</label>
                  <input
                    type="text"
                    value={userForm.department}
                    onChange={(e) => setUserForm((f) => ({ ...f, department: e.target.value }))}
                    placeholder="e.g. Corporate Communications"
                    className="w-full border rounded-xl px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#cc0000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">System Role *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                    className="w-full border rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 bg-white outline-none focus:border-[#cc0000]"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Content Manager">Content Manager</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Account Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm((f) => ({ ...f, status: e.target.value as "Active" | "Inactive" }))}
                  className="w-full border rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 bg-white outline-none focus:border-[#cc0000]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setUserModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={!userForm.name.trim() || !userForm.email.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#cc0000] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#a80000] cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" /> Save User Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userModal === "delete" && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-black text-gray-900">Remove User Account?</h3>
                <p className="text-xs text-gray-500">This user will lose access to the CMS.</p>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
              {selectedUser.name} ({selectedUser.email}) — Role: {selectedUser.role}
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setUserModal(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 cursor-pointer">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
