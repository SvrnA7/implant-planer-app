"use client";

import { Copy, Lightbulb, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/shell";
import { Badge, Button, Card, cn, Empty, Field, Input, Segmented, Select, Textarea } from "@/components/ui";
import { fallTitel, heute, LABELS, Lesson, neueId } from "@/lib/domain";
import { lessonAlsMarkdown } from "@/lib/markdown";
import { useData } from "@/lib/store/provider";

const leer = (): Lesson => ({
  id: neueId(),
  titel: "",
  erkenntnis: "",
  kontext: "",
  konsequenz: "",
  bereich: "matching",
  verfahren: "beide",
  giltAls: "hypothese",
  faelle: [],
  datum: heute(),
});

export default function LessonsPage() {
  const { lessons, faelle, speichereLesson, loescheLesson, bereit } = useData();
  const [entwurf, setEntwurf] = useState<Lesson | null>(null);
  const [filter, setFilter] = useState<Lesson["giltAls"] | "alle">("alle");

  const liste = lessons.filter((l) => filter === "alle" || l.giltAls === filter);
  const fallRefs = faelle.map((f) => ({ id: f.id, titel: fallTitel(f) }));

  async function speichern() {
    if (!entwurf || !entwurf.titel.trim()) return;
    await speichereLesson(entwurf);
    setEntwurf(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="Erfahrungswissen"
        title="Lessons Learned"
        text="Eine Erkenntnis pro Eintrag. Aus einer Hypothese wird nach mehreren Fällen eine bestätigte Erkenntnis und schließlich eine Regel im Regelwerk."
        actions={
          <Button variant="primary" onClick={() => setEntwurf(leer())}>
            <Plus className="size-4" /> Neue Lesson
          </Button>
        }
      />
      <div className="px-4 py-6 sm:px-8">
        {entwurf && (
          <Card className="rise mb-6 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="font-semibold tracking-tight">{lessons.some((l) => l.id === entwurf.id) ? "Lesson bearbeiten" : "Neue Lesson"}</div>
              <Button variant="ghost" size="sm" onClick={() => setEntwurf(null)} aria-label="Schließen">
                <X className="size-4" />
              </Button>
            </div>
            <div className="grid gap-5">
              <Field label="Titel als Aussage" htmlFor="titel" hint="z. B. „Matching bei Metallartefakten nur an unrestaurierten Zähnen referenzieren“">
                <Input id="titel" value={entwurf.titel} onChange={(e) => setEntwurf({ ...entwurf, titel: e.target.value })} />
              </Field>
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Bereich">
                  <Select value={entwurf.bereich} onChange={(v) => setEntwurf({ ...entwurf, bereich: v })} options={LABELS.lessonBereich} />
                </Field>
                <Field label="Verfahren">
                  <Segmented name="Verfahren" value={entwurf.verfahren} onChange={(v) => setEntwurf({ ...entwurf, verfahren: v })} options={{ statisch: "Statisch", falcon: "Falcon", beide: "Beide" }} />
                </Field>
                <Field label="Gilt als">
                  <Segmented name="Gilt als" value={entwurf.giltAls} onChange={(v) => setEntwurf({ ...entwurf, giltAls: v })} options={LABELS.giltAls} />
                </Field>
              </div>
              <Field label="Erkenntnis" hint="Ein bis zwei Sätze: Regel, Trick oder Fehlerquelle">
                <Textarea value={entwurf.erkenntnis} onChange={(e) => setEntwurf({ ...entwurf, erkenntnis: e.target.value })} />
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Kontext" hint="Wann tritt es auf, woran erkennt man es früh?">
                  <Textarea value={entwurf.kontext} onChange={(e) => setEntwurf({ ...entwurf, kontext: e.target.value })} />
                </Field>
                <Field label="Konsequenz" hint="Was mache ich ab jetzt anders?">
                  <Textarea value={entwurf.konsequenz} onChange={(e) => setEntwurf({ ...entwurf, konsequenz: e.target.value })} />
                </Field>
              </div>
              {faelle.length > 0 && (
                <Field label="Aus welchen Fällen?">
                  <div className="flex flex-wrap gap-1.5">
                    {faelle.map((f) => {
                      const an = entwurf.faelle.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setEntwurf({ ...entwurf, faelle: an ? entwurf.faelle.filter((x) => x !== f.id) : [...entwurf.faelle, f.id] })}
                          className={cn("rounded-full border px-3 py-1.5 font-mono text-xs transition-colors", an ? "border-accent bg-accent-soft text-accent-strong" : "border-line text-ink-2 hover:border-line-2")}
                        >
                          {fallTitel(f)}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )}
              <div className="flex justify-end gap-2 border-t border-line pt-5">
                <Button variant="ghost" onClick={() => setEntwurf(null)}>
                  Abbrechen
                </Button>
                <Button variant="primary" onClick={speichern} disabled={!entwurf.titel.trim()}>
                  Speichern
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="mb-4 flex gap-1.5 overflow-x-auto">
          {(["alle", "hypothese", "bestaetigt", "regel"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={cn("rounded-full border px-3 py-1.5 text-sm whitespace-nowrap", filter === k ? "border-ink bg-ink text-surface" : "border-line bg-surface text-ink-2 hover:border-line-2")}
            >
              {k === "alle" ? "Alle" : LABELS.giltAls[k]}
            </button>
          ))}
        </div>

        {bereit && liste.length === 0 ? (
          <Card>
            <Empty
              icon={<Lightbulb className="size-5" />}
              title="Noch keine Lessons"
              text="Halte fest, was du aus einem Fall gelernt hast. So fließt deine Erfahrung in künftige Planungen ein."
              action={<Button variant="primary" onClick={() => setEntwurf(leer())}>Erste Lesson anlegen</Button>}
            />
          </Card>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {liste.map((l) => (
              <Card key={l.id} className="group flex flex-col p-5">
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  <Badge tone={l.giltAls === "regel" ? "safe" : l.giltAls === "bestaetigt" ? "accent" : "neutral"} dot>
                    {LABELS.giltAls[l.giltAls]}
                  </Badge>
                  <Badge>{LABELS.lessonBereich[l.bereich]}</Badge>
                  <Badge>{l.verfahren === "beide" ? "Beide Verfahren" : LABELS.verfahren[l.verfahren]}</Badge>
                  <span className="ml-auto text-xs text-ink-3">{new Date(l.datum).toLocaleDateString("de-DE")}</span>
                </div>
                <button type="button" onClick={() => setEntwurf(l)} className="text-left">
                  <div className="font-semibold leading-snug tracking-tight">{l.titel}</div>
                  {l.erkenntnis && <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{l.erkenntnis}</p>}
                  {l.konsequenz && (
                    <p className="mt-3 rounded-xl bg-accent-soft/60 px-3 py-2 text-sm text-accent-strong">
                      <span className="font-medium">Konsequenz:</span> {l.konsequenz}
                    </p>
                  )}
                </button>
                <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
                  <span className="text-xs text-ink-3">
                    {l.faelle.length ? `${l.faelle.length} ${l.faelle.length === 1 ? "Fall" : "Fälle"}` : "Kein Fall verknüpft"}
                  </span>
                  <div className="ml-auto flex gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(lessonAlsMarkdown(l, fallRefs))} aria-label="Für Obsidian kopieren">
                      <Copy className="size-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => confirm("Lesson löschen?") && loescheLesson(l.id)} aria-label="Löschen">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
