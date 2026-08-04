"use client"

import { useState, useEffect, useCallback } from "react"
import { CMSPage } from "@/components/admin/cms-page"
import type { Campaign } from "@/lib/data"
import { getCampaigns, saveCampaign, updateCampaign, deleteCampaign } from "@/lib/cms-store"

const columns = [
  { key: "title", label: "Campaign Name" },
  { key: "description", label: "Description" },
  { key: "date", label: "Status / Date" },
  { key: "location", label: "Channels" },
  { key: "registrationOpen", label: "Active", render: (r: Campaign) => (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.registrationOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {r.registrationOpen ? "Active" : "Inactive"}
    </span>
  )},
]

const formFields = [
  { key: "title", label: "Campaign Name", type: "text" as const, placeholder: "Campaign title", required: true },
  { key: "description", label: "Description", type: "textarea" as const, placeholder: "Campaign description..." },
  { key: "date", label: "Status / Date", type: "text" as const, placeholder: "e.g. Live now / Aug 5, 2026" },
  { key: "location", label: "Channels", type: "text" as const, placeholder: "e.g. Digital + Print + Social" },
  { key: "time", label: "Duration", type: "text" as const, placeholder: "e.g. Q3 2026" },
  { key: "registrationOpen", label: "Active", type: "checkbox" as const, placeholder: "Mark as active" },
]

export default function AdminCampaignsPage() {
  const [data, setData] = useState<Campaign[]>([])

  const load = useCallback(() => setData(getCampaigns()), [])
  useEffect(() => { load() }, [load])

  return (
    <CMSPage
      title="Campaigns"
      description="Manage all marketing campaigns."
      columns={columns}
      data={data}
      previewPath={() => `/campaigns`}
      formFields={formFields}
      itemToForm={(item) => ({
        title: item.title,
        description: item.description ?? "",
        date: item.date,
        time: item.time,
        location: item.location,
        registrationOpen: item.registrationOpen,
      })}
      onAdd={(item) => { saveCampaign(item as Omit<Campaign, "id">); load() }}
      onEdit={(id, updates) => { updateCampaign(id, updates); load() }}
      onDelete={(id) => { deleteCampaign(id); load() }}
    />
  )
}
