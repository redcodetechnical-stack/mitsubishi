"use client"

import { useState, useEffect, useCallback } from "react"
import { CMSPage } from "@/components/admin/cms-page"
import { getNews, saveNews, updateNews, deleteNews } from "@/lib/cms-store"
import type { NewsItem } from "@/lib/data"

const columns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category", render: (r: NewsItem) => (
    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">{r.category}</span>
  )},
  { key: "tag", label: "Tag" },
  { key: "date", label: "Date" },
  { key: "readTime", label: "Read Time" },
]

const formFields = [
  { key: "title", label: "Title", type: "text" as const, placeholder: "News headline", required: true },
  { key: "excerpt", label: "Excerpt", type: "textarea" as const, placeholder: "Short summary...", required: true },
  { key: "category", label: "Category", type: "select" as const, options: ["Announcements", "Campaigns", "Brand Centre", "Marketing Assets", "Communications", "Events", "Policies", "Knowledge Centre"], required: true },
  { key: "tag", label: "Tag", type: "text" as const, placeholder: "e.g. Strategic Update" },
  { key: "date", label: "Date", type: "text" as const, placeholder: "e.g. Jul 12, 2026", required: true },
  { key: "readTime", label: "Read Time", type: "text" as const, placeholder: "e.g. 4 min read" },
  { key: "image", label: "Cover Image", type: "image" as const },
]

export default function AdminNewsPage() {
  const [data, setData] = useState<NewsItem[]>([])

  const load = useCallback(() => setData(getNews()), [])
  useEffect(() => { load() }, [load])

  return (
    <CMSPage
      title="News & Announcements"
      description="Manage all news articles and announcements."
      columns={columns}
      data={data}
      previewPath={(item) => `/knowledge-centre/${item.id}`}
      formFields={formFields}
      itemToForm={(item) => ({
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        tag: item.tag,
        date: item.date,
        readTime: item.readTime,
        image: item.image ?? "",
      })}
      onAdd={(item) => { saveNews(item as Omit<NewsItem, "id">); load() }}
      onEdit={(id, updates) => { updateNews(id, updates); load() }}
      onDelete={(id) => { deleteNews(id); load() }}
    />
  )
}
