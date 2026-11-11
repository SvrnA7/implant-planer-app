"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auswerten, CHECKLISTE, checklisteFortschritt, EMPFEHLUNG_LABEL, Fall, fallTitel, LABELS } from "@/lib/domain";
import { FlagChips } from "./auswertung";
import { Badge, cn } from "./ui";

export function statusTon(s: Fall["status"]) {
  return s === "planung" ? "neutral" : s === "freigegeben" ? "accent" : s === "abgeschlossen" ? "safe" : "caution";
}

export function FallZeile({ f }: { f: Fall }) {
  const a = auswerten(f.befund);
  const n = checklisteFortschritt(f);
  return (
    <Link
      href={`/faelle/${f.id}`}
      className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors hover:bg-surface-2 sm:px-5 @3xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_110px_auto]"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-mono text-sm font-medium">{fallTitel(f)}</span>
          {f.kiefer && <span className="text-xs text-ink-3">{f.kiefer}</span>}
        </div>
        <div className="truncate text-xs text-ink-3">
          {LABELS.versorgungstyp[f.befund.versorgungstyp]} · {new Date(f.datumPlanung).toLocaleDateString("de-DE")}
        </div>
      </div>
      <div className="hidden min-w-0 @3xl:block">
        <div className={cn("truncate text-sm", a.kritisch ? "text-critical" : "text-ink-2")}>
          {f.verfahrenGeplant ? LABELS.verfahren[f.verfahrenGeplant] : EMPFEHLUNG_LABEL[a.empfehlung]}
        </div>
      </div>
      <div className="col-span-2 row-start-2 @3xl:col-span-1 @3xl:row-start-auto">
        <FlagChips keys={a.flags.map((x) => x.key)} />
      </div>
      <div className="hidden items-center gap-2 @3xl:flex">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
          <div className="h-full rounded-full bg-accent" style={{ width: `${(n / CHECKLISTE.length) * 100}%` }} />
        </div>
        <span className="tabular w-9 text-right text-xs text-ink-3">
          {n}/{CHECKLISTE.length}
        </span>
      </div>
      <div className="col-start-2 row-start-1 flex items-center gap-2 @3xl:col-start-auto @3xl:row-start-auto">
        <Badge tone={statusTon(f.status)} dot>
          {LABELS.status[f.status]}
        </Badge>
        <ChevronRight className="size-4 text-ink-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
