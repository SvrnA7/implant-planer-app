"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Download, Trash2 } from "lucide-react";
import {
  auswerten,
  Befund,
  CHECKLISTE,
  checklisteFortschritt,
  EMPFEHLUNG_LABEL,
  Fall,
  fallTitel,
  freigabeBereit,
  LABELS,
  STATUS_ORDER,
} from "@/lib/domain";
import { dateiname, fallAlsMarkdown, herunterladen } from "@/lib/markdown";
import { useData } from "@/lib/store/provider";
import { Begruendung, EmpfehlungKarte, FlagListe, IfuHinweis } from "./auswertung";
import { Badge, Button, Card, cn, Field, Input, Progress, Segmented, Select, Textarea } from "./ui";

const SCHRITTE = ["Fall", "Anatomie", "Verfahren", "Freigabe", "Dokumentation"] as const;

export function FallEditor({ initial, neu }: { initial: Fall; neu?: boolean }) {
  const router = useRouter();
  const { speichereFall, loescheFall, lessons } = useData();
  const [fall, setFall] = useState<Fall>(initial);
  const [schritt, setSchritt] = useState(0);
  const [gespeichert, setGespeichert] = useState<"" | "speichert" | "ok">("");
  const [kopiert, setKopiert] = useState(false);
  const erstes = useRef(true);

  const a = useMemo(() => auswerten(fall.befund), [fall.befund]);
  const fortschritt = checklisteFortschritt(fall);
  const bereit = freigabeBereit(fall);

  // Bestehende Fälle speichern automatisch
  useEffect(() => {
    if (neu) return;
    if (erstes.current) {
      erstes.current = false;
      return;
    }
    setGespeichert("speichert");
    const t = setTimeout(async () => {
      await speichereFall(fall);
      setGespeichert("ok");
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fall, neu]);

  const set = <K extends keyof Fall>(k: K, v: Fall[K]) => setFall((f) => ({ ...f, [k]: v }));
  const setB = <K extends keyof Befund>(k: K, v: Befund[K]) => setFall((f) => ({ ...f, befund: { ...f.befund, [k]: v } }));
  const setN = (k: keyof Fall["notizen"], v: string) => setFall((f) => ({ ...f, notizen: { ...f.notizen, [k]: v } }));

  async function anlegen() {
    await speichereFall(fall);
    router.replace(`/faelle/${fall.id}`);
  }

  async function loeschen() {
    if (!confirm(`Fall ${fallTitel(fall)} wirklich löschen?`)) return;
    await loescheFall(fall.id);
    router.replace("/faelle");
  }

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(fallAlsMarkdown(fall, lessons));
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1600);
    } catch {}
  }

  const b = fall.befund;

  return (
    <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0">
        {/* Kompakte Empfehlung für schmale Bildschirme, das volle Panel steht unten */}
        <a
          href="#auswertung"
          className={cn(
            "mb-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm xl:hidden",
            a.kritisch ? "bg-critical-soft text-critical" : a.empfehlung === "offen" ? "bg-caution-soft text-caution" : "bg-accent-soft text-accent-strong",
          )}
        >
          <span className="min-w-0 flex-1 truncate font-medium">{EMPFEHLUNG_LABEL[a.empfehlung]}</span>
          <span className="shrink-0 text-xs opacity-80">
            {a.flags.length} {a.flags.length === 1 ? "Flag" : "Flags"} · {fortschritt}/{CHECKLISTE.length}
          </span>
        </a>
        {/* Schritte */}
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1 shadow-soft [scrollbar-width:none]">
          {SCHRITTE.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setSchritt(i)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-colors",
                i === schritt ? "bg-ink font-medium text-surface" : "text-ink-2 hover:bg-surface-3 hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full font-mono text-[10px]",
                  i === schritt ? "bg-surface/20" : i < schritt ? "bg-accent-soft text-accent-strong" : "bg-surface-3",
                )}
              >
                {i < schritt ? <Check className="size-3" /> : i + 1}
              </span>
              {s}
            </button>
          ))}
        </div>

        <Card key={schritt} className="rise p-5 sm:p-7">
          {schritt === 0 && (
            <div className="grid gap-6">
              <StepHead nr="01" titel="Fallgrundlage" text="Pseudonymisiert: nur die eigene Fall-ID, keine Patientendaten." />
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Fall-ID" htmlFor="fallId">
                  <Input id="fallId" value={fall.fallId} onChange={(e) => set("fallId", e.target.value)} className="font-mono" />
                </Field>
                <Field label="Regio (FDI)" htmlFor="regio">
                  <Input id="regio" value={fall.regio} placeholder="z. B. 36 oder 24–26" onChange={(e) => set("regio", e.target.value)} />
                </Field>
                <Field label="Kiefer">
                  <Segmented name="Kiefer" value={fall.kiefer as "OK" | "UK"} onChange={(v) => set("kiefer", v)} options={{ OK: "OK", UK: "UK" } as Record<"OK" | "UK", string>} />
                </Field>
              </div>
              <Field label="Zahnlücke / Versorgungstyp">
                <Segmented name="Versorgungstyp" value={b.versorgungstyp} onChange={(v) => setB("versorgungstyp", v)} options={LABELS.versorgungstyp} />
              </Field>
              <Field label="Suprakonstruktion / Set-up vorhanden?" hint="Grundlage für die prothetisch geführte Planung (Backward Planning)">
                <Segmented name="Suprakonstruktion" value={b.suprakonstruktion} onChange={(v) => setB("suprakonstruktion", v)} options={LABELS.suprakonstruktion} tones={{ nein: "caution" }} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Implantat" htmlFor="implantat" hint="System, Typ, Ø × Länge">
                  <Input id="implantat" value={fall.implantat} onChange={(e) => set("implantat", e.target.value)} />
                </Field>
                <Field label="Chirurg" htmlFor="chirurg" hint="Kürzel genügt">
                  <Input id="chirurg" value={fall.chirurg} onChange={(e) => set("chirurg", e.target.value)} />
                </Field>
                <Field label="Planungsdatum" htmlFor="datum" hint="&nbsp;">
                  <Input id="datum" type="date" value={fall.datumPlanung} onChange={(e) => set("datumPlanung", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {schritt === 1 && (
            <div className="grid gap-6">
              <StepHead nr="02" titel="Anatomische Prüfung" text="Automatisch erkannte Strukturen immer manuell verifizieren." />
              <Field label="Nervverlauf (N. alveolaris inf. / Foramen mentale)">
                <Segmented name="Nerv" value={b.nerv} onChange={(v) => setB("nerv", v)} options={LABELS.nerv} tones={{ unauffaellig: "safe", nah: "critical", unklar: "critical" }} />
              </Field>
              <Field label="Sinus maxillaris" hint="Falls Oberkiefer-Seitenzahnregion">
                <Segmented name="Sinus" value={b.sinus} onChange={(v) => setB("sinus", v)} options={LABELS.sinus} tones={{ nicht_betroffen: "safe", ohne_lift: "caution", mit_lift: "critical" }} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Knochenqualität" hint="Qualitative Einschätzung">
                  <Select value={b.knochenqualitaet} onChange={(v) => setB("knochenqualitaet", v)} options={LABELS.knochenqualitaet} />
                </Field>
                <Field label="Matching & Segmentierung" hint="DVT ↔ Scan an mehreren Punkten geprüft">
                  <Segmented name="Matching" value={b.matching} onChange={(v) => setB("matching", v)} options={LABELS.matching} tones={{ ja: "safe", nein: "critical" }} />
                </Field>
              </div>
              <Field label="Restknochenangebot" hint="Breite und Höhe am geplanten Ort">
                <Segmented name="Restknochen" value={b.restknochen} onChange={(v) => setB("restknochen", v)} options={LABELS.restknochen} tones={{ ausreichend: "safe", grenzwertig: "caution", kritisch: "critical" }} />
              </Field>
            </div>
          )}

          {schritt === 2 && (
            <div className="grid gap-6">
              <StepHead nr="03" titel="Verfahren & Logistik" text="Grundlage für die Tendenz statische Schablone oder Falcon." />
              <Field label="Falcon-System am Behandlungsort">
                <Segmented name="Falcon" value={b.falconVerfuegbar} onChange={(v) => setB("falconVerfuegbar", v)} options={LABELS.falconVerfuegbar} />
              </Field>
              {b.versorgungstyp === "vollbogen" && (
                <Field label="Falcon-Freigabe für Vollbogen geprüft?" hint="Indikationsspektrum wird schrittweise erweitert. Stand vor Fallannahme verifizieren.">
                  <Segmented name="Vollbogen" value={b.vollbogenFreigabe} onChange={(v) => setB("vollbogenFreigabe", v)} options={LABELS.vollbogenFreigabe} tones={{ unsicher: "caution" }} />
                </Field>
              )}
              <Field label="Gewünschte Führungstiefe">
                <Segmented name="Führung" value={b.fuehrung} onChange={(v) => setB("fuehrung", v)} options={LABELS.fuehrung} />
              </Field>
              <Field label="Erfahrung des Chirurgen">
                <Segmented name="Erfahrung" value={b.chirurgErfahrung} onChange={(v) => setB("chirurgErfahrung", v)} options={LABELS.chirurgErfahrung} />
              </Field>
              <Field label="Zeitfenster bis OP">
                <Segmented name="Zeitfenster" value={b.zeitfenster} onChange={(v) => setB("zeitfenster", v)} options={LABELS.zeitfenster} />
              </Field>
              <Field label="Gewähltes Verfahren" hint="Deine Entscheidung nach Abstimmung">
                <Segmented
                  name="Verfahren geplant"
                  value={fall.verfahrenGeplant as "statisch" | "falcon"}
                  onChange={(v) => set("verfahrenGeplant", v)}
                  options={{ statisch: "Statische Bohrschablone", falcon: "Falcon-Navigation" } as Record<"statisch" | "falcon", string>}
                />
              </Field>
            </div>
          )}

          {schritt === 3 && (
            <div className="grid gap-5">
              <StepHead nr="04" titel="Freigabe-Checkliste" text="Alle Punkte vor dem Anstoßen der Fertigung." />
              <Progress value={fortschritt} max={CHECKLISTE.length} tone={bereit ? "safe" : "accent"} />
              <ul className="flex flex-col gap-1">
                {CHECKLISTE.map((t, i) => {
                  const an = fall.checkliste[i];
                  return (
                    <li key={t}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={an}
                        onClick={() => set("checkliste", fall.checkliste.map((x, j) => (j === i ? !x : x)))}
                        className={cn(
                          "group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors",
                          an ? "bg-accent-soft/60" : "hover:bg-surface-3",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-px grid size-5 shrink-0 place-items-center rounded-md border transition-all",
                            an ? "border-accent bg-accent text-accent-ink" : "border-line-2 bg-surface group-hover:border-accent",
                          )}
                        >
                          {an && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                        <span className={cn("leading-snug", an ? "text-ink" : "text-ink-2")}>
                          <span className="mr-2 font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                          {t}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {schritt === 4 && (
            <div className="grid gap-6">
              <StepHead nr="05" titel="Dokumentation & Verlauf" text="Wird beim Export in die Fallnotiz deines Obsidian-Vaults übernommen." />
              <Field label="Status">
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_ORDER.map((s, i) => {
                    const idx = STATUS_ORDER.indexOf(fall.status);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("status", s)}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                          s === fall.status
                            ? "border-accent bg-accent text-accent-ink"
                            : i < idx
                              ? "border-accent-soft bg-accent-soft text-accent-strong"
                              : "border-line text-ink-2 hover:border-line-2",
                        )}
                      >
                        {LABELS.status[s]}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Planungsentscheidungen & Begründung" hint="Warum dieses Verfahren, diese Position, Rückfragen an den Chirurgen, getroffene Annahmen">
                <Textarea value={fall.notizen.entscheidungen} onChange={(e) => setN("entscheidungen", e.target.value)} />
              </Field>
              <Field label="Fertigung" hint="Schablone oder Markerschiene, Material, Drucker, Passkontrolle">
                <Textarea value={fall.notizen.fertigung} onChange={(e) => setN("fertigung", e.target.value)} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="OP-Datum" htmlFor="op">
                  <Input id="op" type="date" value={fall.datumOp} onChange={(e) => set("datumOp", e.target.value)} />
                </Field>
                <Field label="Durchgeführtes Verfahren">
                  <Select value={fall.verfahrenDurchgefuehrt} onChange={(v) => set("verfahrenDurchgefuehrt", v)} options={LABELS.verfahren} />
                </Field>
              </div>
              <Field label="Ergebnis">
                <Segmented name="Ergebnis" value={fall.ergebnis} onChange={(v) => set("ergebnis", v)} options={LABELS.ergebnis} tones={{ wie_geplant: "safe", kleine_abweichung: "caution", relevante_abweichung: "critical", komplikation: "critical" }} />
              </Field>
              <Field label="Ergebnis & Abweichungen" hint="Abweichung Planung ↔ Ist mit Messmethode, Ursache, intraoperative Besonderheiten">
                <Textarea value={fall.notizen.ergebnis} onChange={(e) => setN("ergebnis", e.target.value)} />
              </Field>
              {lessons.length > 0 && (
                <Field label="Verknüpfte Lessons">
                  <div className="flex flex-wrap gap-1.5">
                    {lessons.map((l) => {
                      const an = fall.lessons.includes(l.id);
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => set("lessons", an ? fall.lessons.filter((x) => x !== l.id) : [...fall.lessons, l.id])}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm transition-colors",
                            an ? "border-accent bg-accent-soft text-accent-strong" : "border-line text-ink-2 hover:border-line-2",
                          )}
                        >
                          {l.titel}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
            <Button variant="ghost" onClick={() => setSchritt((s) => Math.max(0, s - 1))} disabled={schritt === 0}>
              <ChevronLeft className="size-4" /> Zurück
            </Button>
            {schritt < SCHRITTE.length - 1 ? (
              <Button variant="primary" onClick={() => setSchritt((s) => s + 1)}>
                Weiter: {SCHRITTE[schritt + 1]} <ChevronRight className="size-4" />
              </Button>
            ) : neu ? (
              <Button variant="primary" onClick={anlegen}>
                <Check className="size-4" /> Fall anlegen
              </Button>
            ) : (
              <span className="text-sm text-ink-3">{gespeichert === "speichert" ? "Speichert…" : "Alle Änderungen gespeichert"}</span>
            )}
          </div>
        </Card>
      </div>

      {/* Ergebnis-Panel */}
      <aside id="auswertung" className="min-w-0 scroll-mt-20 xl:sticky xl:top-6 xl:self-start">
        <Card className="flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-mono text-sm font-medium">{fallTitel(fall)}</div>
              <div className="text-xs text-ink-3">{LABELS.versorgungstyp[b.versorgungstyp]}</div>
            </div>
            <Badge tone={fall.status === "planung" ? "neutral" : "accent"} dot>
              {LABELS.status[fall.status]}
            </Badge>
          </div>
          <EmpfehlungKarte a={a} />
          <FlagListe a={a} />
          <Begruendung a={a} />
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Checkliste</span>
              <span className="tabular text-ink-2">
                {fortschritt}/{CHECKLISTE.length}
              </span>
            </div>
            <Progress value={fortschritt} max={CHECKLISTE.length} tone={bereit ? "safe" : "accent"} />
            <div className={cn("mt-3 flex items-center gap-2 text-sm font-medium", bereit ? "text-safe" : a.kritisch ? "text-critical" : "text-caution")}>
              <span className="size-2 rounded-full bg-current" />
              {bereit ? "Bereit zur Fertigungsfreigabe" : a.kritisch ? "Kritische Flags offen" : "Noch offene Punkte"}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            {neu ? (
              <Button variant="primary" className="flex-1" onClick={anlegen}>
                <Check className="size-4" /> Fall anlegen
              </Button>
            ) : (
              <>
                <Button className="flex-1" onClick={kopieren}>
                  {kopiert ? <Check className="size-4" /> : <Copy className="size-4" />} {kopiert ? "Kopiert" : "Für Obsidian kopieren"}
                </Button>
                <Button aria-label="Als Markdown herunterladen" onClick={() => herunterladen(dateiname(fallTitel(fall)), fallAlsMarkdown(fall, lessons))}>
                  <Download className="size-4" />
                </Button>
                <Button variant="danger" aria-label="Fall löschen" onClick={loeschen}>
                  <Trash2 className="size-4" />
                </Button>
              </>
            )}
          </div>
        </Card>
        <IfuHinweis className="mt-4" />
      </aside>
    </div>
  );
}

function StepHead({ nr, titel, text }: { nr: string; titel: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-accent-soft px-2 py-1 font-mono text-xs text-accent-strong">{nr}</span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{titel}</h2>
        <p className="text-sm text-ink-2">{text}</p>
      </div>
    </div>
  );
}
