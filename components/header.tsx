"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pipeline": "Pipeline",
  "/contacts": "Contacts",
  "/leads": "Leads",
  "/mqls": "MQLs",
  "/sqls": "SQLs",
  "/opportunities": "Opportunities",
  "/accounts": "Accounts",
  "/renewals": "Renewals",
  "/contracts": "Contracts",
  "/revenue": "Revenue",
  "/tasks": "Tasks",
  "/emails": "Emails",
  "/reports": "Reports",
  "/migration": "Migration",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Workspace";
  return (
    <header className="h-16 bg-white border-b border-line flex items-center px-6 gap-4 flex-shrink-0 z-[5]">
      <h1 className="text-lg font-semibold text-navy">{title}</h1>
      <div className="flex-1 max-w-[480px] mx-auto relative">
        <input
          placeholder="Ask AI anything about your pipeline…"
          className="w-full pl-10 pr-12 py-2 border-[1.5px] border-line rounded-3xl bg-surface text-[13px] outline-none focus:border-accent focus:bg-white"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3">⌕</span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded font-mono">
          AI
        </span>
      </div>
    </header>
  );
}
