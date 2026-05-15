import { NavLink } from "react-router-dom";
import {
  Lightbulb, FileText, Image, Search, TrendingUp,
  Zap, AtSign, LayoutDashboard, Sparkles, X,
} from "lucide-react";

const navItems = [
  { path: "/",           icon: LayoutDashboard, label: "Dashboard",     gradient: "from-sky-500 to-blue-600"        },
  { path: "/ideas",      icon: Lightbulb,        label: "Video Ideas",   gradient: "from-amber-400 to-orange-500"    },
  { path: "/trending",   icon: TrendingUp,       label: "Trending Topics",gradient: "from-indigo-400 to-violet-500"  },
  { path: "/scripts",    icon: FileText,          label: "Script Writer", gradient: "from-emerald-400 to-teal-500"    },
  { path: "/thumbnails", icon: Image,             label: "Thumbnails",   gradient: "from-pink-400 to-rose-500"       },
  { path: "/seo",        icon: Search,            label: "SEO & Titles",  gradient: "from-indigo-400 to-violet-500"   },
  { path: "/shorts",     icon: Zap,               label: "Shorts & Reels",gradient: "from-amber-400 to-red-500"      },
  { path: "/instagram",  icon: AtSign,            label: "Instagram",    gradient: "from-fuchsia-400 to-pink-500"    },
  { path: "/prompts",    icon: Sparkles,          label: "Prompt Builder",gradient: "from-emerald-400 to-teal-500"    },
];

interface SidebarProps { isOpen: boolean; onClose: () => void; }

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen
        w-[272px]
        flex flex-col shrink-0
        bg-white
        border-r border-slate-200/80
        shadow-2xl shadow-slate-900/10
        transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:sticky lg:top-0 lg:z-30
        lg:h-dvh
        lg:w-[248px]
        lg:translate-x-0
        lg:shadow-none
        lg:overflow-y-auto
      `}>

        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600
              flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[.85rem] font-bold text-slate-900 tracking-tight leading-none">Content Studio</p>
              <p className="text-[.65rem] text-slate-400 font-medium mt-0.5">AI Creator Tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-2 pb-2 text-[.62rem] font-bold text-slate-400 uppercase tracking-[0.1em]">
            Tools
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link group ${isActive ? "active" : ""}`}
            >
              <div className={`w-7 h-7 rounded-lg bg-linear-to-br ${item.gradient}
                flex items-center justify-center shrink-0
                shadow-sm group-[.active]:shadow-md transition-shadow`}>
                <item.icon size={14} className="text-white" />
              </div>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
            bg-linear-to-br from-indigo-50 to-violet-50
            border border-indigo-100/70">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[.62rem] font-semibold text-slate-500 uppercase tracking-wider">Powered by</p>
              <p className="text-[.8rem] font-bold bg-linear-to-r from-indigo-600 to-violet-600
                bg-clip-text text-transparent leading-tight mt-0.5">
                Gemini 2.5 Flash
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
