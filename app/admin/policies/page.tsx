"use client"

import { useState, useEffect, useCallback } from "react"
import { CMSPage } from "@/components/admin/cms-page"
import { getPolicies, savePolicy, updatePolicy, deletePolicy } from "@/lib/cms-store"
import type { PolicyDocument } from "@/lib/data"

const columns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category", render: (r: PolicyDocument) => (
    <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-700">{r.category}</span>
  )},
  { key: "version", label: "Version" },
  { key: "updated", label: "Updated" },
  { key: "effective", label: "Effective" },
  { key: "downloads", label: "Downloads" },
]

const formFields = [
  { key: "title", label: "Title", type: "text" as const, placeholder: "Policy title", required: true },
  { key: "category", label: "Category", type: "select" as const, options: ["Communication", "Brand", "Social Media", "Event", "Approval", "Templates"], required: true },
  { key: "description", label: "Description", type: "textarea" as const, placeholder: "Policy description...", required: true },
  { key: "version", label: "Version", type: "text" as const, placeholder: "e.g. v3.2" },
  { key: "updated", label: "Last Updated", type: "text" as const, placeholder: "e.g. Jul 1, 2026" },
  { key: "effective", label: "Effective Date", type: "text" as const, placeholder: "e.g. Jan 1, 2026" },
  { key: "fileSize", label: "File Size", type: "text" as const, placeholder: "e.g. 2.8 MB" },
  { key: "downloads", label: "Downloads", type: "number" as const },
]

export default function AdminPoliciesPage() {
  const [data, setData] = useState<PolicyDocument[]>([])

  const load = useCallback(() => setData(getPolicies()), [])
  useEffect(() => { load() }, [load])

  return (
    <CMSPage
      title="Policies"
      description="Manage all policy documents and guidelines."
      columns={columns}
      data={data}
      previewPath={() => `/policies`}
      formFields={formFields}
      itemToForm={(item) => ({
        title: item.title,
        category: item.category,
        description: item.description,
        version: item.version,
        updated: item.updated,
        effective: item.effective,
        fileSize: item.fileSize,
        downloads: item.downloads,
      })}
      onAdd={(item) => { savePolicy(item as Omit<PolicyDocument, "id">); load() }}
      onEdit={(id, updates) => { updatePolicy(id, updates); load() }}
      onDelete={(id) => { deletePolicy(id); load() }}
    />
  )
}
