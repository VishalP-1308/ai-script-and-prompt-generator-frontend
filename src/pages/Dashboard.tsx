import { Link } from "react-router-dom";
import {
  Lightbulb, FileText, Image, Search,
  Zap, AtSign, Sparkles, ArrowUpRight,
  TrendingUp, Video, Target, BarChart3,
} from "lucide-react";

const tools = [
  {
    path: "/ideas",
    icon: Lightbulb,
    title: "Viral Video Ideas",
    desc: "Generate 20+ ranked ideas with viral scores, trending analysis, and Shorts angles.",
    gradient: "from-amber-400 to-orange-500",
    tag: "20+ ideas",
    tagColor: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    path: "/trending",
    icon: TrendingUp,
    title: "Trending Topics",
    desc: "Discover what's blowing up right now in your niche to ride the wave.",
    gradient: "from-indigo-400 to-violet-500",
    tag: "Real-time",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    path: "/scripts",
    icon: FileText,
    title: "Script Writer",
    desc: "Full scripts with retention-optimized hooks, pattern interrupts, visual cues, and CTAs.",
    gradient: "from-emerald-400 to-teal-500",
    tag: "Hook + Script + CTA",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    path: "/thumbnails",
    icon: Image,
    title: "Thumbnail Prompts",
    desc: "High-CTR AI image prompts for Midjourney, Leonardo, Ideogram, and DALL-E.",
    gradient: "from-pink-400 to-rose-500",
    tag: "Multi-platform",
    tagColor: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    path: "/seo",
    icon: Search,
    title: "SEO & Titles",
    desc: "Keyword research, SEO-optimized titles, YouTube tags, and hashtag strategies.",
    gradient: "from-indigo-400 to-violet-500",
    tag: "Titles + Keywords",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    path: "/shorts",
    icon: Zap,
    title: "Shorts & Reels",
    desc: "Viral short-form scripts with trending hooks, captions, and 7-day content calendars.",
    gradient: "from-amber-400 to-red-500",
    tag: "5+ scripts",
    tagColor: "bg-red-50 text-red-700 border-red-100",
  },
  {
    path: "/instagram",
    icon: AtSign,
    title: "Instagram Studio",
    desc: "Captions, hashtag packs, carousel slide copy, and engagement-optimized hooks.",
    gradient: "from-fuchsia-400 to-pink-500",
    tag: "Captions + Hashtags",
    tagColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
  },
  {
    path: "/prompts",
    icon: Sparkles,
    title: "Prompt Builder",
    desc: "Generate perfectly engineered prompts to copy/paste into ChatGPT, Claude, or Gemini.",
    gradient: "from-emerald-400 to-teal-500",
    tag: "Mega Prompts",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
];

const stats = [
  { icon: Video,     label: "Tools",       value: "8",         color: "text-indigo-600", bg: "bg-indigo-50"  },
  { icon: TrendingUp,label: "AI Model",    value: "Gemini",    color: "text-emerald-600",bg: "bg-emerald-50" },
  { icon: Target,    label: "Platforms",   value: "YT + IG",   color: "text-rose-600",   bg: "bg-rose-50"    },
  { icon: BarChart3, label: "Generation",  value: "Real-time", color: "text-violet-600", bg: "bg-violet-50"  },
];

const workflow = [
  { n: "1", title: "Idea",      desc: "Find viral topics"    },
  { n: "2", title: "Script",    desc: "Hook + content + CTA" },
  { n: "3", title: "Thumbnail", desc: "AI image prompts"     },
  { n: "4", title: "SEO",       desc: "Titles + tags"        },
  { n: "5", title: "Shorts",    desc: "Repurpose content"    },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl
        bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-600
        shadow-xl shadow-indigo-500/25 animate-fade-in">

        {/* Glows */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64
          bg-white/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72
          bg-violet-400/20 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative px-6 py-8 sm:px-10 sm:py-12 lg:py-14">
          <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full
            bg-white/15 border border-white/20 backdrop-blur-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[.72rem] font-semibold text-white/90">Powered by Gemini 2.5 Flash</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white
            tracking-tight leading-[1.1] max-w-2xl">
            Make viral content,{" "}
            <span className="text-amber-300">10× faster.</span>
          </h1>
          <p className="mt-4 text-indigo-100 text-sm sm:text-base leading-relaxed max-w-2xl">
            Your all-in-one creator command center for YouTube and Instagram.
            Generate ideas, write scripts, design thumbnails, and crush SEO — all in one place.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/ideas"
              className="inline-flex items-center justify-center gap-2 h-11 px-6
              bg-white text-indigo-700 rounded-xl font-semibold text-sm
              shadow-lg shadow-black/10
              hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              <Sparkles size={16} />
              Start Generating
            </Link>
            <Link to="/scripts"
              className="inline-flex items-center justify-center gap-2 h-11 px-6
              bg-white/10 text-white border border-white/20 rounded-xl font-semibold text-sm backdrop-blur-sm
              hover:bg-white/20 transition-all duration-200">
              <FileText size={16} />
              Write a Script
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(s => (
          <div key={s.label} className="surface-card flex items-center gap-3 px-4 py-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[.67rem] text-slate-500 font-semibold uppercase tracking-wider truncate">{s.label}</p>
              <p className="text-sm font-bold text-slate-900 truncate leading-tight mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Tools grid */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-1 h-5 bg-linear-to-b from-indigo-500 to-violet-500 rounded-full" />
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-none">Content Tools</h2>
            <p className="text-xs text-slate-500 mt-1">Pick a tool to start generating</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group card p-5 flex flex-col no-underline
                hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/8
                hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * .05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${tool.gradient}
                  flex items-center justify-center shadow-md
                  group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300`}>
                  <tool.icon size={18} className="text-white" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200
                  flex items-center justify-center
                  group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-colors">
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>

              <h3 className="text-[.95rem] font-bold text-slate-900 tracking-tight mb-1.5">{tool.title}</h3>
              <p className="text-[.82rem] text-slate-500 leading-relaxed flex-1">{tool.desc}</p>

              <div className={`mt-4 inline-flex w-fit items-center px-2.5 py-1 rounded-full
                text-[.67rem] font-semibold border ${tool.tagColor}`}>
                {tool.tag}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="surface-card px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-emerald-500 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Faceless Channel Workflow</h3>
            <p className="text-xs text-slate-500 mt-0.5">A repeatable system for shipping videos consistently</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
          {workflow.map((step, i) => (
            <div key={i} className="relative flex sm:flex-col items-center sm:items-start
              gap-3 flex-1 p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70
              hover:bg-indigo-50/50 hover:border-indigo-200/70 transition-colors group">

              {/* Connector line (desktop only, not on last) */}
              {i < workflow.length - 1 && (
                <div className="hidden sm:block absolute top-[18px] right-0 w-[calc(100%+12px)]
                  h-px bg-slate-200 translate-x-3 pointer-events-none z-0" />
              )}

              <div className="relative z-10 w-7 h-7 rounded-lg bg-white border border-indigo-100
                flex items-center justify-center text-xs font-bold text-indigo-600
                shadow-sm shrink-0 group-hover:border-indigo-200">
                {step.n}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{step.title}</p>
                <p className="text-[.72rem] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
