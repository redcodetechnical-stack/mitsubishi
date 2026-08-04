export type Category =
  | "Announcements"
  | "Campaigns"
  | "Brand Centre"
  | "Marketing Assets"
  | "Communications"
  | "Events"
  | "Policies"
  | "Knowledge Centre"

export type FileType = "PDF" | "PPT" | "DOC" | "XLS" | "Image" | "Video" | "ZIP"

export type BusinessUnit =
  | "Group"
  | "Technology"
  | "Consumer"
  | "Industrial"
  | "Financial Services"
  | "Healthcare"

export type Resource = {
  id: string
  title: string
  description: string
  category: Category
  business: BusinessUnit
  fileType: FileType
  size: string
  year: number
  tags: string[]
  downloads: number
  updated: string
  featured?: boolean
  image?: string
  icon?: string
  fileUrl?: string
  fileName?: string
  isHomeTrending?: boolean
}

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  category: Category
  date: string
  readTime: string
  image?: string
  tag: string
  isPopular?: boolean
  isFeatured?: boolean
}

export type EventSpeaker = {
  id?: string | number
  name: string
  role: string
  title: string
  time: string
  location: string
  avatar: string
  isHighlighted?: boolean
}

export type EventItem = {
  id: string
  title: string
  date: string
  time: string
  location: string
  address?: string
  type: "Town Hall" | "Webinar" | "Workshop" | "Launch" | "Conference"
  image?: string
  registrationOpen: boolean
  description?: string
  secondaryTitle?: string
  secondaryImage?: string
  secondaryDescription?: string
  promoTitle?: string
  promoAccess?: string
  seatsFilled?: string
  venuePhotos?: string[]
  speakers?: EventSpeaker[]
  showOnHome?: boolean
  showOnEventsPage?: boolean
}

export type NewsletterItem = {
  id: string
  title: string
  issue: string
  date: string
  description: string
  image?: string
  fileSize: string
  downloads: number
  from?: string
  to?: string
  salutation?: string
  signoff?: string
  division?: string
  pdfUrl?: string
  isPopular?: boolean
  isFeatured?: boolean
}

export type LeaderMessage = {
  id: string
  name: string
  role: string
  image: string
  subject: string
  excerpt: string
  date: string
  readTime: string
}

export type PolicyDocument = {
  id: string
  title: string
  category: "Communication" | "Brand" | "Social Media" | "Event" | "Approval" | "Templates"
  description: string
  version: string
  updated: string
  fileSize: string
  downloads: number
  effective: string
}

export type KnowledgeArticle = {
  id: string
  title: string
  excerpt: string
  category: "How-to Guide" | "Best Practice" | "FAQ" | "Process" | "Training"
  department: string
  author: string
  date: string
  readTime: string
  views: number
  tags: string[]
  image?: string
  isPopular?: boolean
  isFeatured?: boolean
}

export type Campaign = {
  id: string
  title: string
  type: "Town Hall" | "Webinar" | "Workshop" | "Launch" | "Conference"
  date: string
  time: string
  location: string
  registrationOpen: boolean
  description?: string
}

export const campaigns: Campaign[] = [
  { id: "cmp-1", title: "Powering a Sustainable Tomorrow", type: "Launch", date: "Live now", time: "Ongoing", location: "All channels", registrationOpen: true, description: "Our flagship 2026 sustainability campaign." },
  { id: "cmp-2", title: "Brand Refresh 2026", type: "Launch", date: "Jul 9, 2026", time: "Ongoing", location: "Digital + Print", registrationOpen: true, description: "Refreshed logo suite and identity rollout." },
]

export type NavItem = {
  label: string
  href: string
  description: string
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navItems: NavItem[] = [
  { label: "Brand Centre", href: "/brand-centre", description: "Logos, templates, guidelines and assets" },
  { label: "Marketing Assets", href: "/marketing-assets", description: "Brochures, decks, case studies" },
  { label: "Events", href: "/events", description: "Calendar, galleries and event kits" },
  { label: "Analytics Dashboard", href: "/analytics", description: "Performance metrics and insights" },
  { label: "Knowledge Centre", href: "/knowledge-centre", description: "Guides, processes and training" },
  { label: "About the Hub", href: "/about", description: "How to use this platform" },
  { label: "Contact Us", href: "/contact", description: "Reach the communications team" },
]

export const primaryNavItems = navItems.slice(0, 6)
export const secondaryNavItems = navItems.slice(6)

// ─── Stats ────────────────────────────────────────────────────────────────────

export const stats = [
  { label: "Assets available", value: "2,480+" },
  { label: "Business units", value: "6" },
  { label: "Downloads this month", value: "18.4k" },
  { label: "Active campaigns", value: "12" },
]

// ─── Featured content ─────────────────────────────────────────────────────────

export const featuredCampaign = {
  id: "cmp-sustainability-2026",
  title: "Powering a Sustainable Tomorrow",
  kicker: "Featured Campaign · Live now",
  description:
    "Our flagship 2026 campaign spotlighting the group's commitment to clean energy, responsible growth, and human-centric innovation across every business.",
  image: "/campaign-sustainability.png",
  tags: ["Sustainability", "Group", "Brand"],
  href: "/campaigns",
}

export const leadershipMessage = {
  name: "Ananya Rao",
  role: "Group Chief Executive Officer",
  image: "/leader-ceo.png",
  quote:
    "This hub is how we move as one organization — a single, trusted place where every team can find the story, the assets, and the direction we're building together.",
  href: "/communications",
}

// ─── News ─────────────────────────────────────────────────────────────────────

export const news: NewsItem[] = [
  {
    id: "news-1",
    title: "Group unveils 2026 innovation roadmap at annual leadership summit",
    excerpt:
      "A five-year plan focused on AI adoption, sustainable manufacturing, and customer-first digital experiences across all business units.",
    category: "Announcements",
    date: "Jul 12, 2026",
    readTime: "4 min read",
    image: "/news-innovation.png",
    tag: "Strategic Update",
  },
  {
    id: "news-2",
    title: "New brand identity system rolls out across all regional offices",
    excerpt:
      "Refreshed logo suite, typography, and templates are now live in the Brand Centre for immediate download and use.",
    category: "Brand Centre",
    date: "Jul 9, 2026",
    readTime: "3 min read",
    tag: "Brand",
  },
  {
    id: "news-3",
    title: "Q2 town hall recording and presentation now available",
    excerpt:
      "Missed the quarterly town hall? Watch the full session and download the leadership deck from the Events centre.",
    category: "Events",
    date: "Jul 5, 2026",
    readTime: "2 min read",
    tag: "Town Hall",
  },
  {
    id: "news-4",
    title: "Updated social media guidelines for all employees",
    excerpt:
      "New guidance on representing the brand online, approval workflows, and do's and don'ts for public channels.",
    category: "Policies",
    date: "Jul 1, 2026",
    readTime: "5 min read",
    tag: "Policy Update",
  },
]

// ─── Events ───────────────────────────────────────────────────────────────────

export const events: EventItem[] = [
  {
    id: "evt-1",
    title: "Global Town Hall — H2 Kickoff",
    date: "Jul 24, 2026",
    time: "4:00 PM IST",
    location: "Auditorium + Livestream",
    type: "Town Hall",
    image: "/event-townhall.png",
    registrationOpen: true,
    description: "Join leadership for the half-year strategic review, key priorities, and Q&A with the CEO.",
  },
  {
    id: "evt-2",
    title: "Brand Storytelling Masterclass",
    date: "Jul 29, 2026",
    time: "11:00 AM IST",
    location: "Online · Teams",
    type: "Workshop",
    registrationOpen: true,
    description: "A hands-on workshop on crafting compelling brand narratives for internal and external audiences.",
  },
  {
    id: "evt-3",
    title: "Sustainability Campaign Launch",
    date: "Aug 5, 2026",
    time: "3:30 PM IST",
    location: "HQ Innovation Lab",
    type: "Launch",
    registrationOpen: true,
    description: "Official launch event for our flagship 2026 sustainability campaign. Media and leadership in attendance.",
  },
  {
    id: "evt-4",
    title: "Marketing Leaders Conference 2026",
    date: "Aug 18, 2026",
    time: "9:00 AM IST",
    location: "Grand Convention Centre",
    type: "Conference",
    registrationOpen: false,
    description: "Annual gathering of marketing leaders across all business units to align on H2 strategy.",
  },
  {
    id: "evt-5",
    title: "Digital Marketing Bootcamp",
    date: "Sep 2, 2026",
    time: "10:00 AM IST",
    location: "Online · Teams",
    type: "Workshop",
    registrationOpen: true,
    description: "A two-day intensive on SEO, paid media, and content performance analytics.",
  },
  {
    id: "evt-6",
    title: "Q3 All-Hands Webinar",
    date: "Sep 15, 2026",
    time: "3:00 PM IST",
    location: "Online · Zoom",
    type: "Webinar",
    registrationOpen: false,
    description: "Quarterly company-wide update from the executive team covering financial performance and priorities.",
  },
]

// ─── Videos ───────────────────────────────────────────────────────────────────

export type FeaturedVideo = {
  id: string
  title: string
  category: string
  duration: string
  image: string
}

export const featuredVideos: FeaturedVideo[] = [
  {
    id: "vid-1",
    title: "One Group, One Vision — 2026 Brand Film",
    duration: "2:48",
    image: "/video-brandfilm.png",
    category: "Communications" as Category,
  },
  {
    id: "vid-2",
    title: "Inside the Sustainability Campaign",
    duration: "4:12",
    image: "/campaign-sustainability.png",
    category: "Campaigns" as Category,
  },
  {
    id: "vid-3",
    title: "CEO Message: Building What's Next",
    duration: "3:05",
    image: "/leader-ceo.png",
    category: "Communications" as Category,
  },
]

// ─── Newsletters ──────────────────────────────────────────────────────────────

export const newsletters: NewsletterItem[] = [
  {
    id: "nl-1",
    title: "The Hub — Q2 2026 Edition",
    issue: "Vol. 8, Issue 2",
    date: "Jul 2, 2026",
    description: "Quarterly digest covering the sustainability campaign launch, Q2 milestones, employee spotlights, and upcoming events.",
    image: "/newsletter-cover.png",
    fileSize: "8.9 MB",
    downloads: 3120,
  },
  {
    id: "nl-2",
    title: "The Hub — Q1 2026 Edition",
    issue: "Vol. 8, Issue 1",
    date: "Apr 3, 2026",
    description: "New year kick-off, brand refresh announcement, leadership changes, and 2026 campaign preview.",
    image: "/newsletter-cover.png",
    fileSize: "7.4 MB",
    downloads: 2890,
  },
  {
    id: "nl-3",
    title: "The Hub — Q4 2025 Edition",
    issue: "Vol. 7, Issue 4",
    date: "Jan 5, 2026",
    description: "Year-end review, top stories of 2025, employee recognition awards, and a message from the CEO.",
    fileSize: "9.1 MB",
    downloads: 4210,
  },
  {
    id: "nl-4",
    title: "Special Edition: 2026 Strategy",
    issue: "Special Edition",
    date: "Feb 14, 2026",
    description: "Deep-dive into the group's five-year strategy, key focus areas, and leadership perspectives on the road ahead.",
    fileSize: "5.6 MB",
    downloads: 5380,
  },
]

// ─── Leadership Messages ───────────────────────────────────────────────────────

export const leaderMessages: LeaderMessage[] = [
  {
    id: "lm-1",
    name: "Ananya Rao",
    role: "Group CEO",
    image: "/leader-ceo.png",
    subject: "Reflecting on a strong first half — and the road ahead",
    excerpt: "As we move into H2, I want to share my thoughts on what we've achieved together, and how we're positioning ourselves for the challenges and opportunities that lie ahead.",
    date: "Jul 10, 2026",
    readTime: "4 min read",
  },
  {
    id: "lm-2",
    name: "Rahul Mehta",
    role: "Chief Marketing Officer",
    image: "/leader-ceo.png",
    subject: "Our 2026 campaign strategy: why sustainability leads the way",
    excerpt: "Marketing's role is to tell our story authentically. This year, that story is about sustainability — and every team has a part to play in bringing it to life.",
    date: "Jun 28, 2026",
    readTime: "3 min read",
  },
  {
    id: "lm-3",
    name: "Priya Sharma",
    role: "Chief People Officer",
    image: "/leader-ceo.png",
    subject: "Building a culture of recognition and belonging",
    excerpt: "Our people are our greatest asset. The new recognition program launching this quarter reflects our commitment to celebrating the individuals who drive our success every day.",
    date: "Jun 20, 2026",
    readTime: "5 min read",
  },
]

// ─── Policies ─────────────────────────────────────────────────────────────────

export const policies: PolicyDocument[] = [
  {
    id: "pol-1",
    title: "Corporate Communication Policy",
    category: "Communication",
    description: "Governs all internal and external corporate communications, approval flows, and spokesperson guidelines.",
    version: "v3.2",
    updated: "Jul 1, 2026",
    fileSize: "2.8 MB",
    downloads: 1840,
    effective: "Jan 1, 2026",
  },
  {
    id: "pol-2",
    title: "Brand Usage Policy",
    category: "Brand",
    description: "Rules governing internal and external use of the corporate brand, logos, colors, and visual identity.",
    version: "v5.0",
    updated: "Jul 1, 2026",
    fileSize: "2.1 MB",
    downloads: 1210,
    effective: "Jul 9, 2026",
  },
  {
    id: "pol-3",
    title: "Social Media Guidelines",
    category: "Social Media",
    description: "Best practices and approval process for employee social activity, brand representation, and crisis response.",
    version: "v2.4",
    updated: "Jul 1, 2026",
    fileSize: "1.8 MB",
    downloads: 2040,
    effective: "Jul 1, 2026",
  },
  {
    id: "pol-4",
    title: "Event Branding Guidelines",
    category: "Event",
    description: "Standards for booths, banners, signage, and branded collateral at all company-organized events.",
    version: "v1.8",
    updated: "Jun 18, 2026",
    fileSize: "5.4 MB",
    downloads: 720,
    effective: "Mar 1, 2026",
  },
  {
    id: "pol-5",
    title: "Content Approval Workflow",
    category: "Approval",
    description: "Step-by-step guide to submitting, reviewing, and approving content for publication across all channels.",
    version: "v2.1",
    updated: "May 30, 2026",
    fileSize: "1.2 MB",
    downloads: 950,
    effective: "Jan 1, 2026",
  },
  {
    id: "pol-6",
    title: "Document & Template Standards",
    category: "Templates",
    description: "Formatting guidelines for official documents, presentations, and business correspondence.",
    version: "v4.0",
    updated: "Apr 15, 2026",
    fileSize: "3.4 MB",
    downloads: 1670,
    effective: "Apr 15, 2026",
  },
]

// ─── Knowledge Centre Articles ─────────────────────────────────────────────────

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "ka-1",
    title: "How to request brand assets: A step-by-step guide",
    excerpt: "Everything you need to know about finding, downloading, and requesting custom brand assets through the hub.",
    category: "How-to Guide",
    department: "All Departments",
    author: "Corporate Communications",
    date: "Jul 8, 2026",
    readTime: "3 min read",
    views: 2840,
    tags: ["Brand", "Assets", "Getting Started"],
  },
  {
    id: "ka-2",
    title: "Content approval: what you need to know before you publish",
    excerpt: "A clear explanation of our two-stage approval process and what to expect at each step.",
    category: "Process",
    department: "Marketing",
    author: "Corporate Communications",
    date: "Jul 5, 2026",
    readTime: "5 min read",
    views: 1920,
    tags: ["Approval", "Process", "Content"],
  },
  {
    id: "ka-3",
    title: "Social media best practices for employees",
    excerpt: "How to represent the brand professionally on LinkedIn, X, and other platforms.",
    category: "Best Practice",
    department: "All Departments",
    author: "Digital Marketing",
    date: "Jun 28, 2026",
    readTime: "4 min read",
    views: 3140,
    tags: ["Social Media", "Brand", "Guidelines"],
  },
  {
    id: "ka-4",
    title: "Planning an internal event: A communications toolkit",
    excerpt: "Templates, checklists, and guidance for running smooth internal events and town halls.",
    category: "How-to Guide",
    department: "HR & Communications",
    author: "Events Team",
    date: "Jun 20, 2026",
    readTime: "7 min read",
    views: 1480,
    tags: ["Events", "Planning", "Templates"],
  },
  {
    id: "ka-5",
    title: "Frequently asked questions: Brand Centre",
    excerpt: "Answers to the most common questions about using the Brand Centre, downloading files, and getting support.",
    category: "FAQ",
    department: "All Departments",
    author: "Corporate Communications",
    date: "Jun 15, 2026",
    readTime: "6 min read",
    views: 2260,
    tags: ["Brand Centre", "FAQ", "Help"],
  },
  {
    id: "ka-6",
    title: "Writing for internal communications: tone and style guide",
    excerpt: "How to write clear, engaging, and on-brand internal messages, emails, and announcements.",
    category: "Best Practice",
    department: "Communications",
    author: "Editorial Team",
    date: "Jun 10, 2026",
    readTime: "8 min read",
    views: 1730,
    tags: ["Writing", "Style", "Communications"],
  },
]

// ─── Resources ────────────────────────────────────────────────────────────────

export const resources: Resource[] = [
  {
    id: "res-1",
    title: "Master Brand Guidelines 2026",
    description: "Complete visual identity system, logo usage, spacing, and application rules.",
    category: "Brand Centre",
    business: "Group",
    fileType: "PDF",
    size: "18.2 MB",
    year: 2026,
    tags: ["Brand", "Guidelines", "Logo"],
    downloads: 3241,
    updated: "Jul 9, 2026",
    featured: true,
    image: "/brand-guidelines.png",
  },
  {
    id: "res-2",
    title: "Corporate PowerPoint Template",
    description: "On-brand presentation template with master slides, charts, and layouts.",
    category: "Brand Centre",
    business: "Group",
    fileType: "PPT",
    size: "6.8 MB",
    year: 2026,
    tags: ["Template", "Presentation"],
    downloads: 5120,
    updated: "Jun 28, 2026",
    featured: true,
  },
  {
    id: "res-3",
    title: "Logo Pack — Primary & Secondary",
    description: "Full logo suite in SVG, PNG, and EPS across light and dark variants.",
    category: "Brand Centre",
    business: "Group",
    fileType: "ZIP",
    size: "42.1 MB",
    year: 2026,
    tags: ["Logo", "Assets"],
    downloads: 4310,
    updated: "Jul 9, 2026",
  },
  {
    id: "res-4",
    title: "Email Signature Generator Guide",
    description: "Step-by-step guide and HTML templates for a consistent email signature.",
    category: "Brand Centre",
    business: "Group",
    fileType: "DOC",
    size: "1.2 MB",
    year: 2026,
    tags: ["Email", "Template"],
    downloads: 1890,
    updated: "Jun 15, 2026",
  },
  {
    id: "res-5",
    title: "Sustainability Campaign Toolkit",
    description: "Social posts, banners, key messages, and copy for the 2026 campaign.",
    category: "Campaigns",
    business: "Group",
    fileType: "ZIP",
    size: "88.4 MB",
    year: 2026,
    tags: ["Campaign", "Social", "Toolkit"],
    downloads: 2760,
    updated: "Jul 10, 2026",
    featured: true,
  },
  {
    id: "res-6",
    title: "Product Launch Brochure — Consumer",
    description: "Print-ready brochure for the latest consumer product line.",
    category: "Marketing Assets",
    business: "Consumer",
    fileType: "PDF",
    size: "12.5 MB",
    year: 2026,
    tags: ["Brochure", "Product"],
    downloads: 980,
    updated: "Jun 30, 2026",
  },
  {
    id: "res-7",
    title: "Case Study — Industrial Automation",
    description: "Customer success story showcasing measurable business impact.",
    category: "Marketing Assets",
    business: "Industrial",
    fileType: "PDF",
    size: "4.3 MB",
    year: 2025,
    tags: ["Case Study", "Success Story"],
    downloads: 640,
    updated: "May 22, 2026",
  },
  {
    id: "res-8",
    title: "Q2 Employee Newsletter",
    description: "The quarterly digest of stories, milestones, and people updates.",
    category: "Communications",
    business: "Group",
    fileType: "PDF",
    size: "8.9 MB",
    year: 2026,
    tags: ["Newsletter", "Internal"],
    downloads: 3120,
    updated: "Jul 2, 2026",
  },
  {
    id: "res-9",
    title: "Town Hall Deck — H2 Kickoff",
    description: "Leadership presentation from the half-year kickoff town hall.",
    category: "Events",
    business: "Group",
    fileType: "PPT",
    size: "15.6 MB",
    year: 2026,
    tags: ["Town Hall", "Presentation"],
    downloads: 1450,
    updated: "Jul 5, 2026",
  },
  {
    id: "res-10",
    title: "Brand Usage Policy",
    description: "Rules governing internal and external use of the corporate brand.",
    category: "Policies",
    business: "Group",
    fileType: "PDF",
    size: "2.1 MB",
    year: 2026,
    tags: ["Policy", "Brand", "Approval"],
    downloads: 1210,
    updated: "Jul 1, 2026",
  },
  {
    id: "res-11",
    title: "Social Media Guidelines",
    description: "Best practices and approval process for employee social activity.",
    category: "Policies",
    business: "Group",
    fileType: "PDF",
    size: "1.8 MB",
    year: 2026,
    tags: ["Policy", "Social", "Guidelines"],
    downloads: 2040,
    updated: "Jul 1, 2026",
  },
  {
    id: "res-12",
    title: "Event Branding Guidelines",
    description: "Standards for booths, banners, and signage at company events.",
    category: "Policies",
    business: "Group",
    fileType: "PDF",
    size: "5.4 MB",
    year: 2026,
    tags: ["Policy", "Event", "Branding"],
    downloads: 720,
    updated: "Jun 18, 2026",
  },
  {
    id: "res-13",
    title: "Financial Services Product Sheet",
    description: "Datasheet covering features, benefits, and compliance notes.",
    category: "Marketing Assets",
    business: "Financial Services",
    fileType: "PDF",
    size: "3.2 MB",
    year: 2026,
    tags: ["Product", "Datasheet"],
    downloads: 510,
    updated: "Jun 12, 2026",
  },
  {
    id: "res-14",
    title: "Healthcare Brand Photography Pack",
    description: "Curated, approved imagery for healthcare communications.",
    category: "Brand Centre",
    business: "Healthcare",
    fileType: "ZIP",
    size: "220 MB",
    year: 2026,
    tags: ["Photography", "Assets"],
    downloads: 430,
    updated: "May 30, 2026",
  },
  {
    id: "res-15",
    title: "Technology Division Overview Deck",
    description: "Corporate overview presentation for the technology business.",
    category: "Marketing Assets",
    business: "Technology",
    fileType: "PPT",
    size: "22.4 MB",
    year: 2026,
    tags: ["Presentation", "Overview"],
    downloads: 870,
    updated: "Jun 25, 2026",
  },
  {
    id: "res-16",
    title: "Group Annual Catalogue 2026",
    description: "Complete product and services catalogue across all group business units.",
    category: "Marketing Assets",
    business: "Group",
    fileType: "PDF",
    size: "34.6 MB",
    year: 2026,
    tags: ["Catalogue", "Products"],
    downloads: 1340,
    updated: "Jun 1, 2026",
    featured: true,
  },
  {
    id: "res-17",
    title: "Healthcare Success Story — Digital Patient Care",
    description: "Case study on improved patient outcomes through our digital health platform.",
    category: "Marketing Assets",
    business: "Healthcare",
    fileType: "PDF",
    size: "6.1 MB",
    year: 2026,
    tags: ["Case Study", "Healthcare"],
    downloads: 490,
    updated: "Jun 5, 2026",
  },
  {
    id: "res-18",
    title: "Internal Mailer Template Pack",
    description: "HTML and DOCX templates for internal department announcements.",
    category: "Communications",
    business: "Group",
    fileType: "ZIP",
    size: "4.2 MB",
    year: 2026,
    tags: ["Email", "Template", "Internal"],
    downloads: 1760,
    updated: "May 20, 2026",
  },
]

// ─── Derived data ─────────────────────────────────────────────────────────────

export const trendingResources = resources
  .slice()
  .sort((a, b) => b.downloads - a.downloads)
  .slice(0, 5)

export const recentlyAdded = resources
  .slice()
  .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
  .slice(0, 4)

export const quickDownloads = resources.filter((r) => r.featured)

// ─── Filter options ───────────────────────────────────────────────────────────

export const categories: Category[] = [
  "Announcements",
  "Campaigns",
  "Brand Centre",
  "Marketing Assets",
  "Communications",
  "Events",
  "Policies",
  "Knowledge Centre",
]

export const businessUnits: BusinessUnit[] = [
  "Group",
  "Technology",
  "Consumer",
  "Industrial",
  "Financial Services",
  "Healthcare",
]

export const fileTypes: FileType[] = ["PDF", "PPT", "DOC", "XLS", "Image", "Video", "ZIP"]

export type BrandColor = {
  id: string
  name: string
  hex: string
  category: "Primary" | "Secondary" | "Functional"
  shades?: string[]
  bgClass?: string
}

export type BrandTypography = {
  id: string
  mediaType: string
  westernFont: string
  asianFont: string
  notes?: string
}

export const defaultBrandColors: BrandColor[] = [
  // Primary colors (basic colors)
  { id: "col-1", name: "Red", hex: "#E60012", category: "Primary", bgClass: "bg-[#E60012]" },
  { id: "col-2", name: "Black", hex: "#000000", category: "Primary", bgClass: "bg-black" },
  { id: "col-3", name: "White", hex: "#FFFFFF", category: "Primary", bgClass: "bg-white border border-gray-300" },
  // Secondary colors (supporting colors)
  {
    id: "col-4",
    name: "Blue",
    hex: "#0066FF",
    category: "Secondary",
    shades: ["#D4E5FF", "#99C2FF", "#0066FF", "#0040B3", "#001A66"],
    bgClass: "bg-[#0066FF]",
  },
  {
    id: "col-5",
    name: "Purple",
    hex: "#9933FF",
    category: "Secondary",
    shades: ["#F0E0FF", "#D1A3FF", "#9933FF", "#6600CC", "#330066"],
    bgClass: "bg-[#9933FF]",
  },
  {
    id: "col-6",
    name: "Green",
    hex: "#00CC66",
    category: "Secondary",
    shades: ["#D6F5E3", "#8CE6B4", "#00CC66", "#008040", "#004D26"],
    bgClass: "bg-[#00CC66]",
  },
  {
    id: "col-7",
    name: "Yellow",
    hex: "#FFCC00",
    category: "Secondary",
    shades: ["#FFF9D6", "#FFE885", "#FFCC00", "#CC9900", "#664C00"],
    bgClass: "bg-[#FFCC00]",
  },
  // Functional colors
  {
    id: "col-8",
    name: "Ash",
    hex: "#616161",
    category: "Functional",
    shades: ["#E0E0E0", "#9E9E9E", "#616161", "#212121"],
    bgClass: "bg-[#616161]",
  },
  {
    id: "col-9",
    name: "Teal",
    hex: "#00ACC1",
    category: "Functional",
    shades: ["#E0F7FA", "#4DD0E1", "#00ACC1", "#006064"],
    bgClass: "bg-[#00ACC1]",
  },
  {
    id: "col-10",
    name: "Magenta",
    hex: "#D81B60",
    category: "Functional",
    shades: ["#FCE4EC", "#F06292", "#D81B60", "#880E4F"],
    bgClass: "bg-[#D81B60]",
  },
  {
    id: "col-11",
    name: "Orange",
    hex: "#F57C00",
    category: "Functional",
    shades: ["#FFE0B2", "#FF9800", "#F57C00", "#E65100"],
    bgClass: "bg-[#F57C00]",
  },
]

export const defaultBrandTypography: BrandTypography[] = [
  { id: "typ-1", mediaType: "Videos / general advertising / printed materials / reports", westernFont: "Helvetica Neue *1", asianFont: "Noto Sans", notes: "Helvetica Neue LT Pro may also be used. Please note that Helvetica Neue LT Pro does not include a Regular weight. When Regular is required, use Roman instead." },
  { id: "typ-2", mediaType: "Websites", westernFont: "Roboto", asianFont: "Noto Sans", notes: "Standard web typography." },
  { id: "typ-3", mediaType: "PC documents (Office 365)", westernFont: "Arial", asianFont: "BIZ UDPGothic *2", notes: "For Japanese only. For all other languages, select the most appropriate font." },
]

export type FontSpecimen = {
  id: string
  fontName: string
  subtitle: string
  sampleHeading: string
  sampleBody: string
  sampleMeta?: string
  headingWeight: string
  bodyWeight: string
  uiWeight?: string
  guidelines: string
  note?: string
}

export const defaultFontSpecimens: FontSpecimen[] = [
  {
    id: "spec-1",
    fontName: "Helvetica Neue",
    subtitle: "Primary Latin typography",
    sampleHeading: "Future-changing innovations",
    sampleBody: '"Changes for the Better" represents the Mitsubishi Electric Group\'s attitude to "always strive to achieve something better," as we continue to change and grow.',
    sampleMeta: "MA-E100R-E Manual",
    headingWeight: "Medium",
    bodyWeight: "Regular*",
    guidelines: "Use Medium for headings and Regular for body text to maintain a refined typography style. Use Bold for product names and other emphasized characters in titles.",
    note: "*Helvetica Neue LT Pro may also be used. Please note that Helvetica Neue LT Pro does not include a Regular weight. When Regular is required, use Roman instead.",
  },
  {
    id: "spec-2",
    fontName: "Roboto",
    subtitle: "Alternative / UI typography",
    sampleHeading: "Future-changing innovations",
    sampleBody: "We, the Mitsubishi Electric Group, will contribute to the realization of a vibrant and sustainable society through continuous technological innovation and ceaseless creativity.",
    sampleMeta: "See More · Let's start",
    headingWeight: "Medium",
    bodyWeight: "Regular",
    uiWeight: "Regular",
    guidelines: "Use Medium for headings and Regular for body text. Use Bold for product names and other emphasized characters in titles.",
  },
]

export type ContactTeamMember = {
  id: string
  initials: string
  name: string
  role: string
  email: string
  region: string
}

export type ContactChannel = {
  id: string
  label: string
  value: string
  icon: "Mail" | "Phone" | "Globe" | "MapPin"
}

export const defaultContactTeamMembers: ContactTeamMember[] = [
  { id: "ct-1", initials: "SM", name: "Sarah Mitchell", role: "Head of Corporate Communications", email: "sarah.mitchell@nexusgroup.example", region: "Group" },
  { id: "ct-2", initials: "JA", name: "James Adeyemi", role: "Senior Brand Manager", email: "james.adeyemi@nexusgroup.example", region: "Group" },
  { id: "ct-3", initials: "PR", name: "Priya Rajan", role: "Internal Communications Manager", email: "priya.rajan@nexusgroup.example", region: "Asia Pacific" },
  { id: "ct-4", initials: "TM", name: "Tobias Müller", role: "Marketing Content Lead", email: "tobias.muller@nexusgroup.example", region: "Europe" },
  { id: "ct-5", initials: "FA", name: "Fatima Al-Hassan", role: "Events & Comms Coordinator", email: "fatima.alhassan@nexusgroup.example", region: "Middle East & Africa" },
]

export const defaultContactChannels: ContactChannel[] = [
  { id: "cc-1", label: "General enquiries", value: "example@gmail.com", icon: "Mail" },
  { id: "cc-2", label: "Group comms hotline", value: "+91 95 9900 4245, +91-95 9900 4647", icon: "Phone" },
  { id: "cc-3", label: "Intranet portal", value: "intranet.mitsubishi.example", icon: "Globe" },
]

export type FaqCategory = "Knowledge Centre" | "Marketing Campaigns" | "General"

export type FaqItem = {
  id: string
  question: string
  answer: string
  category: FaqCategory
}

export const defaultFaqItems: FaqItem[] = [
  {
    id: "faq-1",
    category: "Knowledge Centre",
    question: "How do I request brand asset approvals?",
    answer: "Submit your asset through the Brand Centre portal or contact the Brand Communications team directly with your draft designs.",
  },
  {
    id: "faq-2",
    category: "Knowledge Centre",
    question: "Where can I find official presentation templates?",
    answer: "Official PowerPoint and Keynote templates are available for direct download in the Brand Centre and Asset Management sections.",
  },
  {
    id: "faq-3",
    category: "Marketing Campaigns",
    question: "Who can use these campaign assets?",
    answer: "All official marketing campaign assets, imagery, and promotional kits are available for internal staff and authorized regional partners.",
  },
  {
    id: "faq-4",
    category: "Marketing Campaigns",
    question: "How often are marketing campaign toolkits updated?",
    answer: "Campaign toolkits are updated whenever new promotional materials, videos, or local language assets are published by the Marketing team.",
  },
  {
    id: "faq-5",
    category: "General",
    question: "Who should I contact for general platform support?",
    answer: "Reach out via the Contact Us page or email the central Communications team at example@gmail.com.",
  },
]

export type UserRole = "Super Admin" | "Content Manager" | "Editor" | "Viewer"

export type CmsUser = {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  status: "Active" | "Inactive"
  lastLogin?: string
}

export type RolePermission = {
  role: UserRole
  description: string
  permissions: {
    manageUsers: boolean
    manageSettings: boolean
    publishContent: boolean
    editContent: boolean
    deleteContent: boolean
    viewAnalytics: boolean
  }
}

export const defaultCmsUsers: CmsUser[] = [
  { id: "u-1", name: "Admin User", email: "admin@nexusgroup.example", role: "Super Admin", department: "Corporate IT & Comms", status: "Active", lastLogin: "Just now" },
  { id: "u-2", name: "Sarah Mitchell", email: "sarah.mitchell@nexusgroup.example", role: "Content Manager", department: "Corporate Communications", status: "Active", lastLogin: "2 hours ago" },
  { id: "u-3", name: "James Adeyemi", email: "james.adeyemi@nexusgroup.example", role: "Editor", department: "Brand Marketing", status: "Active", lastLogin: "Yesterday" },
  { id: "u-4", name: "Priya Rajan", email: "priya.rajan@nexusgroup.example", role: "Editor", department: "Asia Pacific Regional", status: "Active", lastLogin: "3 days ago" },
  { id: "u-5", name: "Reviewer Team", email: "viewer@nexusgroup.example", role: "Viewer", department: "Audit & Compliance", status: "Active", lastLogin: "1 week ago" },
]

export const defaultRolePermissions: RolePermission[] = [
  {
    role: "Super Admin",
    description: "Full system control including user management, role permissions, settings, and content publishing.",
    permissions: { manageUsers: true, manageSettings: true, publishContent: true, editContent: true, deleteContent: true, viewAnalytics: true },
  },
  {
    role: "Content Manager",
    description: "Can create, edit, publish, and delete all marketing assets, events, knowledge articles, and FAQs.",
    permissions: { manageUsers: false, manageSettings: false, publishContent: true, editContent: true, deleteContent: true, viewAnalytics: true },
  },
  {
    role: "Editor",
    description: "Can create and edit draft content, events, and assets. Publishing requires manager approval.",
    permissions: { manageUsers: false, manageSettings: false, publishContent: false, editContent: true, deleteContent: false, viewAnalytics: true },
  },
  {
    role: "Viewer",
    description: "Read-only access to view internal brand assets, guidelines, newsletters, and analytics.",
    permissions: { manageUsers: false, manageSettings: false, publishContent: false, editContent: false, deleteContent: false, viewAnalytics: true },
  },
]

