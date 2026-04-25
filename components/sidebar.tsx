"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

type NavItem = { href: string; label: string; icon: string; badge?: string; section?: string };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡", section: "Workspace" },
  { href: "/pipeline", label: "Pipeline", icon: "◈" },
  { href: "/contacts", label: "Contacts", icon: "◯", section: "People" },
  { href: "/leads", label: "Leads", icon: "◎" },
  { href: "/mqls", label: "MQLs", icon: "◉" },
  { href: "/sqls", label: "SQLs", icon: "●" },
  { href: "/opportunities", label: "Opportunities", icon: "◆" },
  { href: "/accounts", label: "Accounts", icon: "🏢", section: "Customers" },
  { href: "/renewals", label: "Renewals", icon: "↻" },
  { href: "/contracts", label: "Contracts", icon: "📋", section: "Commerce" },
  { href: "/revenue", label: "Revenue", icon: "£" },
  { href: "/tasks", label: "Tasks", icon: "✓", section: "Work" },
  { href: "/emails", label: "Emails", icon: "✉" },
  { href: "/reports", label: "Reports", icon: "◫" },
  { href: "/migration", label: "Migration", icon: "⇄", section: "System" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[240px] bg-navy flex flex-col flex-shrink-0 z-10 overflow-y-auto">
      <div className="px-5 py-4 border-b border-white/10">
        <div className="font-display text-base font-bold text-white leading-tight">
          Invensis <span className="text-accent-soft">Learning</span>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5 font-mono">
          Intelligent CRM
        </div>
      </div>
      <nav className="flex-1 py-2">
        {NAV.map((item) => (
          <div key={item.href}>
            {item.section && (
              <div className="px-3 pt-3 pb-1 text-[9px] font-semibold tracking-widest uppercase text-white/30 font-mono">
                {item.section}
              </div>
            )}
            <Link
              href={item.href as any}
              className={`flex items-center gap-2.5 px-4 py-2 mx-2 rounded-lg text-[13.5px] transition relative ${
                pathname === item.href
                  ? "bg-accent/20 text-accent-soft font-medium"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-accent text-white text-[10px] font-semibold px-1.5 py-px rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          </div>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-white/10 flex items-center gap-2.5">
        <UserButton afterSignOutUrl="/sign-in" />
        <div className="text-[12.5px] text-white/80 font-medium">Account</div>
      </div>
    </aside>
  );
}
