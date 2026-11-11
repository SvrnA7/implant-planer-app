"use client";

import { AlertTriangle, CheckCircle2, CircleDot, Info, Navigation, ShieldAlert, Wrench } from "lucide-react";
import { Auswertung, EMPFEHLUNG_LABEL, FLAG_INFO, FlagKey } from "@/lib/domain";
import { Badge, cn } from "./ui";

export function EmpfehlungKarte({ a }: { a: Auswertung }) {
  const ton =
    a.empfehlung === "rueckfrage" ? "critical" : a.empfehlung === "offen" ? "caution" : "accent";
  const Icon = a.empfehlung === "rueckfrage" ? ShieldAlert : a.empfehlung.includes("falcon") ? Navigation : a.empfehlung === "offen" ? CircleDot : Wrench;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4",
        ton === "critical" ? "bg-critical-soft" : ton === "caution" ? "bg-caution-soft" : "bg-accent-soft",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl bg-surface shadow-soft",
            ton === "critical" ? "text-critical" : ton === "caution" ? "text-caution" : "text-accent-strong",
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Empfehlung</div>
          <div
            key={a.empfehlung}
            className={cn(
              "rise mt-0.5 text-[17px] font-semibold leading-snug tracking-tight",
              ton === "critical" ? "text-critical" : ton === "caution" ? "text-caution" : "text-accent-strong",
            )}
          >
            {EMPFEHLUNG_LABEL[a.empfehlung]}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Begruendung({ a }: { a: Auswertung }) {
  const alle = [
    ...a.proStatisch.map((t) => ({ t, wer: "Schablone" })),
    ...a.proFalcon.map((t) => ({ t, wer: "Falcon" })),
  ];
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Begründung</div>
      {alle.length === 0 ? (
        <p className="text-sm text-ink-3">Keine differenzierenden Kriterien gesetzt. Angaben unter „Verfahren“ ergänzen.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {alle.map(({ t, wer }) => (
            <li key={t} className="flex gap-2.5 text-sm leading-snug">
              <Badge tone={wer === "Falcon" ? "accent" : "neutral"} className="mt-px shrink-0">
                {wer}
              </Badge>
              <span className="text-ink-2">{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FlagListe({ a }: { a: Auswertung }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Risiko-Flags</span>
        {a.flags.length > 0 && <span className="tabular text-xs text-ink-3">{a.flags.length}</span>}
      </div>
      {a.flags.length === 0 ? (
        <div className="flex items-center gap-2 rounded-xl bg-safe-soft px-3 py-2.5 text-sm text-safe">
          <CheckCircle2 className="size-4 shrink-0" /> Keine Flags aus den aktuellen Angaben.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {a.flags.map((f, i) => (
            <li
              key={f.key + i}
              className={cn(
                "rise flex gap-2.5 rounded-xl border-l-[3px] px-3 py-2.5 text-sm leading-snug",
                f.sev === "kritisch" ? "border-critical bg-critical-soft" : "border-caution bg-caution-soft",
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {f.sev === "kritisch" ? (
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-critical" />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-caution" />
              )}
              <span className="text-ink">{f.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FlagChips({ keys, max = 3 }: { keys: FlagKey[]; max?: number }) {
  const u = [...new Set(keys)];
  if (u.length === 0) return <span className="text-xs text-ink-3">Keine Flags</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {u.slice(0, max).map((k) => (
        <Badge key={k} tone={FLAG_INFO[k].sev === "kritisch" ? "critical" : "caution"}>
          {FLAG_INFO[k].label}
        </Badge>
      ))}
      {u.length > max && <Badge>+{u.length - max}</Badge>}
    </div>
  );
}

export function IfuHinweis({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-2.5 rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-ink-2", className)}>
      <Info className="mt-0.5 size-3.5 shrink-0 text-ink-3" />
      <span>
        <strong className="font-medium text-ink">Entscheidungshilfe, keine Freigabe.</strong> Sicherheitsabstände, Sleeve-Offsets und
        Bohrprotokolle immer aus dem aktuellen Hersteller-IFU. Die Freigabe liegt beim Chirurgen.
      </span>
    </div>
  );
}
