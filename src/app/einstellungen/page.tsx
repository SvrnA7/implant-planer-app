"use client";

import { Database, Download, FileArchive, HardDrive, Server, Upload } from "lucide-react";
import { useRef } from "react";
import { PageHeader } from "@/components/shell";
import { Badge, Button, Card, SectionTitle } from "@/components/ui";
import { fallTitel } from "@/lib/domain";
import { dateiname, fallAlsMarkdown, herunterladen, lessonAlsMarkdown } from "@/lib/markdown";
import { lokaleDatenImport } from "@/lib/store/local";
import { useData } from "@/lib/store/provider";

export default function EinstellungenPage() {
  const { quelle, laborStatus, faelle, lessons, neuLaden } = useData();
  const datei = useRef<HTMLInputElement>(null);

  function sicherung() {
    herunterladen(`implant-planer-sicherung-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ version: 1, faelle, lessons }, null, 2), "application/json");
  }

  function vaultExport() {
    const refs = faelle.map((f) => ({ id: f.id, titel: fallTitel(f) }));
    faelle.forEach((f, i) => setTimeout(() => herunterladen(dateiname(fallTitel(f)), fallAlsMarkdown(f, lessons)), i * 150));
    lessons.forEach((l, i) => setTimeout(() => herunterladen(dateiname(l.titel), lessonAlsMarkdown(l, refs)), (faelle.length + i) * 150));
  }

  async function wiederherstellen(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (!confirm(`${d.faelle?.length ?? 0} Fälle und ${d.lessons?.length ?? 0} Lessons einspielen? Vorhandene lokale Daten werden ersetzt.`)) return;
      lokaleDatenImport(d);
      await neuLaden();
    } catch {
      alert("Die Datei ist keine gültige Sicherung.");
    }
    e.target.value = "";
  }

  return (
    <>
      <PageHeader eyebrow="Einstellungen" title="Daten & Verbindung" text="Wo deine Fälle liegen, wie du sie sicherst und wie der Laborserver angebunden wird." />
      <div className="grid gap-8 px-4 py-6 sm:px-8 xl:grid-cols-2">
        <section>
          <SectionTitle eyebrow="Aktiv" title="Datenquelle" />
          <Card className="divide-y divide-line">
            <Quelle
              icon={<HardDrive className="size-5" />}
              titel="Dieses Gerät"
              text="Fälle und Lessons liegen im Browser-Speicher dieses Geräts. Nichts verlässt den Rechner."
              aktiv={quelle === "lokal"}
            />
            <Quelle
              icon={<Server className="size-5" />}
              titel="Laborserver"
              text={
                laborStatus.konfiguriert
                  ? laborStatus.erreichbar
                    ? "Verbunden. Alle Geräte sehen dieselben Fälle."
                    : "Konfiguriert, aber gerade nicht erreichbar. Die App arbeitet so lange lokal."
                  : "Noch nicht eingerichtet. Sobald LAB_SERVER_URL in Vercel gesetzt ist, verbindet sich die App automatisch."
              }
              aktiv={quelle === "labor"}
              status={laborStatus.konfiguriert ? (laborStatus.erreichbar ? "Online" : "Offline") : "Nicht eingerichtet"}
            />
          </Card>
        </section>

        <section>
          <SectionTitle eyebrow="Sichern & übertragen" title="Export" />
          <Card className="divide-y divide-line">
            <Aktion icon={<Database className="size-5" />} titel="Sicherung herunterladen" text={`${faelle.length} Fälle und ${lessons.length} Lessons als JSON-Datei.`}>
              <Button onClick={sicherung}>
                <Download className="size-4" /> Sichern
              </Button>
            </Aktion>
            <Aktion icon={<Upload className="size-5" />} titel="Sicherung einspielen" text="Stellt Fälle und Lessons aus einer JSON-Sicherung auf diesem Gerät wieder her.">
              <input ref={datei} type="file" accept="application/json" hidden onChange={wiederherstellen} />
              <Button onClick={() => datei.current?.click()} disabled={quelle === "labor"}>
                Einspielen
              </Button>
            </Aktion>
            <Aktion icon={<FileArchive className="size-5" />} titel="Für Obsidian exportieren" text="Jeder Fall und jede Lesson als Markdown-Notiz im Format deines Vaults, bereit für „01 Fälle“ und „02 Lessons Learned“.">
              <Button onClick={vaultExport} disabled={!faelle.length && !lessons.length}>
                <Download className="size-4" /> Notizen
              </Button>
            </Aktion>
          </Card>
        </section>

        <section className="xl:col-span-2">
          <SectionTitle eyebrow="Für später" title="Laborserver anbinden" />
          <Card className="p-5 sm:p-6">
            <ol className="grid gap-4 text-sm text-ink-2 md:grid-cols-3">
              <li>
                <div className="mb-1 font-medium text-ink">1 · Server bereitstellen</div>
                Der Laborserver stellt eine kleine REST-Schnittstelle für <code className="font-mono text-xs">faelle</code> und <code className="font-mono text-xs">lessons</code> bereit. Die genaue Spezifikation steht in der README.
              </li>
              <li>
                <div className="mb-1 font-medium text-ink">2 · In Vercel eintragen</div>
                Unter Settings → Environment Variables <code className="font-mono text-xs">LAB_SERVER_URL</code> und <code className="font-mono text-xs">LAB_SERVER_TOKEN</code> setzen und neu deployen.
              </li>
              <li>
                <div className="mb-1 font-medium text-ink">3 · Lokale Fälle übernehmen</div>
                Vorher hier eine Sicherung ziehen. Die Fälle lassen sich danach auf den Server einspielen.
              </li>
            </ol>
          </Card>
        </section>
      </div>
    </>
  );
}

function Quelle({ icon, titel, text, aktiv, status }: { icon: React.ReactNode; titel: string; text: string; aktiv: boolean; status?: string }) {
  return (
    <div className="flex gap-4 p-5">
      <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${aktiv ? "bg-accent text-accent-ink" : "bg-surface-3 text-ink-3"}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{titel}</span>
          {aktiv && <Badge tone="accent" dot>Aktiv</Badge>}
          {status && !aktiv && <Badge>{status}</Badge>}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{text}</p>
      </div>
    </div>
  );
}

function Aktion({ icon, titel, text, children }: { icon: React.ReactNode; titel: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-3 text-ink-2">{icon}</div>
        <div>
          <div className="font-medium">{titel}</div>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{text}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
