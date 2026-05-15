import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
}

export default function PageHeader({ icon, title, subtitle, gradient }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3.5 animate-fade-in">
      <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradient}
        flex items-center justify-center shadow-md shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-[1.15rem] sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-[.78rem] sm:text-[.82rem] text-slate-500 mt-0.5 leading-snug truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
