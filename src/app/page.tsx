"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FolderPlus, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { FallZeile } from "@/components/fall-zeile";
import { ButtonLink, Card, Empty, SectionTitle } from "@/components/ui";
import { auswerten, freigabeBereit } from "@/lib/domain";
import { useData } from "@/lib/store/provider";
import { LEITPLANKEN } from "@/lib/wissen";

export default function Uebersicht() {
  const { faelle, lessons, bereit } = useData();

  const zahlen = useMemo(() => {
    const offen = faelle.filter((f) => f.status === "planung");
    return {
      gesamt: faelle.length,
      planung: offen.length,
      kritisch: offen.filter((f) => auswerten(f.befund).kritisch).length,
      bereit: offen.filter(freigabeBereit).length,
      falcon: faelle.filter((f) => f.verfahrenGeplant === "falcon").length,
    };
  }, [faelle]);

  const stunde = new Date().getHours();
  const gruss = stunde < 11 ? "Guten Morgen" : stunde < 18 ? "Guten Tag" : "Guten Abend";

  return (
    <div className="px-4 py-7 sm:px-8 lg:py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-strong">
            {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">{gruss}, Sven.</h1>
          <p className="mt-1.5 text-[15px] text-ink-2">
            {!bereit
              ? "Daten werden geladen…"
              : zahlen.planung === 0
                ? "Keine offenen Planungen. Zeit für einen neuen Fall."
                : `${zahlen.planung} ${zahlen.planung === 1 ? "Fall ist" : "Fälle sind"} in Planung${zahlen.kritisch ? `, ${zahlen.kritisch} davon mit kritischen Flags` : ""}.`}
          </p>
        </div>
        <ButtonLink href="/faelle/neu" variant="primary" size="lg">
          <FolderPlus className="size-[18px]" /> Neuen Fall planen
        </ButtonLink>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kennzahl label="In Planung" wert={zahlen.planung} />
        <Kennzahl label="Kritische Flags" wert={zahlen.kritisch} ton={zahlen.kritisch ? "critical" : undefined} />
        <Kennzahl label="Bereit zur Freigabe" wert={zahlen.bereit} ton={zahlen.bereit ? "safe" : undefined} />
        <Kennzahl label="Fälle gesamt" wert={zahlen.gesamt} sub={zahlen.falcon ? `${zahlen.falcon} mit Falcon` : undefined} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <SectionTitle
            eyebrow="Zuletzt bearbeitet"
            title="Fälle"
            action={
              faelle.length > 0 && (
                <Link href="/faelle" className="flex items-center gap-1 text-sm text-accent-strong hover:underline">
                  Alle <ArrowRight className="size-3.5" />
                </Link>
              )
            }
          />
          <Card className="@container overflow-hidden">
            {bereit && faelle.length === 0 ? (
              <Empty
                icon={<Sparkles className="size-5" />}
                title="Noch keine Fälle"
                text="Plane deinen ersten Fall mit dem Fallnavigator. Er wird hier mit Empfehlung, Flags und Freigabestand angezeigt."
                action={<ButtonLink href="/faelle/neu" variant="primary">Ersten Fall anlegen</ButtonLink>}
              />
            ) : (
              <div className="divide-y divide-line">
                {faelle.slice(0, 6).map((f) => (
                  <FallZeile key={f.id} f={f} />
                ))}
              </div>
            )}
          </Card>
        </section>

        <aside className="flex flex-col gap-6">
          <section>
            <SectionTitle eyebrow="Nicht verhandelbar" title="Leitplanken" />
            <Card className="divide-y divide-line">
              {LEITPLANKEN.map((l, i) => (
                <div key={l.titel} className="flex gap-3 p-4">
                  <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="text-sm font-medium">{l.titel}</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-2">{l.text}</p>
                  </div>
                </div>
              ))}
            </Card>
          </section>
          <div className="grid grid-cols-2 gap-3">
            <Schnellzugriff href="/wissen" icon={<BookOpen className="size-5" />} titel="Wissen" text="Regelwerk & Glossar" />
            <Schnellzugriff href="/lessons" icon={<Lightbulb className="size-5" />} titel="Lessons" text={`${lessons.length} Erkenntnisse`} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Kennzahl({ label, wert, ton, sub }: { label: string; wert: number; ton?: "critical" | "safe"; sub?: string }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center gap-1.5 text-xs text-ink-3">
        {ton === "critical" && <ShieldAlert className="size-3.5 text-critical" />}
        {label}
      </div>
      <div className={`tabular mt-2 text-3xl font-semibold tracking-tight ${ton === "critical" ? "text-critical" : ton === "safe" ? "text-safe" : ""}`}>{wert}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-3">{sub}</div>}
    </Card>
  );
}

function Schnellzugriff({ href, icon, titel, text }: { href: string; icon: React.ReactNode; titel: string; text: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-accent">
      <div className="mb-3 grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong">{icon}</div>
      <div className="text-sm font-medium">{titel}</div>
      <div className="text-xs text-ink-3">{text}</div>
    </Link>
  );
}
