"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderKanban, LayoutDashboard, Lightbulb, Moon, Plus, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "@/lib/store/provider";
import { cn } from "./ui";

const NAV = [
  { href: "/", label: "Übersicht", icon: LayoutDashboard },
  { href: "/faelle", label: "Fälle", icon: FolderKanban },
  { href: "/wissen", label: "Wissen", icon: BookOpen },
  { href: "/lessons", label: "Lessons", icon: Lightbulb },
  { href: "/einstellungen", label: "Daten", icon: Settings },
];

function aktiv(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function ThemeToggle() {
  const [dunkel, setDunkel] = useState<boolean | null>(null);
  useEffect(() => {
    const gesetzt = document.documentElement.dataset.theme;
    setDunkel(gesetzt ? gesetzt === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);
  function umschalten() {
    const neu = !dunkel;
    setDunkel(neu);
    document.documentElement.dataset.theme = neu ? "dark" : "light";
    try {
      localStorage.setItem("cdx-planer:theme", neu ? "dark" : "light");
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={umschalten}
      aria-label={dunkel ? "Helles Design" : "Dunkles Design"}
      className="grid size-9 place-items-center rounded-xl text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
    >
      {dunkel ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

function Datenquelle() {
  const { quelle, laborStatus, bereit } = useData();
  const labor = quelle === "labor";
  const warn = laborStatus.konfiguriert && !laborStatus.erreichbar;
  return (
    <Link href="/einstellungen" className="flex items-center gap-2.5 rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-xs transition-colors hover:border-line-2">
      <span className={cn("size-2 shrink-0 rounded-full", !bereit ? "bg-ink-3" : warn ? "bg-caution" : labor ? "bg-safe" : "bg-accent")} />
      <span className="min-w-0">
        <span className="block font-medium text-ink">{labor ? "Laborserver" : "Dieses Gerät"}</span>
        <span className="block truncate text-ink-3">{warn ? "Server nicht erreichbar" : labor ? "Synchronisiert" : "Lokal gespeichert"}</span>
      </span>
    </Link>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
          <Logo />
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">Implant Planer</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">CoDiagnostiX · Falcon</span>
          </span>
        </Link>
        <Link
          href="/faelle/neu"
          className="mb-6 flex h-10 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-accent-ink shadow-soft transition-colors hover:bg-accent-strong"
        >
          <Plus className="size-4" /> Neuer Fall
        </Link>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-colors",
                aktiv(pathname, href) ? "bg-accent-soft font-medium text-accent-strong" : "text-ink-2 hover:bg-surface-3 hover:text-ink",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Datenquelle />
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-ink-3">Keine klinische Freigabe</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/85 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">Implant Planer</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/faelle/neu" aria-label="Neuer Fall" className="grid size-9 place-items-center rounded-xl bg-accent text-accent-ink">
            <Plus className="size-[18px]" />
          </Link>
        </div>
      </header>

      <main className="min-w-0 pb-24 lg:pb-0">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px]", aktiv(pathname, href) ? "font-medium text-accent-strong" : "text-ink-3")}
          >
            <Icon className="size-5" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path d="M11 9.5h10M12.5 13h7M13.5 16.5h5M14.5 20h3" stroke="var(--accent-ink)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 20v3.5" stroke="var(--accent-ink)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PageHeader({ eyebrow, title, text, actions }: { eyebrow?: string; title: string; text?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-line bg-surface px-4 pb-6 pt-7 sm:px-8 lg:pt-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-strong">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-[28px]">{title}</h1>
        {text && <p className="mt-2 text-[15px] leading-relaxed text-ink-2 text-pretty">{text}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
