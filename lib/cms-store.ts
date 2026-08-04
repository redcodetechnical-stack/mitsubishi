// ─── CMS Data Store — localStorage CRUD with static fallback ─────────────────

import {
  events as staticEvents,
  news as staticNews,
  resources as staticResources,
  newsletters as staticNewsletters,
  leaderMessages as staticLeaderMessages,
  policies as staticPolicies,
  knowledgeArticles as staticKnowledge,
  campaigns as staticCampaigns,
  defaultBrandColors,
  defaultBrandTypography,
  defaultFontSpecimens,
  defaultContactTeamMembers,
  defaultContactChannels,
  defaultFaqItems,
  defaultCmsUsers,
  defaultRolePermissions,
  type EventItem,
  type NewsItem,
  type Resource,
  type NewsletterItem,
  type LeaderMessage,
  type PolicyDocument,
  type KnowledgeArticle,
  type Campaign,
  type BrandColor,
  type BrandTypography,
  type FontSpecimen,
  type ContactTeamMember,
  type ContactChannel,
  type FaqItem,
  type FaqCategory,
  type CmsUser,
  type UserRole,
  type RolePermission,
} from "@/lib/data"

// ── Generic helpers ────────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ── Events ─────────────────────────────────────────────────────────────────────

const EVENTS_KEY = "cms_events"

export function getEvents(): EventItem[] {
  return read<EventItem>(EVENTS_KEY, staticEvents)
}

export function saveEvent(item: Omit<EventItem, "id">): EventItem {
  const items = getEvents()
  const newItem = { ...item, id: genId("evt") } as EventItem
  write(EVENTS_KEY, [newItem, ...items])
  return newItem
}

export function updateEvent(id: string, updates: Partial<EventItem>) {
  const items = getEvents().map((e) => (e.id === id ? { ...e, ...updates } : e))
  write(EVENTS_KEY, items)
}

export function deleteEvent(id: string) {
  write(EVENTS_KEY, getEvents().filter((e) => e.id !== id))
}

// ── Event Kits & Templates ───────────────────────────────────────────────────

const EVENT_KITS_KEY = "cms_event_kits"

export type EventKit = {
  id: string
  label: string
  type: string
  filename: string
}

export const defaultEventKits: EventKit[] = [
  { id: "kit-1", label: "Town Hall Event Kit", type: "ZIP · 45 MB", filename: "Town-Hall-Event-Kit.zip" },
  { id: "kit-2", label: "Conference Branding Pack", type: "ZIP · 88 MB", filename: "Conference-Branding-Pack.zip" },
  { id: "kit-3", label: "Webinar Slide Template", type: "PPT · 12 MB", filename: "Webinar-Slide-Template.pptx" },
  { id: "kit-4", label: "Event Photography Brief", type: "DOC · 1.4 MB", filename: "Event-Photography-Brief.pdf" },
  { id: "kit-5", label: "Social Media Event Kit", type: "ZIP · 34 MB", filename: "Social-Media-Event-Kit.zip" },
  { id: "kit-6", label: "Name Badge Template", type: "PDF · 2.1 MB", filename: "Name-Badge-Template.pdf" },
]

export function getEventKits(): EventKit[] {
  return read<EventKit>(EVENT_KITS_KEY, defaultEventKits)
}

export function saveEventKit(item: Omit<EventKit, "id">): EventKit {
  const items = getEventKits()
  const newItem: EventKit = { ...item, id: genId("kit") }
  write(EVENT_KITS_KEY, [newItem, ...items])
  return newItem
}

export function updateEventKit(id: string, updates: Partial<EventKit>) {
  write(EVENT_KITS_KEY, getEventKits().map((k) => (k.id === id ? { ...k, ...updates } : k)))
}

export function deleteEventKit(id: string) {
  write(EVENT_KITS_KEY, getEventKits().filter((k) => k.id !== id))
}

// ── Event Galleries (Past Events) ────────────────────────────────────────────

const EVENT_GALLERIES_KEY = "cms_event_galleries"

export type EventGallery = {
  id: string
  title: string
  date: string
  location: string
  image: string
  images: string[]
  count?: string
}

export const defaultEventGalleries: EventGallery[] = [
  {
    id: "evt-1",
    title: "Global Town Hall Kickoff — Past Event Photo Gallery",
    date: "Jul 24, 2026",
    location: "London, UK · Midland Hall",
    image: "/event-townhall.png",
    images: [
      "/event-townhall.png",
      "/news-innovation.png",
      "/video-brandfilm.png",
      "/campaign-sustainability.png",
      "/leader-ceo.png",
      "/event-townhall.png",
    ],
  },
  {
    id: "evt-2",
    title: "International Corporate Conventions 2026 — Photo Album",
    date: "Jun 18, 2026",
    location: "Delhi, India · Grand Convention Centre",
    image: "/news-innovation.png",
    images: [
      "/news-innovation.png",
      "/video-brandfilm.png",
      "/event-townhall.png",
      "/campaign-sustainability.png",
      "/leader-ceo.png",
      "/news-innovation.png",
    ],
  },
  {
    id: "evt-3",
    title: "Sustainable Growth & Innovation Summit — Event Recap Photos",
    date: "May 30, 2026",
    location: "Tokyo, Japan · Innovation Hub",
    image: "/video-brandfilm.png",
    images: [
      "/video-brandfilm.png",
      "/event-townhall.png",
      "/news-innovation.png",
      "/campaign-sustainability.png",
      "/leader-ceo.png",
      "/video-brandfilm.png",
    ],
  },
]

export function getEventGalleries(): EventGallery[] {
  return read<EventGallery>(EVENT_GALLERIES_KEY, defaultEventGalleries)
}

export function saveEventGallery(item: Omit<EventGallery, "id">): EventGallery {
  const items = getEventGalleries()
  const newItem: EventGallery = { ...item, id: genId("gal") }
  write(EVENT_GALLERIES_KEY, [newItem, ...items])
  return newItem
}

export function updateEventGallery(id: string, updates: Partial<EventGallery>) {
  write(EVENT_GALLERIES_KEY, getEventGalleries().map((g) => (g.id === id ? { ...g, ...updates } : g)))
}

export function deleteEventGallery(id: string) {
  write(EVENT_GALLERIES_KEY, getEventGalleries().filter((g) => g.id !== id))
}


// ── News ───────────────────────────────────────────────────────────────────────

const NEWS_KEY = "cms_news"

export function getNews(): NewsItem[] {
  return read<NewsItem>(NEWS_KEY, staticNews)
}

export function saveNews(item: Omit<NewsItem, "id">): NewsItem {
  const items = getNews()
  const newItem = { ...item, id: genId("news") } as NewsItem
  write(NEWS_KEY, [newItem, ...items])
  return newItem
}

export function updateNews(id: string, updates: Partial<NewsItem>) {
  write(NEWS_KEY, getNews().map((e) => (e.id === id ? { ...e, ...updates } : e)))
}

export function deleteNews(id: string) {
  write(NEWS_KEY, getNews().filter((e) => e.id !== id))
}

// ── Resources ──────────────────────────────────────────────────────────────────

const RESOURCES_KEY = "cms_resources"

export function getResources(): Resource[] {
  return read<Resource>(RESOURCES_KEY, staticResources)
}

export function saveResource(item: Omit<Resource, "id">): Resource {
  const items = getResources()
  const newItem = { ...item, id: genId("res") } as Resource
  write(RESOURCES_KEY, [newItem, ...items])
  return newItem
}

export function updateResource(id: string, updates: Partial<Resource>) {
  write(RESOURCES_KEY, getResources().map((e) => (e.id === id ? { ...e, ...updates } : e)))
}

export function deleteResource(id: string) {
  write(RESOURCES_KEY, getResources().filter((e) => e.id !== id))
}

// ── Newsletters ────────────────────────────────────────────────────────────────

const NEWSLETTERS_KEY = "cms_newsletters"

export function getNewsletters(): NewsletterItem[] {
  return read<NewsletterItem>(NEWSLETTERS_KEY, staticNewsletters)
}

export function saveNewsletter(item: Omit<NewsletterItem, "id">): NewsletterItem {
  const items = getNewsletters()
  const newItem = { ...item, id: genId("nl") } as NewsletterItem
  write(NEWSLETTERS_KEY, [newItem, ...items])
  return newItem
}

export function updateNewsletter(id: string, updates: Partial<NewsletterItem>) {
  write(NEWSLETTERS_KEY, getNewsletters().map((e) => (e.id === id ? { ...e, ...updates } : e)))
}

export function deleteNewsletter(id: string) {
  write(NEWSLETTERS_KEY, getNewsletters().filter((e) => e.id !== id))
}

export function deleteMultipleNewsletters(ids: string[]) {
  const idSet = new Set(ids)
  write(NEWSLETTERS_KEY, getNewsletters().filter((e) => !idSet.has(e.id)))
}

export function saveMultipleNewsletters(itemsList: Omit<NewsletterItem, "id">[]): NewsletterItem[] {
  const items = getNewsletters()
  const created = itemsList.map((item, idx) => ({
    ...item,
    id: `${genId("nl")}-${Date.now()}-${idx}`
  })) as NewsletterItem[]
  write(NEWSLETTERS_KEY, [...created, ...items])
  return created
}


// ── Leader Messages ────────────────────────────────────────────────────────────

const LEADERS_KEY = "cms_leaders"

export function getLeaderMessages(): LeaderMessage[] {
  return read<LeaderMessage>(LEADERS_KEY, staticLeaderMessages)
}

export function saveLeaderMessage(item: Omit<LeaderMessage, "id">): LeaderMessage {
  const items = getLeaderMessages()
  const newItem = { ...item, id: genId("lm") } as LeaderMessage
  write(LEADERS_KEY, [newItem, ...items])
  return newItem
}

export function updateLeaderMessage(id: string, updates: Partial<LeaderMessage>) {
  write(LEADERS_KEY, getLeaderMessages().map((e) => (e.id === id ? { ...e, ...updates } : e)))
}

export function deleteLeaderMessage(id: string) {
  write(LEADERS_KEY, getLeaderMessages().filter((e) => e.id !== id))
}

// ── Policies ───────────────────────────────────────────────────────────────────

const POLICIES_KEY = "cms_policies"

export function getPolicies(): PolicyDocument[] {
  return read<PolicyDocument>(POLICIES_KEY, staticPolicies)
}

export function savePolicy(item: Omit<PolicyDocument, "id">): PolicyDocument {
  const items = getPolicies()
  const newItem = { ...item, id: genId("pol") } as PolicyDocument
  write(POLICIES_KEY, [newItem, ...items])
  return newItem
}

export function updatePolicy(id: string, updates: Partial<PolicyDocument>) {
  write(POLICIES_KEY, getPolicies().map((e) => (e.id === id ? { ...e, ...updates } : e)))
}

export function deletePolicy(id: string) {
  write(POLICIES_KEY, getPolicies().filter((e) => e.id !== id))
}

// ── Site Settings ──────────────────────────────────────────────────────────────

const SETTINGS_KEY = "cms_settings"

export type SiteSettings = {
  siteName: string
  siteTagline: string
  statsAssets: string
  statsBusinessUnits: string
  statsDownloads: string
  statsCampaigns: string
  featuredCampaignTitle: string
  featuredCampaignDesc: string
  featuredCampaignTags: string
  leaderName: string
  leaderRole: string
  leaderQuote: string
  leaderImage: string
  leaderParagraph: string
  eventsSectionTitle?: string
  eventsSectionSubtitle?: string
}

export const defaultSettings: SiteSettings = {
  siteName: "Nexus Hub",
  siteTagline: "The single source of truth for corporate communications and marketing content across the group.",
  statsAssets: "2,480+",
  statsBusinessUnits: "6",
  statsDownloads: "18.4k",
  statsCampaigns: "12",
  featuredCampaignTitle: "Powering a Sustainable Tomorrow",
  featuredCampaignDesc: "Our flagship 2026 campaign spotlighting the group's commitment to clean energy, responsible growth, and human-centric innovation across every business.",
  featuredCampaignTags: "Sustainability, Group, Brand",
  leaderName: "Ananya Rao",
  leaderRole: "Group Chief Executive Officer",
  leaderQuote: "This hub is how we move as one organization — a single, trusted place where every team can find the story, the assets, and the direction we're building together.",
  leaderImage: "/leader-ceo.png",
  leaderParagraph: "Whether teams need context, inspiration, guidance, or the tools to execute with confidence, this is where they begin. As the organization grows and evolves, this hub keeps people connected to the bigger picture, helping every team contribute to a stronger, more unified direction.",
  eventsSectionTitle: "Upcoming Events",
  eventsSectionSubtitle: "Join our executive briefings, global town halls, and interactive workshops.",
}

export function getSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export function saveSettingsData(s: SiteSettings) {
  if (typeof window === "undefined") return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

// ── Campaigns ──────────────────────────────────────────────────────────────────

const CAMPAIGNS_KEY = "cms_campaigns"

export function getCampaigns(): Campaign[] {
  return read<Campaign>(CAMPAIGNS_KEY, staticCampaigns)
}

export function saveCampaign(item: Omit<Campaign, "id">): Campaign {
  const items = getCampaigns()
  const newItem = { ...item, id: genId("cmp") } as Campaign
  write(CAMPAIGNS_KEY, [newItem, ...items])
  return newItem
}

export function updateCampaign(id: string, updates: Partial<Campaign>) {
  write(CAMPAIGNS_KEY, getCampaigns().map((e) => (e.id === id ? { ...e, ...updates } : e)))
}

export function deleteCampaign(id: string) {
  write(CAMPAIGNS_KEY, getCampaigns().filter((e) => e.id !== id))
}

// ── Knowledge ──────────────────────────────────────────────────────────────────

const KNOWLEDGE_KEY = "cms_knowledge"

export function getKnowledge(): KnowledgeArticle[] {
  return read<KnowledgeArticle>(KNOWLEDGE_KEY, staticKnowledge)
}

export function saveKnowledge(item: Omit<KnowledgeArticle, "id">): KnowledgeArticle {
  const items = getKnowledge()
  const newItem = { ...item, id: genId("ka") } as KnowledgeArticle
  write(KNOWLEDGE_KEY, [newItem, ...items])
  return newItem
}

export function updateKnowledge(id: string, updates: Partial<KnowledgeArticle>) {
  write(KNOWLEDGE_KEY, getKnowledge().map((e) => (e.id === id ? { ...e, ...updates } : e)))
}

export function deleteKnowledge(id: string) {
  write(KNOWLEDGE_KEY, getKnowledge().filter((e) => e.id !== id))
}

// ── Banners ───────────────────────────────────────────────────────────────────

// ── Banners ───────────────────────────────────────────────────────────────────

const BANNERS_KEY = "cms_banners"

export type PageBanner = {
  id: string
  pageKey: string
  pageName: string
  title: string
  subtitle: string
  image: string
  badge?: string
  linkUrl?: string
  linkText?: string
  displayOrder?: number
  isActive?: boolean
}

export const defaultBanners: PageBanner[] = [
  { id: "b-home-1", pageKey: "home", pageName: "Home Page", title: "Find every asset, campaign, and update in one place", subtitle: "Search approved brand assets, download the latest collateral, and stay on top of announcements across every business unit.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-home-2", pageKey: "home", pageName: "Home Page", title: "Explore 2026 Brand Guidelines & Toolkits", subtitle: "Access official logos, color palettes, vector assets, and presentation decks.", image: "/event-townhall.png", displayOrder: 2, isActive: true },
  { id: "b-ann-1", pageKey: "announcements", pageName: "Corporate Announcements", title: "Stay informed on what matters", subtitle: "Organizational announcements, business updates, leadership messages, and strategic news - all in one feed.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-camp-1", pageKey: "campaigns", pageName: "Marketing Campaigns", title: "Campaigns that move as one", subtitle: "Everything you need to bring our campaigns to life - overviews, objectives, creative assets, toolkits & timelines.", image: "/campaign-sustainability.png", displayOrder: 1, isActive: true },
  { id: "b-camp-2", pageKey: "campaigns", pageName: "Marketing Campaigns", title: "2026 Sustainability Roadmap Toolkit", subtitle: "Download key messaging, social media packs, and global launch video collateral.", image: "/news-innovation.png", displayOrder: 2, isActive: true },
  { id: "b-brand-1", pageKey: "brand-centre", pageName: "Brand Centre", title: "The home of our brand", subtitle: "Official logos, typography guidelines, presentation templates, and media assets for the group.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-brand-2", pageKey: "brand-centre", pageName: "Brand Centre", title: "New Helvetica & Roboto Typeface Specs", subtitle: "Updated typography guidelines, font pairing recommendations, and digital usage specs.", image: "/event-townhall.png", displayOrder: 2, isActive: true },
  { id: "b-comms-1", pageKey: "communications", pageName: "Corporate Communications", title: "Newsletters & Internal Communications", subtitle: "Stay connected with the latest corporate newsletters, CEO announcements, and leadership messages.", image: "/newsletter-cover.png", displayOrder: 1, isActive: true },
  { id: "b-events-1", pageKey: "events", pageName: "Events", title: "Where ideas come together", subtitle: "Upcoming town halls, webinars, launch events, and training workshops. Register today to secure your spot.", image: "/event-townhall.png", displayOrder: 1, isActive: true },
  { id: "b-mkt-1", pageKey: "marketing-assets", pageName: "Marketing Assets", title: "Ready-to-use marketing collateral", subtitle: "Brochures, product decks, case studies, and photography assets to support your marketing campaigns.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-kc-1", pageKey: "knowledge-centre", pageName: "Knowledge Centre", title: "Learn, discover, and do more", subtitle: "How-to guides, best practices, processes, FAQs, and training materials — everything you need to get the most from the hub.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-about-1", pageKey: "about", pageName: "About the Hub", title: "Empowering our teams with unified brand intelligence", subtitle: "Learn how the Nexus Hub streamlines brand compliance, communication workflows, and global asset management.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-contact-1", pageKey: "contact", pageName: "Contact Us", title: "Talk to the Communications Team", subtitle: "Submit a request, report an issue, or share feedback. We're here to help.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-search-1", pageKey: "search", pageName: "Search & Discovery", title: "Search Across All Group Assets & Resources", subtitle: "Instantly find documents, presentations, videos, guidelines, and announcements across all business units.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
  { id: "b-pol-1", pageKey: "policies", pageName: "Policies & Guidelines", title: "Know the rules, protect the brand", subtitle: "All communication policies, brand usage guidelines, approval workflows, & document templates in one place.", image: "/news-innovation.png", displayOrder: 1, isActive: true },
]

export function getBanners(): PageBanner[] {
  return read<PageBanner>(BANNERS_KEY, defaultBanners)
}

export function getBannersByPage(pageKey: string): PageBanner[] {
  const banners = getBanners()
  const list = banners.filter((b) => b.pageKey === pageKey || b.id === pageKey)
  return list.length > 0 ? list.sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)) : []
}

export function getBanner(idOrPageKey: string): PageBanner {
  const banners = getBanners()
  const match = banners.find((b) => b.id === idOrPageKey || b.pageKey === idOrPageKey)
  if (match) return match
  const fallback = defaultBanners.find((b) => b.id === idOrPageKey || b.pageKey === idOrPageKey)
  return fallback || defaultBanners[0]
}

export function saveBanner(item: Omit<PageBanner, "id">): PageBanner {
  const items = getBanners()
  const newItem: PageBanner = { ...item, id: genId("banner") }
  write(BANNERS_KEY, [...items, newItem])
  return newItem
}

export function updateBanner(id: string, updates: Partial<PageBanner>) {
  write(BANNERS_KEY, getBanners().map((b) => (b.id === id || b.pageKey === id ? { ...b, ...updates } : b)))
}

export function deleteBanner(id: string) {
  write(BANNERS_KEY, getBanners().filter((b) => b.id !== id))
}

// ── Videos ────────────────────────────────────────────────────────────────────

const VIDEOS_KEY = "cms_videos"

export type VideoItem = {
  id: string
  section: "home" | "campaigns" | "communications" | "knowledge-centre"
  sectionLabel: string
  title: string
  description: string
  duration: string
  image: string
  category: string
}

export const defaultVideos: VideoItem[] = [
  // Home – Featured Videos
  {
    id: "home-vid-1",
    section: "home",
    sectionLabel: "Home – Featured Videos",
    title: "One Group, One Vision Brand Film",
    description: "A 3 min film highlighting our shared vision, values, and global impact.",
    duration: "3:00",
    image: "/video-brandfilm.png",
    category: "Brand Film",
  },
  {
    id: "home-vid-2",
    section: "home",
    sectionLabel: "Home – Featured Videos",
    title: "Sustainability & Future Technology 2026",
    description: "Excellence in eco-friendly innovations and renewable energy solutions.",
    duration: "2:30",
    image: "/news-innovation.png",
    category: "Technology",
  },
  {
    id: "home-vid-3",
    section: "home",
    sectionLabel: "Home – Featured Videos",
    title: "Global Executive Keynote Highlights",
    description: "Leadership Insights from the Annual Global Executive Meeting.",
    duration: "4:12",
    image: "/event-townhall.png",
    category: "Events",
  },
  // Marketing Campaigns
  {
    id: "campaigns-vid-1",
    section: "campaigns",
    sectionLabel: "Marketing Campaigns",
    title: "One Group, One Vision — 2026 Brand Film",
    description: "The flagship brand film for the 2026 global campaign launch.",
    duration: "2:48",
    image: "/video-brandfilm.png",
    category: "Communications",
  },
  {
    id: "campaigns-vid-2",
    section: "campaigns",
    sectionLabel: "Marketing Campaigns",
    title: "Sustainability Campaign Highlight Reel",
    description: "A visual overview of our sustainability commitments in 2026.",
    duration: "3:05",
    image: "/campaign-sustainability.png",
    category: "Communications",
  },
  // Corporate Communications
  {
    id: "comms-vid-1",
    section: "communications",
    sectionLabel: "Corporate Communications",
    title: "One Group, One Vision — 2026 Brand Film - Pankaj Trivedi",
    description: "A leadership message from our Group MD on the 2026 vision and priorities.",
    duration: "3:45",
    image: "/video-brandfilm.png",
    category: "Corporate",
  },
  {
    id: "comms-vid-2",
    section: "communications",
    sectionLabel: "Corporate Communications",
    title: "Q1 Business Update — All Staff",
    description: "Quarterly update covering performance highlights and strategic direction.",
    duration: "2:30",
    image: "/news-innovation.png",
    category: "Corporate",
  },
  {
    id: "comms-vid-3",
    section: "communications",
    sectionLabel: "Corporate Communications",
    title: "Annual Town Hall Recording",
    description: "Full recording of the annual all-hands town hall event.",
    duration: "4:12",
    image: "/event-townhall.png",
    category: "Corporate",
  },
  // Knowledge Centre
  {
    id: "knowledge-vid-1",
    section: "knowledge-centre",
    sectionLabel: "Knowledge Centre",
    title: "One Group, One Vision — 2026 Brand Film",
    description: "A 3 min film highlighting our shared vision, values, and global impact.",
    duration: "2:48",
    image: "/video-brandfilm.png",
    category: "Communications",
  },
  {
    id: "knowledge-vid-2",
    section: "knowledge-centre",
    sectionLabel: "Knowledge Centre",
    title: "Nexus Sustainability Campaign Overview",
    description: "Walkthrough of the sustainability campaign goals, assets and execution plan.",
    duration: "3:05",
    image: "/campaign-sustainability.png",
    category: "Campaigns",
  },
  {
    id: "knowledge-vid-3",
    section: "knowledge-centre",
    sectionLabel: "Knowledge Centre",
    title: "Corporate Brand Guidelines v4.0 Walkthrough",
    description: "Video walkthrough of the updated corporate brand guidelines document.",
    duration: "4:12",
    image: "/news-innovation.png",
    category: "Brand Centre",
  },
  {
    id: "knowledge-vid-4",
    section: "knowledge-centre",
    sectionLabel: "Knowledge Centre",
    title: "Global Dealers Meet Keynote Highlights",
    description: "Key moments and insights from the annual global dealers meeting keynote.",
    duration: "5:30",
    image: "/event-townhall.png",
    category: "Events",
  },
]

export function getVideos(): VideoItem[] {
  return read<VideoItem>(VIDEOS_KEY, defaultVideos)
}

export function getVideosBySection(section: VideoItem["section"]): VideoItem[] {
  return getVideos().filter((v) => v.section === section)
}

export function updateVideo(id: string, updates: Partial<VideoItem>) {
  write(VIDEOS_KEY, getVideos().map((v) => (v.id === id ? { ...v, ...updates } : v)))
}

export function addVideo(video: Omit<VideoItem, "id">) {
  const newVideo: VideoItem = { ...video, id: genId("vid") }
  write(VIDEOS_KEY, [...getVideos(), newVideo])
  return newVideo
}

export function deleteVideo(id: string) {
  write(VIDEOS_KEY, getVideos().filter((v) => v.id !== id))
}

// ── Employee Stories ──────────────────────────────────────────────────────────

const STORIES_KEY = "cms_employee_stories"

export type EmployeeStory = {
  id: string
  author: string
  role: string
  avatar: string
  quote: string
}

export const defaultEmployeeStories: EmployeeStory[] = [
  {
    id: "es-1",
    author: "Priyanka Bajaj",
    role: "Chief Executive Officer",
    avatar: "/leader-ceo.png",
    quote: "This hub is how we move as one organization: a single, trusted place where every team can find the story, the assets, and the direction we're building together.",
  },
  {
    id: "es-2",
    author: "Deepak Singhal",
    role: "Web Designer",
    avatar: "/leader-ceo.png",
    quote: "A platform that unites every team, making it effortless to access the brand assets and resources we need to do our best work.",
  },
  {
    id: "es-3",
    author: "Meera Nair",
    role: "Marketing Lead",
    avatar: "/leader-ceo.png",
    quote: "Finding the right asset used to take hours. Now everything is in one place — that's a real game changer for our team's productivity.",
  },
]

export function getEmployeeStories(): EmployeeStory[] {
  return read<EmployeeStory>(STORIES_KEY, defaultEmployeeStories)
}

export function saveEmployeeStory(item: Omit<EmployeeStory, "id">): EmployeeStory {
  const items = getEmployeeStories()
  const newItem: EmployeeStory = { ...item, id: genId("es") }
  write(STORIES_KEY, [newItem, ...items])
  return newItem
}

export function updateEmployeeStory(id: string, updates: Partial<EmployeeStory>) {
  write(STORIES_KEY, getEmployeeStories().map((s) => (s.id === id ? { ...s, ...updates } : s)))
}

export function deleteEmployeeStory(id: string) {
  write(STORIES_KEY, getEmployeeStories().filter((s) => s.id !== id))
}

// ── Brand Colors ───────────────────────────────────────────────────────────────

const BRAND_COLORS_KEY = "cms_brand_colors"

export function getBrandColors(): BrandColor[] {
  const items = read<BrandColor>(BRAND_COLORS_KEY, defaultBrandColors)
  return items.map((item) => {
    const def = defaultBrandColors.find((d) => d.id === item.id || d.name.toLowerCase() === item.name.toLowerCase())
    if (def) {
      return {
        ...item,
        hex: def.hex,
        shades: def.shades || item.shades,
      }
    }
    return item
  })
}

export function saveBrandColor(item: Omit<BrandColor, "id">): BrandColor {
  const items = getBrandColors()
  const newItem: BrandColor = { ...item, id: genId("col") }
  write(BRAND_COLORS_KEY, [...items, newItem])
  return newItem
}

export function updateBrandColor(id: string, updates: Partial<BrandColor>) {
  write(BRAND_COLORS_KEY, getBrandColors().map((c) => (c.id === id ? { ...c, ...updates } : c)))
}

export function deleteBrandColor(id: string) {
  write(BRAND_COLORS_KEY, getBrandColors().filter((c) => c.id !== id))
}

// ── Brand Typography ───────────────────────────────────────────────────────────

const BRAND_TYPO_KEY = "cms_brand_typography"

export function getBrandTypography(): BrandTypography[] {
  return read<BrandTypography>(BRAND_TYPO_KEY, defaultBrandTypography)
}

export function saveBrandTypography(item: Omit<BrandTypography, "id">): BrandTypography {
  const items = getBrandTypography()
  const newItem: BrandTypography = { ...item, id: genId("typ") }
  write(BRAND_TYPO_KEY, [...items, newItem])
  return newItem
}

export function updateBrandTypography(id: string, updates: Partial<BrandTypography>) {
  write(BRAND_TYPO_KEY, getBrandTypography().map((t) => (t.id === id ? { ...t, ...updates } : t)))
}

export function deleteBrandTypography(id: string) {
  write(BRAND_TYPO_KEY, getBrandTypography().filter((t) => t.id !== id))
}

// ── Font Specimens ─────────────────────────────────────────────────────────────

const FONT_SPECIMENS_KEY = "cms_font_specimens"

export function getFontSpecimens(): FontSpecimen[] {
  return read<FontSpecimen>(FONT_SPECIMENS_KEY, defaultFontSpecimens)
}

export function saveFontSpecimen(item: Omit<FontSpecimen, "id">): FontSpecimen {
  const items = getFontSpecimens()
  const newItem: FontSpecimen = { ...item, id: genId("spec") }
  write(FONT_SPECIMENS_KEY, [...items, newItem])
  return newItem
}

export function updateFontSpecimen(id: string, updates: Partial<FontSpecimen>) {
  write(FONT_SPECIMENS_KEY, getFontSpecimens().map((s) => (s.id === id ? { ...s, ...updates } : s)))
}

export function deleteFontSpecimen(id: string) {
  write(FONT_SPECIMENS_KEY, getFontSpecimens().filter((s) => s.id !== id))
}

// ── Contact Team Members ────────────────────────────────────────────────────────

const CONTACT_TEAM_KEY = "cms_contact_team"

export function getContactTeamMembers(): ContactTeamMember[] {
  return read<ContactTeamMember>(CONTACT_TEAM_KEY, defaultContactTeamMembers)
}

export function saveContactTeamMember(item: Omit<ContactTeamMember, "id">): ContactTeamMember {
  const items = getContactTeamMembers()
  const newItem: ContactTeamMember = { ...item, id: genId("ct") }
  write(CONTACT_TEAM_KEY, [...items, newItem])
  return newItem
}

export function updateContactTeamMember(id: string, updates: Partial<ContactTeamMember>) {
  write(CONTACT_TEAM_KEY, getContactTeamMembers().map((t) => (t.id === id ? { ...t, ...updates } : t)))
}

export function deleteContactTeamMember(id: string) {
  write(CONTACT_TEAM_KEY, getContactTeamMembers().filter((t) => t.id !== id))
}

// ── Contact Channels ────────────────────────────────────────────────────────────

const CONTACT_CHANNELS_KEY = "cms_contact_channels"

export function getContactChannels(): ContactChannel[] {
  return read<ContactChannel>(CONTACT_CHANNELS_KEY, defaultContactChannels)
}

export function saveContactChannel(item: Omit<ContactChannel, "id">): ContactChannel {
  const items = getContactChannels()
  const newItem: ContactChannel = { ...item, id: genId("cc") }
  write(CONTACT_CHANNELS_KEY, [...items, newItem])
  return newItem
}

export function updateContactChannel(id: string, updates: Partial<ContactChannel>) {
  write(CONTACT_CHANNELS_KEY, getContactChannels().map((c) => (c.id === id ? { ...c, ...updates } : c)))
}

export function deleteContactChannel(id: string) {
  write(CONTACT_CHANNELS_KEY, getContactChannels().filter((c) => c.id !== id))
}

// ── FAQs ──────────────────────────────────────────────────────────────────────

const FAQS_KEY = "cms_faqs"

export function getFaqs(): FaqItem[] {
  return read<FaqItem>(FAQS_KEY, defaultFaqItems)
}

export function getFaqsByCategory(category: FaqCategory): FaqItem[] {
  const faqs = getFaqs()
  const filtered = faqs.filter((f) => f.category === category)
  return filtered.length > 0 ? filtered : faqs
}

export function saveFaq(item: Omit<FaqItem, "id">): FaqItem {
  const items = getFaqs()
  const newItem: FaqItem = { ...item, id: genId("faq") }
  write(FAQS_KEY, [...items, newItem])
  return newItem
}

export function updateFaq(id: string, updates: Partial<FaqItem>) {
  write(FAQS_KEY, getFaqs().map((f) => (f.id === id ? { ...f, ...updates } : f)))
}

export function deleteFaq(id: string) {
  write(FAQS_KEY, getFaqs().filter((f) => f.id !== id))
}

// ── CMS Users & Roles ──────────────────────────────────────────────────────────

const CMS_USERS_KEY = "cms_users"
const ROLE_PERMISSIONS_KEY = "cms_role_permissions"

export function getCmsUsers(): CmsUser[] {
  return read<CmsUser>(CMS_USERS_KEY, defaultCmsUsers)
}

export function saveCmsUser(item: Omit<CmsUser, "id">): CmsUser {
  const items = getCmsUsers()
  const newItem: CmsUser = { ...item, id: genId("usr"), lastLogin: "Never" }
  write(CMS_USERS_KEY, [...items, newItem])
  return newItem
}

export function updateCmsUser(id: string, updates: Partial<CmsUser>) {
  write(CMS_USERS_KEY, getCmsUsers().map((u) => (u.id === id ? { ...u, ...updates } : u)))
}

export function deleteCmsUser(id: string) {
  write(CMS_USERS_KEY, getCmsUsers().filter((u) => u.id !== id))
}

export function getRolePermissions(): RolePermission[] {
  return read<RolePermission>(ROLE_PERMISSIONS_KEY, defaultRolePermissions)
}

export function updateRolePermission(role: UserRole, updates: Partial<RolePermission>) {
  write(ROLE_PERMISSIONS_KEY, getRolePermissions().map((r) => (r.role === role ? { ...r, ...updates } : r)))
}

