"use client";

import { FolderPlus, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { FallZeile } from "@/components/fall-zeile";
import { PageHeader } from "@/components/shell";
import { ButtonLink, Card, cn, Empty, Input } from "@/components/ui";
import { auswerten, fallTitel, LABELS, Status, STATUS_ORDER } from "@/lib/domain";
import { useData } from "@/lib/store/provider";

type Filter = "alle" | "kritisch" | Status;

export default function FaellePage() {
  const { faelle, bereit } = useData();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("alle");

  const gefiltert = useMemo(() => {
    const s = q.trim().toLowerCase();
    return faelle.filter((f) => {
      if (filter === "kritisch" && !auswerten(f.befund).kritisch) return false;
      if (filter !== "alle" && filter !== "kritisch" && f.status !== filter) return false;
      if (!s) return true;
      return [fallTitel(f), f.implantat, f.chirurg, LABELS.versorgungstyp[f.befund.versorgungstyp]].join(" ").toLowerCase().includes(s);
    });
  }, [faelle, q, filter]);

  const zaehler = (k: Filter) =>
    k === "alle" ? faelle.length : k === "kritisch" ? faelle.filter((f) => auswerten(f.befund).kritisch).length : faelle.filter((f) => f.status === k).length;

  const filterListe: { k: Filter; label: string }[] = [
    { k: "alle", label: "Alle" },
    { k: "kritisch", label: "Kritisch" },
    ...STATUS_ORDER.map((s) => ({ k: s as Filter, label: LABELS.status[s] })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Falldatenbank"
        title="Fälle"
        text="Alle geplanten und dokumentierten Fälle. Jeder Fall lässt sich als Notiz für den Obsidian-Vault exportieren."
        actions={
          <ButtonLink href="/faelle/neu" variant="primary">
            <FolderPlus className="size-4" /> Neuer Fall
          </ButtonLink>
        }
      />
      <div className="px-4 py-6 sm:px-8">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Fall-ID, Regio, Implantat…" className="pl-9" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {filterListe.map(({ k, label }) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  filter === k ? "border-ink bg-ink text-surface" : "border-line bg-surface text-ink-2 hover:border-line-2",
                )}
              >
                {label}
                <span className={cn("tabular text-xs", filter === k ? "opacity-70" : "text-ink-3")}>{zaehler(k)}</span>
              </button>
            ))}
          </div>
        </div>
        <Card className="@container overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_110px_auto] gap-4 border-b border-line bg-surface-2 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3 @3xl:grid">
            <span>Fall</span>
            <span>Verfahren / Empfehlung</span>
            <span>Flags</span>
            <span>Checkliste</span>
            <span className="w-28">Status</span>
          </div>
          {bereit && gefiltert.length === 0 ? (
            <Empty
              icon={<Sparkles className="size-5" />}
              title={faelle.length ? "Keine Treffer" : "Noch keine Fälle"}
              text={faelle.length ? "Passe Suche oder Filter an." : "Lege den ersten Fall mit dem Fallnavigator an."}
              action={!faelle.length && <ButtonLink href="/faelle/neu" variant="primary">Ersten Fall anlegen</ButtonLink>}
            />
          ) : (
            <div className="divide-y divide-line">
              {gefiltert.map((f) => (
                <FallZeile key={f.id} f={f} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
