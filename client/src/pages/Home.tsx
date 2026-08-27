/*
 * Design: Editorial Research Dashboard — Data-journalism report style
 * Color: #00aa91 teal-green as sole signature accent
 * Typography: Space Grotesk (bold condensed display headings), Inter (body), JetBrains Mono (metrics/data)
 * Layout: Report masthead → KPI summary → Filter bar → Platform-separated analytical chapters
 * Each card: rank + platform badge + engagement pills + teal "why it worked" insight at first glance
 */

import { useState, useMemo } from "react";
import { posts, type Post } from "@/data/posts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  TrendingUp,
  ExternalLink,
  Hash,
  Calendar,
  Lightbulb,
  BarChart3,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Play,
  Image,
  FileText,
  Layers,
  Video,
  ArrowUpRight,
  Zap,
} from "lucide-react";

/* ─── Platform SVG Icons ─── */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ─── Types ─── */
type PlatformFilter = "all" | "Facebook" | "Instagram" | "YouTube" | "LinkedIn" | "X";
type ContentTypeFilter = "all" | "Reel" | "Carousel" | "Static Image" | "Text Post" | "Video" | "YouTube Short" | "Link/Media Post" | "Thread";
type RankBy = "default" | "engagement" | "date-newest" | "date-oldest";

const MONTHS = [
  "All Months", "January 2026", "February 2026", "March 2026",
  "April 2026", "May 2026", "June 2026", "July 2026", "August 2026",
];

const PLATFORMS: { value: PlatformFilter; label: string; color: string }[] = [
  { value: "all", label: "All Platforms", color: "#00aa91" },
  { value: "Instagram", label: "Instagram", color: "#E1306C" },
  { value: "Facebook", label: "Facebook", color: "#1877f2" },
  { value: "YouTube", label: "YouTube", color: "#ff0000" },
  { value: "LinkedIn", label: "LinkedIn", color: "#0a66c2" },
  { value: "X", label: "X (Twitter)", color: "#000000" },
];

const CONTENT_TYPES: { value: ContentTypeFilter; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "Reel", label: "Reel" },
  { value: "Carousel", label: "Carousel" },
  { value: "Static Image", label: "Static Image" },
  { value: "Text Post", label: "Text Post" },
  { value: "Video", label: "Video" },
  { value: "YouTube Short", label: "YouTube Short" },
  { value: "Link/Media Post", label: "Link/Media Post" },
  { value: "Thread", label: "Thread" },
];

const RANK_OPTIONS: { value: RankBy; label: string }[] = [
  { value: "default", label: "Best Performing" },
  { value: "engagement", label: "Highest Engagement" },
  { value: "date-newest", label: "Newest First" },
  { value: "date-oldest", label: "Oldest First" },
];

const PLATFORM_ORDER: PlatformFilter[] = ["Instagram", "Facebook", "YouTube", "LinkedIn", "X"];

/* ─── Utilities ─── */
function parseEngagementScore(engagement: string): number {
  const str = engagement.toLowerCase();
  let score = 0;
  const matches = str.match(/([\d,.]+)\s*([km])?\s*(views?|likes?|comments?|shares?|retweets?|replies?|impressions?)/gi);
  if (matches) {
    for (const m of matches) {
      const numMatch = m.match(/([\d,.]+)\s*([km])?/i);
      if (numMatch) {
        let num = parseFloat(numMatch[1].replace(/,/g, ''));
        const suffix = numMatch[2]?.toLowerCase();
        if (suffix === 'k') num *= 1000;
        if (suffix === 'm') num *= 1000000;
        if (/views?/i.test(m)) score += num * 0.1;
        else if (/likes?/i.test(m)) score += num * 1;
        else if (/comments?|replies?/i.test(m)) score += num * 2;
        else if (/shares?|retweets?/i.test(m)) score += num * 3;
        else score += num;
      }
    }
  }
  if (score === 0 && (str.includes('high') || str.includes('viral'))) score = 50;
  return score;
}

function parseDateForSort(dateStr: string): number {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function getPlatformIcon(platform: string, className?: string) {
  switch (platform) {
    case "Instagram": return <InstagramIcon className={className || "w-4 h-4"} />;
    case "Facebook": return <FacebookIcon className={className || "w-4 h-4"} />;
    case "YouTube": return <YouTubeIcon className={className || "w-4 h-4"} />;
    case "LinkedIn": return <LinkedInIcon className={className || "w-4 h-4"} />;
    case "X": return <XIcon className={className || "w-4 h-4"} />;
    default: return null;
  }
}

function getPlatformColor(platform: string) {
  switch (platform) {
    case "Instagram": return "#E1306C";
    case "Facebook": return "#1877f2";
    case "YouTube": return "#ff0000";
    case "LinkedIn": return "#0a66c2";
    case "X": return "#000000";
    default: return "#00aa91";
  }
}

function getPlatformBadgeClasses(platform: string) {
  switch (platform) {
    case "Instagram": return "bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white";
    case "Facebook": return "bg-[#1877f2] text-white";
    case "YouTube": return "bg-[#ff0000] text-white";
    case "LinkedIn": return "bg-[#0a66c2] text-white";
    case "X": return "bg-[#000000] text-white";
    default: return "bg-muted text-foreground";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "Reel": return <Play className="w-3 h-3" />;
    case "Carousel": return <Layers className="w-3 h-3" />;
    case "Static Image": return <Image className="w-3 h-3" />;
    case "Text Post": return <FileText className="w-3 h-3" />;
    case "Video": return <Video className="w-3 h-3" />;
    case "YouTube Short": return <Play className="w-3 h-3" />;
    case "Link/Media Post": return <ExternalLink className="w-3 h-3" />;
    case "Thread": return <FileText className="w-3 h-3" />;
    default: return <FileText className="w-3 h-3" />;
  }
}

function extractMetricPills(engagement: string): { label: string; value: string }[] {
  const pills: { label: string; value: string }[] = [];
  const str = engagement;
  const patterns = [
    { regex: /([\d,.]+[KkMm]?)\s*views?/i, label: "Views" },
    { regex: /([\d,.]+[KkMm]?)\s*likes?/i, label: "Likes" },
    { regex: /([\d,.]+[KkMm]?)\s*comments?/i, label: "Comments" },
    { regex: /([\d,.]+[KkMm]?)\s*shares?/i, label: "Shares" },
    { regex: /([\d,.]+[KkMm]?)\s*retweets?/i, label: "Retweets" },
    { regex: /([\d,.]+[KkMm]?)\s*replies?/i, label: "Replies" },
    { regex: /([\d,.]+[KkMm]?)\s*impressions?/i, label: "Impressions" },
  ];
  for (const p of patterns) {
    const match = str.match(p.regex);
    if (match) pills.push({ label: p.label, value: match[1] });
  }
  if (pills.length === 0 && str.length > 0) {
    pills.push({ label: "Engagement", value: str.length > 50 ? str.slice(0, 50) + "..." : str });
  }
  return pills;
}

/* ─── Main Component ─── */
export default function Home() {
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>("all");
  const [rankBy, setRankBy] = useState<RankBy>("default");

  const filteredAndSorted = useMemo(() => {
    let result = [...posts];
    if (monthFilter !== "All Months") result = result.filter(p => p.month === monthFilter);
    if (platformFilter !== "all") result = result.filter(p => p.platform === platformFilter);
    if (contentTypeFilter !== "all") result = result.filter(p => p.type === contentTypeFilter);

    switch (rankBy) {
      case "default":
      case "engagement":
        result.sort((a, b) => parseEngagementScore(b.engagement) - parseEngagementScore(a.engagement));
        break;
      case "date-newest":
        result.sort((a, b) => parseDateForSort(b.datePosted) - parseDateForSort(a.datePosted));
        break;
      case "date-oldest":
        result.sort((a, b) => parseDateForSort(a.datePosted) - parseDateForSort(b.datePosted));
        break;
    }
    return result;
  }, [monthFilter, platformFilter, contentTypeFilter, rankBy]);

  // Group by platform for section view
  const groupedByPlatform = useMemo(() => {
    if (platformFilter !== "all") return null; // Don't group when a specific platform is selected
    const groups: Record<string, Post[]> = {};
    for (const p of filteredAndSorted) {
      if (!groups[p.platform]) groups[p.platform] = [];
      groups[p.platform].push(p);
    }
    return groups;
  }, [filteredAndSorted, platformFilter]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of posts) {
      counts[p.platform] = (counts[p.platform] || 0) + 1;
    }
    return counts;
  }, []);

  // Top engagement score for KPI
  const topEngagement = useMemo(() => {
    let max = 0;
    let topPost: Post | null = null;
    for (const p of posts) {
      const score = parseEngagementScore(p.engagement);
      if (score > max) { max = score; topPost = p; }
    }
    return topPost;
  }, []);

  // Unique accounts
  const uniqueAccounts = useMemo(() => {
    const handles = new Set(posts.map(p => p.pageHandle));
    return handles.size;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Report Masthead ─── */}
      <header className="relative overflow-hidden">
        {/* Teal accent bar at very top */}
        <div className="h-1.5 bg-[#00aa91]" />

        <div className="border-b border-border">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #00aa91 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="container relative py-12 md:py-16">
            {/* Report label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-[#00aa91] flex items-center justify-center shadow-md shadow-[#00aa91]/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#00aa91] uppercase tracking-[0.2em] font-bold">
                  Research Intelligence Report
                </div>
                <div className="text-[11px] font-mono text-muted-foreground tracking-wider">
                  January — August 2026 | Weekly Auto-Refresh
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-foreground mb-4 max-w-4xl leading-[1.05]">
              Top Organic{" "}
              <span className="text-[#00aa91] relative">
                Tax Strategy
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#00aa91]/20 rounded-full" />
              </span>{" "}
              <br className="hidden md:block" />
              Social Media Posts
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-10">
              A curated intelligence report analyzing the highest-engagement organic posts from U.S.-based tax strategy accounts across five major platforms. Ranked by engagement, reach, and educational value.
            </p>

            {/* KPI Summary Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPITile
                label="Total Posts Analyzed"
                value={posts.length.toString()}
                accent
              />
              <KPITile
                label="Platforms Covered"
                value="5"
                sub="IG · FB · YT · LI · X"
              />
              <KPITile
                label="Unique Accounts"
                value={uniqueAccounts.toString()}
              />
              <KPITile
                label="Top Post Engagement"
                value={topEngagement ? extractMetricPills(topEngagement.engagement)[0]?.value || "—" : "—"}
                sub={topEngagement ? topEngagement.pageName : ""}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Filter Bar ─── */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b-2 border-[#00aa91]/15">
        <div className="container py-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-[#00aa91]" />
            <span className="text-[10px] font-mono font-bold text-[#00aa91] uppercase tracking-[0.15em]">
              Filter & Sort
            </span>
            <div className="flex-1" />
            <span className="text-xs font-mono text-muted-foreground">
              <span className="font-bold text-foreground">{filteredAndSorted.length}</span> of {posts.length} posts
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger size="sm" className="min-w-[150px]">
                <Calendar className="w-3.5 h-3.5 text-[#00aa91]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v as PlatformFilter)}>
              <SelectTrigger size="sm" className="min-w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={contentTypeFilter} onValueChange={(v) => setContentTypeFilter(v as ContentTypeFilter)}>
              <SelectTrigger size="sm" className="min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={rankBy} onValueChange={(v) => setRankBy(v as RankBy)}>
              <SelectTrigger size="sm" className="min-w-[160px]">
                <TrendingUp className="w-3.5 h-3.5 text-[#00aa91]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RANK_OPTIONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(monthFilter !== "All Months" || platformFilter !== "all" || contentTypeFilter !== "all" || rankBy !== "default") && (
              <button
                onClick={() => {
                  setMonthFilter("All Months");
                  setPlatformFilter("all");
                  setContentTypeFilter("all");
                  setRankBy("default");
                }}
                className="text-xs px-3 py-1.5 rounded-md border border-[#00aa91]/30 text-[#00aa91] hover:bg-[#00aa91]/5 font-medium transition-colors"
              >
                Reset All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="container py-8">
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#00aa91]/10 mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-7 h-7 text-[#00aa91]/40" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No posts match your filters</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filter criteria to see results.</p>
          </div>
        ) : groupedByPlatform ? (
          /* ─── Platform-Separated Sections ─── */
          <div className="space-y-12">
            {PLATFORM_ORDER.map(platform => {
              const platformPosts = groupedByPlatform[platform];
              if (!platformPosts || platformPosts.length === 0) return null;
              return (
                <PlatformSection
                  key={platform}
                  platform={platform}
                  posts={platformPosts}
                  count={platformCounts[platform] || 0}
                />
              );
            })}
          </div>
        ) : (
          /* ─── Single Platform View ─── */
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: getPlatformColor(platformFilter) }}
              >
                {getPlatformIcon(platformFilter, "w-5 h-5")}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">{platformFilter}</h2>
                <p className="text-xs font-mono text-muted-foreground">{filteredAndSorted.length} posts</p>
              </div>
            </div>
            <Accordion type="multiple" className="space-y-2.5">
              {filteredAndSorted.map((post, index) => (
                <PostCard key={post.id} post={post} rank={index + 1} />
              ))}
            </Accordion>
          </div>
        )}

        {/* ─── Methodology ─── */}
        <div className="mt-16 rounded-xl border-2 border-[#00aa91]/15 bg-[#00aa91]/[0.03] p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#00aa91]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#00aa91]">
              Research Methodology
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Posts were identified through systematic research of U.S.-based tax strategy accounts across Facebook, Instagram, YouTube, LinkedIn, and X, focusing on organic public posts from January through August 2026. Selection criteria include engagement rates (likes, comments, shares, views), content reach, educational value, and marketing effectiveness. Engagement metrics reflect publicly available data at the time of research. LinkedIn engagement data may be limited due to platform restrictions. This dashboard refreshes weekly to include new high-performing content.
          </p>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border">
        <div className="h-1 bg-gradient-to-r from-[#00aa91]/30 via-[#00aa91] to-[#00aa91]/30" />
        <div className="container py-6 text-center">
          <p className="text-xs font-mono text-muted-foreground">
            Research compiled August 2026 · Auto-refreshes weekly · All links redirect to original content
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── KPI Tile ─── */
function KPITile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-[#00aa91]/30 bg-[#00aa91]/[0.04]' : 'border-border bg-card'}`}>
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl md:text-3xl font-extrabold font-mono tracking-tight ${accent ? 'text-[#00aa91]' : 'text-foreground'}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

/* ─── Platform Section ─── */
function PlatformSection({ platform, posts: platformPosts, count }: { platform: string; posts: Post[]; count: number }) {
  const color = getPlatformColor(platform);

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: color, boxShadow: `0 4px 14px ${color}30` }}
        >
          {getPlatformIcon(platform, "w-5 h-5")}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{platform}</h2>
          <p className="text-xs font-mono text-muted-foreground">
            {platformPosts.length} posts shown · {count} total in database
          </p>
        </div>
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          <Zap className="w-3 h-3" />
          {platformPosts.length} Results
        </div>
      </div>

      {/* Teal divider line */}
      <div className="h-px mb-4" style={{ background: `linear-gradient(to right, ${color}40, ${color}10, transparent)` }} />

      {/* Posts */}
      <Accordion type="multiple" className="space-y-2.5">
        {platformPosts.map((post, index) => (
          <PostCard key={post.id} post={post} rank={index + 1} />
        ))}
      </Accordion>
    </section>
  );
}

/* ─── Post Card ─── */
function PostCard({ post, rank }: { post: Post; rank: number }) {
  const platformBadge = getPlatformBadgeClasses(post.platform);
  const metricPills = extractMetricPills(post.engagement);
  const platformColor = getPlatformColor(post.platform);

  return (
    <AccordionItem
      value={`post-${post.id}`}
      className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-[#00aa91]/30 hover:shadow-md data-[state=open]:border-[#00aa91]/40 data-[state=open]:shadow-lg"
    >
      <AccordionTrigger className="px-5 py-4 hover:no-underline gap-3">
        <div className="flex items-start gap-4 w-full text-left">
          {/* Rank badge */}
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-extrabold text-white shadow-sm"
            style={{ backgroundColor: rank <= 3 ? '#00aa91' : rank <= 10 ? '#00aa91cc' : '#00aa91aa' }}
          >
            #{rank}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            {/* Row 1: Name + Handle */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-bold text-foreground text-[15px] leading-tight">{post.pageName}</span>
              <span className="text-xs text-muted-foreground font-mono">{post.pageHandle}</span>
            </div>

            {/* Row 2: Platform + Type + Date */}
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${platformBadge}`}>
                {getPlatformIcon(post.platform, "w-3 h-3")}
                {post.platform}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-accent text-accent-foreground font-medium border border-border">
                {getTypeIcon(post.type)}
                {post.type}
              </span>
              <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.datePosted}
              </span>
            </div>

            {/* Row 3: Hook */}
            <div className="mb-2.5">
              <span className="text-[10px] font-mono font-bold text-[#00aa91] uppercase tracking-[0.15em] mr-2">Hook:</span>
              <span className="text-sm text-foreground/90 leading-snug font-medium">"{post.hook}"</span>
            </div>

            {/* Row 4: Metric pills + Why it worked preview — visible at first glance */}
            <div className="flex items-center gap-2 flex-wrap">
              {metricPills.slice(0, 3).map((pill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#00aa91]/10 text-[#005c50] border border-[#00aa91]/15"
                >
                  {pill.label === "Views" && <Eye className="w-2.5 h-2.5" />}
                  {pill.label === "Likes" && <Heart className="w-2.5 h-2.5" />}
                  {pill.label === "Comments" && <MessageCircle className="w-2.5 h-2.5" />}
                  {pill.value} {pill.label}
                </span>
              ))}
              {/* Truncated "why" preview */}
              <span className="text-[10px] text-[#00aa91] font-medium italic hidden md:inline truncate max-w-[280px]">
                {post.whyItWorked.length > 60 ? post.whyItWorked.slice(0, 60) + "..." : post.whyItWorked}
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-5">
        <div className="space-y-4 pt-2" style={{ marginLeft: "3.5rem" }}>
          {/* Caption */}
          <div>
            <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Caption</div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{post.caption}</p>
          </div>

          {/* Hashtags */}
          {post.hashtags && post.hashtags !== "None" && (
            <div>
              <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Hashtags</div>
              <div className="flex items-start gap-1.5 flex-wrap">
                <Hash className="w-3.5 h-3.5 text-[#00aa91] mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground font-mono">{post.hashtags}</p>
              </div>
            </div>
          )}

          {/* Full Engagement Metrics */}
          <div>
            <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Performance Metrics</div>
            <div className="flex flex-wrap gap-2">
              {metricPills.map((pill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#00aa91]/10 text-[#005c50] border border-[#00aa91]/15"
                >
                  {pill.label === "Views" && <Eye className="w-3.5 h-3.5 text-[#00aa91]" />}
                  {pill.label === "Likes" && <Heart className="w-3.5 h-3.5 text-[#00aa91]" />}
                  {pill.label === "Comments" && <MessageCircle className="w-3.5 h-3.5 text-[#00aa91]" />}
                  {pill.value} {pill.label}
                </span>
              ))}
            </div>
          </div>

          {/* Why It Worked */}
          <div className="rounded-xl bg-[#00aa91]/[0.06] p-4 border border-[#00aa91]/15">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-[#00aa91]" />
              <span className="text-[10px] font-mono font-bold text-[#00aa91] uppercase tracking-[0.15em]">
                Why It Performed Well
              </span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{post.whyItWorked}</p>
          </div>

          {/* View Original */}
          <div className="pt-1">
            <a
              href={post.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00aa91] hover:text-[#008f7a] transition-colors group"
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              View Original Post
            </a>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
