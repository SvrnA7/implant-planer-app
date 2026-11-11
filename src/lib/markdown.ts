import {
  auswerten,
  CHECKLISTE,
  EMPFEHLUNG_LABEL,
  Fall,
  fallTitel,
  LABELS,
  Lesson,
} from "./domain";

// Erzeugt Notizen im Format des Obsidian-Vaults (Frontmatter wie 99 Vorlagen/Vorlage Fall.md),
// damit Fälle aus der App direkt in "01 Fälle" abgelegt werden können.

const q = (v: string) => (v === "" ? "" : /[:#\[\]{}",]|^\d+$/.test(v) ? JSON.stringify(v) : v);
const liste = (xs: string[]) => `[${xs.map((x) => q(x)).join(", ")}]`;

export function fallAlsMarkdown(f: Fall, lessons: Lesson[] = []): string {
  const a = auswerten(f.befund);
  const b = f.befund;
  const verknuepft = lessons.filter((l) => f.lessons.includes(l.id));
  const fm = [
    "---",
    "typ: fall",
    `fall_id: ${q(f.fallId)}`,
    `datum_planung: ${f.datumPlanung}`,
    `datum_op: ${f.datumOp}`,
    `regio: ${q(f.regio)}`,
    `kiefer: ${f.kiefer}`,
    `versorgungstyp: ${b.versorgungstyp}`,
    `suprakonstruktion_vorhanden: ${b.suprakonstruktion}`,
    `nerv_status: ${b.nerv}`,
    `sinus: ${b.sinus}`,
    `knochenqualitaet: ${b.knochenqualitaet}`,
    `restknochen: ${b.restknochen}`,
    `matching_verifiziert: ${b.matching}`,
    `implantat: ${q(f.implantat)}`,
    `empfehlung_navigator: ${q(EMPFEHLUNG_LABEL[a.empfehlung])}`,
    `verfahren_geplant: ${f.verfahrenGeplant}`,
    `verfahren_durchgefuehrt: ${f.verfahrenDurchgefuehrt}`,
    `fuehrungstyp: ${b.fuehrung === "offen" ? "" : b.fuehrung}`,
    `flags: ${liste([...new Set(a.flags.map((x) => x.key))])}`,
    `chirurg: ${q(f.chirurg)}`,
    `status: ${f.status}`,
    `ergebnis: ${f.ergebnis}`,
    `lessons: ${liste(verknuepft.map((l) => `[[${l.titel}]]`))}`,
    "tags: [fall]",
    "---",
  ].join("\n");

  const zeilen = [
    fm,
    "",
    `# ${fallTitel(f)}`,
    "",
    "## Fallzusammenfassung (Fallnavigator)",
    "",
    `**Empfehlung:** ${EMPFEHLUNG_LABEL[a.empfehlung]}`,
    "",
    `- Versorgungstyp: ${LABELS.versorgungstyp[b.versorgungstyp]}`,
    `- Suprakonstruktion/Set-up: ${LABELS.suprakonstruktion[b.suprakonstruktion]}`,
    `- Nervverlauf: ${LABELS.nerv[b.nerv]}`,
    `- Sinus: ${LABELS.sinus[b.sinus]}`,
    `- Knochenqualität: ${LABELS.knochenqualitaet[b.knochenqualitaet]}`,
    `- Restknochen: ${LABELS.restknochen[b.restknochen]}`,
    `- Matching/Segmentierung: ${LABELS.matching[b.matching]}`,
    `- Falcon: ${LABELS.falconVerfuegbar[b.falconVerfuegbar]}`,
    ...(b.versorgungstyp === "vollbogen" ? [`- Falcon-Freigabe Vollbogen: ${LABELS.vollbogenFreigabe[b.vollbogenFreigabe]}`] : []),
    `- Führungstiefe: ${LABELS.fuehrung[b.fuehrung]}`,
    `- Chirurg-Erfahrung: ${LABELS.chirurgErfahrung[b.chirurgErfahrung]}`,
    `- Zeitfenster: ${LABELS.zeitfenster[b.zeitfenster]}`,
    "",
    "**Risiko-Flags**",
    "",
    ...(a.flags.length ? a.flags.map((x) => `- [${x.sev}] ${x.text}`) : ["- keine"]),
    "",
    "**Freigabe-Checkliste**",
    "",
    ...CHECKLISTE.map((t, i) => `- [${f.checkliste[i] ? "x" : " "}] ${t}`),
    "",
    "## Planungsentscheidungen & Begründung",
    "",
    f.notizen.entscheidungen || "- ",
    "",
    "## Fertigung",
    "",
    f.notizen.fertigung || "- ",
    "",
    "## Ergebnis & Abweichungen (nach OP)",
    "",
    f.notizen.ergebnis || "- ",
    "",
    "## Verknüpfte Lessons",
    "",
    ...(verknuepft.length ? verknuepft.map((l) => `- [[${l.titel}]]`) : ["- "]),
    "",
    "> Entscheidungsunterstützung, keine chirurgische Freigabe. Exakte Maße und Protokolle im aktuellen Hersteller-IFU prüfen.",
    "",
  ];
  return zeilen.join("\n");
}

export function lessonAlsMarkdown(l: Lesson, faelle: { id: string; titel: string }[] = []): string {
  const fl = faelle.filter((f) => l.faelle.includes(f.id)).map((f) => `"[[${f.titel}]]"`);
  return [
    "---",
    "typ: lesson",
    `datum: ${l.datum}`,
    `bereich: ${l.bereich}`,
    `verfahren: ${l.verfahren}`,
    `faelle: [${fl.join(", ")}]`,
    `gilt_als: ${l.giltAls}`,
    "tags: [lesson]",
    "---",
    "",
    `# ${l.titel}`,
    "",
    "## Erkenntnis",
    "",
    l.erkenntnis,
    "",
    "## Kontext",
    "",
    l.kontext,
    "",
    "## Konsequenz für künftige Planungen",
    "",
    l.konsequenz,
    "",
  ].join("\n");
}

export function dateiname(titel: string): string {
  return `${titel.replace(/[\\/:*?"<>|]/g, "-")}.md`;
}

export function herunterladen(name: string, inhalt: string, typ = "text/markdown") {
  const blob = new Blob([inhalt], { type: `${typ};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
