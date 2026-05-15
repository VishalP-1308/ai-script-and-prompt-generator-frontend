import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { Menu, Sparkles } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/":           "Dashboard",
  "/ideas":      "Video Ideas",
  "/scripts":    "Script Writer",
  "/thumbnails": "Thumbnails",
  "/seo":        "SEO & Titles",
  "/shorts":     "Shorts & Reels",
  "/instagram":  "Instagram",
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "AI Content Studio";

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    /* Outer flex row: sidebar + content column */
    <div className="flex min-h-dvh bg-[#f6f7fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content column */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* ── Mobile / tablet header (hidden on desktop) ── */}
        {/* NOTE: all display control via Tailwind utilities — no custom CSS class */}
        <header className="
          flex lg:hidden
          items-center gap-3 px-4
          h-14 shrink-0
          bg-white/96 border-b border-slate-200/80
          sticky top-0 z-30
          backdrop-blur-xl
        ">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-9 h-9 -ml-1.5 rounded-xl
              text-slate-600 hover:text-slate-900 hover:bg-slate-100
              active:bg-slate-200 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-violet-500
              flex items-center justify-center shadow-sm shadow-indigo-400/30 shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-[.9rem] font-semibold text-slate-900 truncate">{pageTitle}</span>
          </div>
        </header>

        {/* ── Desktop top bar (hidden on mobile/tablet) ── */}
        <header className="
          hidden lg:flex
          items-center gap-4 px-10 xl:px-14
          h-[52px] shrink-0
          bg-white/80 border-b border-slate-200/60
          sticky top-0 z-20
          backdrop-blur-xl
        ">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[.82rem] font-semibold text-slate-900 tracking-tight">{pageTitle}</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
            bg-emerald-50 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[.67rem] font-semibold text-emerald-700 tracking-wide">Live</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{
          duration: 2800,
          style: {
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.08)",
            color: "#0f172a",
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            boxShadow: "0 4px 8px rgba(15,23,42,0.06), 0 12px 32px rgba(15,23,42,0.08)",
            padding: "10px 14px",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </div>
  );
}
