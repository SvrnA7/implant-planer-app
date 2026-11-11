"use client";

import { Check, ExternalLink, Minus, Navigation, Wrench } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/shell";
import { Badge, Card, cn, SectionTitle } from "@/components/ui";
import { CHECKLISTE, FLAG_INFO, FlagKey } from "@/lib/domain";
import { ANATOMIE, GLOSSAR, LEITPLANKEN, QUELLEN, RASTER, SCHABLONE, VERFAHREN, WORKFLOW } from "@/lib/wissen";

const KAPITEL = [
  { id: "workflow", label: "Workflow" },
  { id: "verfahren", label: "Verfahrenswahl" },
  { id: "anatomie", label: "Anatomie" },
  { id: "schablone", label: "Schablonendesign" },
  { id: "qs", label: "Qualitätskontrolle" },
  { id: "glossar", label: "Glossar" },
  { id: "quellen", label: "Quellen" },
];

export default function WissenPage() {
  const [schritt, setSchritt] = useState(0);
  return (
    <>
      <PageHeader
        eyebrow="Regelwerk · Stand 14.09.2026"
        title="Wissensbasis"
        text="Die fachliche Grundlage des Planungsagenten für CoDiagnostiX, statische Bohrschablonen und Straumann Falcon."
      />
      <div className="sticky top-14 z-20 border-b border-line bg-bg/85 px-4 py-2.5 backdrop-blur-xl sm:px-8 lg:top-0">
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {KAPITEL.map((k) => (
            <a key={k.id} href={`#${k.id}`} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm whitespace-nowrap text-ink-2 transition-colors hover:border-accent hover:text-accent-strong">
              {k.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12 px-4 py-8 sm:px-8 [&>section]:scroll-mt-32">
        <section>
          <SectionTitle eyebrow="Nicht verhandelbar" title="Sicherheitsleitplanken" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {LEITPLANKEN.map((l, i) => (
              <Card key={l.titel} className="p-5">
                <div className="mb-3 font-mono text-xs text-accent-strong">{String(i + 1).padStart(2, "0")}</div>
                <div className="font-medium">{l.titel}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{l.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="workflow">
          <SectionTitle eyebrow="Abschnitt 1" title="Planungsworkflow in CoDiagnostiX" />
          <Card className="p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
              {WORKFLOW.map((w, i) => (
                <div key={w.titel} className="flex flex-1 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSchritt(i)}
                    className={cn(
                      "flex min-w-max flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",
                      i === schritt ? "bg-accent text-accent-ink shadow-soft" : i < schritt ? "bg-accent-soft text-accent-strong" : "bg-surface-3 text-ink-2 hover:text-ink",
                    )}
                  >
                    <span className="font-mono text-[11px] opacity-70">{i + 1}</span>
                    {w.titel}
                  </button>
                  {i < WORKFLOW.length - 1 && <span className={cn("h-px w-3 shrink-0", i < schritt ? "bg-accent" : "bg-line-2")} />}
                </div>
              ))}
            </div>
            <div key={schritt} className="rise grid gap-2 sm:grid-cols-[120px_1fr]">
              <div className="font-mono text-5xl font-semibold tracking-tight text-accent-soft">{String(schritt + 1).padStart(2, "0")}</div>
              <div>
                <div className="text-lg font-semibold tracking-tight">{WORKFLOW[schritt].titel}</div>
                <p className="mt-1 max-w-2xl leading-relaxed text-ink-2">{WORKFLOW[schritt].text}</p>
              </div>
            </div>
          </Card>
        </section>

        <section id="verfahren">
          <SectionTitle eyebrow="Abschnitt 2" title="Statische Bohrschablone oder Falcon" />
          <div className="grid gap-4 lg:grid-cols-2">
            {(["statisch", "falcon"] as const).map((k) => {
              const v = VERFAHREN[k];
              const Icon = k === "falcon" ? Navigation : Wrench;
              return (
                <Card key={k} className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <div className="text-lg font-semibold tracking-tight">{v.name}</div>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-ink-2">{v.kurz}</p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Liste titel="Spricht dafür" items={v.sinnvoll} plus />
                    <Liste titel="Grenzen" items={v.grenzen} />
                  </div>
                </Card>
              );
            })}
          </div>
          <Card className="mt-4 p-5 sm:p-6">
            <div className="mb-3 text-sm font-medium">Entscheidungsraster: diese Punkte vor jeder Verfahrenswahl klären</div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {RASTER.map((r, i) => (
                <li key={r} className="flex gap-3 rounded-xl bg-surface-2 px-3 py-2.5 text-sm text-ink-2">
                  <span className="font-mono text-xs text-accent-strong">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </Card>
        </section>

        <section id="anatomie">
          <SectionTitle eyebrow="Abschnitt 3" title="Anatomische Risikobewertung" />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ANATOMIE.map((x) => (
              <Card key={x.titel} className="p-5">
                <div className="font-medium">{x.titel}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{x.text}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-4 overflow-hidden">
            <div className="border-b border-line bg-surface-2 px-5 py-3 text-sm font-medium">Risiko-Flags und ihre Kürzel im Vault</div>
            <div className="grid divide-line sm:grid-cols-3 sm:divide-x">
              {(["kritisch", "beachten"] as const).map((sev) => (
                <div key={sev} className={cn("flex flex-wrap content-start gap-1.5 p-4", sev === "beachten" && "sm:col-span-2")}>
                  <div className="mb-1 w-full font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{sev}</div>
                  {(Object.keys(FLAG_INFO) as FlagKey[])
                    .filter((k) => FLAG_INFO[k].sev === sev)
                    .map((k) => (
                      <Badge key={k} tone={sev === "kritisch" ? "critical" : "caution"}>
                        {FLAG_INFO[k].label} <span className="font-mono opacity-60">{k}</span>
                      </Badge>
                    ))}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section id="schablone">
          <SectionTitle eyebrow="Abschnitt 4" title="Statisches Bohrschablonen-Design" />
          <Card className="divide-y divide-line">
            {SCHABLONE.map((x, i) => (
              <div key={x.titel} className="grid gap-1 p-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <div className="flex items-center gap-3 font-medium">
                  <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  {x.titel}
                </div>
                <p className="text-sm leading-relaxed text-ink-2">{x.text}</p>
              </div>
            ))}
          </Card>
        </section>

        <section id="qs">
          <SectionTitle eyebrow="Abschnitt 5" title="Qualitätskontrolle vor Fertigung" />
          <Card className="p-2">
            <ol className="grid sm:grid-cols-2">
              {CHECKLISTE.map((c, i) => (
                <li key={c} className="flex gap-3 rounded-xl p-3 text-sm text-ink-2">
                  <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-accent-soft font-mono text-[11px] text-accent-strong">{i + 1}</span>
                  {c}
                </li>
              ))}
            </ol>
          </Card>
        </section>

        <section id="glossar">
          <SectionTitle eyebrow="Abschnitt 6" title="Glossar" />
          <div className="grid gap-3 md:grid-cols-2">
            {GLOSSAR.map((g) => (
              <Card key={g.begriff} className="p-5">
                <div className="font-medium">{g.begriff}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{g.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="quellen">
          <SectionTitle eyebrow="Abschnitt 7" title="Quellen" />
          <Card className="divide-y divide-line">
            {QUELLEN.map((q) => (
              <a key={q.url} href={q.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-surface-2">
                <span className="text-ink-2 group-hover:text-ink">{q.titel}</span>
                <ExternalLink className="size-4 shrink-0 text-ink-3" />
              </a>
            ))}
          </Card>
          <p className="mt-3 text-xs text-ink-3">Straumann aktualisiert Indikationen, Verfügbarkeit und Spezifikationen fortlaufend. Vor klinisch relevanten Aussagen die aktuelle Quelle prüfen.</p>
        </section>
      </div>
    </>
  );
}

function Liste({ titel, items, plus }: { titel: string; items: string[]; plus?: boolean }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{titel}</div>
      <ul className="flex flex-col gap-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm leading-snug">
            {plus ? <Check className="mt-0.5 size-4 shrink-0 text-safe" /> : <Minus className="mt-0.5 size-4 shrink-0 text-caution" />}
            <span className="text-ink-2">{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
