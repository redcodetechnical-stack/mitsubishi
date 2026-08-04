// ─── CMS Auth Utilities ───────────────────────────────────────────────────────

const AUTH_KEY = "cms_auth_token"
const USER_KEY = "cms_auth_user"

export type CMSUser = {
  email: string
  name: string
  role: string
}

const VALID_CREDENTIALS = [
  { email: "admin@mitsubishi-electric.com", password: "mitsubishi@2026", name: "Admin User", role: "Super Admin" },
  { email: "admin@mitsubishi.com", password: "mitsubishi@2026", name: "Admin User", role: "Super Admin" },
]

export function login(email: string, password: string): { success: boolean; error?: string } {
  const user = VALID_CREDENTIALS.find(
    (c) => c.email === email && c.password === password
  )
  if (!user) return { success: false, error: "Invalid email or password." }
  const token = btoa(`${email}:${Date.now()}`)
  localStorage.setItem(AUTH_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify({ email: user.email, name: user.name, role: user.role }))
  return { success: true }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(AUTH_KEY)
}

export function getUser(): CMSUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}
