// Fachliches Modell: entspricht der Fallvorlage im Obsidian-Vault (99 Vorlagen/Vorlage Fall.md)
// und der Logik des Falcon Fallnavigators.

export type Versorgungstyp = "einzelzahn" | "schaltluecke" | "freiend" | "vollbogen";
export type JaNein = "ja" | "nein";
export type NervStatus = "unauffaellig" | "nah" | "unklar";
export type Sinus = "nicht_betroffen" | "ohne_lift" | "mit_lift";
export type Knochenqualitaet = "D1" | "D2" | "D3" | "D4" | "unbekannt";
export type Restknochen = "ausreichend" | "grenzwertig" | "kritisch";
export type VollbogenFreigabe = "unsicher" | "ja" | "nein";
export type Fuehrung = "vollstaendig" | "nur_pilot" | "offen";
export type ChirurgErfahrung = "erfahren" | "wenig" | "keine";
export type Zeitfenster = "normal" | "dringend";
export type Verfahren = "statisch" | "falcon" | "";
export type Status = "planung" | "freigegeben" | "operiert" | "nachkontrolle" | "abgeschlossen";
export type Ergebnis = "" | "wie_geplant" | "kleine_abweichung" | "relevante_abweichung" | "komplikation";

export interface Befund {
  versorgungstyp: Versorgungstyp;
  suprakonstruktion: JaNein;
  nerv: NervStatus;
  sinus: Sinus;
  knochenqualitaet: Knochenqualitaet;
  restknochen: Restknochen;
  matching: JaNein;
  falconVerfuegbar: JaNein;
  vollbogenFreigabe: VollbogenFreigabe;
  fuehrung: Fuehrung;
  chirurgErfahrung: ChirurgErfahrung;
  zeitfenster: Zeitfenster;
}

export interface Fall {
  id: string;
  fallId: string; // JJJJ-NNN, pseudonym
  regio: string;
  kiefer: "OK" | "UK" | "";
  implantat: string;
  chirurg: string;
  datumPlanung: string;
  datumOp: string;
  befund: Befund;
  checkliste: boolean[];
  verfahrenGeplant: Verfahren;
  verfahrenDurchgefuehrt: Verfahren;
  status: Status;
  ergebnis: Ergebnis;
  notizen: {
    entscheidungen: string;
    fertigung: string;
    ergebnis: string;
  };
  lessons: string[];
  erstellt: string;
  geaendert: string;
}

export interface Lesson {
  id: string;
  titel: string;
  erkenntnis: string;
  kontext: string;
  konsequenz: string;
  bereich: LessonBereich;
  verfahren: "statisch" | "falcon" | "beide";
  giltAls: "hypothese" | "bestaetigt" | "regel";
  faelle: string[]; // Fall-IDs
  datum: string;
}

export type LessonBereich =
  | "matching"
  | "segmentierung"
  | "positionierung"
  | "schablonendesign"
  | "fertigung"
  | "falcon"
  | "kommunikation";

export const CHECKLISTE = [
  "Matching/Registrierung an mehreren Referenzpunkten verifiziert",
  "Segmentierung Nerv/Sinus manuell kontrolliert, nicht nur automatisch übernommen",
  "Implantatachse konsistent mit geplanter Suprakonstruktion (Backward Planning)",
  "Sicherheitsabstände zu Risikostrukturen anhand aktueller IFU/Klinikprotokoll geprüft",
  "Kollisionsprüfung zu Nachbarzähnen/-implantaten mit realer Implantatgeometrie",
  "Gewähltes Verfahren passt zu Fall, Praxisausstattung und Freigabesituation",
  "Bei statischer Schablone: Abstützung, Führungstyp, Fenster, Beschriftung final geprüft",
  "Bei Falcon: Referenzmarker passend zur Zahnmorphologie, Kalibrierstatus bekannt",
  "Planung mit behandelndem Chirurgen abgestimmt/freigegeben",
  "Alle fallrelevanten Annahmen (z. B. unklare Bildbereiche) dokumentiert",
];

export const LABELS = {
  versorgungstyp: { einzelzahn: "Einzelzahnlücke", schaltluecke: "Schaltlücke", freiend: "Freiendsituation", vollbogen: "Vollbogen / zahnlos" },
  suprakonstruktion: { ja: "Vorhanden", nein: "Fehlt noch" },
  nerv: { unauffaellig: "Unauffällig", nah: "Kritisch nah", unklar: "Nicht sicher beurteilbar" },
  sinus: { nicht_betroffen: "Nicht betroffen", ohne_lift: "Betroffen, ohne Lift", mit_lift: "Sinusbodenelevation nötig" },
  knochenqualitaet: { D1: "D1 · sehr kompakt", D2: "D2 · kompakt/spongiös", D3: "D3 · überwiegend spongiös", D4: "D4 · gering mineralisiert", unbekannt: "Noch nicht beurteilt" },
  restknochen: { ausreichend: "Ausreichend", grenzwertig: "Grenzwertig", kritisch: "Kritisch" },
  matching: { ja: "Geprüft", nein: "Noch offen" },
  falconVerfuegbar: { ja: "Verfügbar", nein: "Nicht verfügbar" },
  vollbogenFreigabe: { unsicher: "Noch nicht geprüft", ja: "Freigegeben", nein: "Nicht freigegeben" },
  fuehrung: { vollstaendig: "Vollständig geführt", nur_pilot: "Nur Pilotbohrung", offen: "Offen / situativ" },
  chirurgErfahrung: { erfahren: "Erfahren mit Navigation", wenig: "Wenig Navigationserfahrung", keine: "Nur schablonengeführt" },
  zeitfenster: { normal: "Normaler Vorlauf", dringend: "Kurzfristig / dringend" },
  verfahren: { statisch: "Statische Bohrschablone", falcon: "Falcon-Navigation", "": "Noch offen" },
  status: { planung: "Planung", freigegeben: "Freigegeben", operiert: "Operiert", nachkontrolle: "Nachkontrolle", abgeschlossen: "Abgeschlossen" },
  ergebnis: { "": "Noch offen", wie_geplant: "Wie geplant", kleine_abweichung: "Kleine Abweichung", relevante_abweichung: "Relevante Abweichung", komplikation: "Komplikation" },
  lessonBereich: { matching: "Matching", segmentierung: "Segmentierung", positionierung: "Positionierung", schablonendesign: "Schablonendesign", fertigung: "Fertigung", falcon: "Falcon", kommunikation: "Kommunikation" },
  giltAls: { hypothese: "Hypothese", bestaetigt: "Bestätigt", regel: "Regel" },
} as const;

export const STATUS_ORDER: Status[] = ["planung", "freigegeben", "operiert", "nachkontrolle", "abgeschlossen"];

// Kürzel wie in 04 Regelwerk/Risiko-Flags.md
export type FlagKey =
  | "nerv"
  | "sinuslift"
  | "restknochen-kritisch"
  | "matching"
  | "sinus"
  | "restknochen-grenzwertig"
  | "kein-setup"
  | "d4"
  | "vollbogen-freigabe";

export interface Flag {
  key: FlagKey;
  sev: "kritisch" | "beachten";
  text: string;
}

export const FLAG_INFO: Record<FlagKey, { sev: Flag["sev"]; label: string }> = {
  nerv: { sev: "kritisch", label: "Nervnähe" },
  sinuslift: { sev: "kritisch", label: "Sinuslift" },
  "restknochen-kritisch": { sev: "kritisch", label: "Restknochen kritisch" },
  matching: { sev: "kritisch", label: "Matching offen" },
  sinus: { sev: "beachten", label: "Sinus betroffen" },
  "restknochen-grenzwertig": { sev: "beachten", label: "Restknochen grenzwertig" },
  "kein-setup": { sev: "beachten", label: "Kein Set-up" },
  d4: { sev: "beachten", label: "D4-Knochen" },
  "vollbogen-freigabe": { sev: "beachten", label: "Vollbogen-Freigabe" },
};

export type Empfehlung = "rueckfrage" | "statisch" | "tendenz_statisch" | "tendenz_falcon" | "offen";

export const EMPFEHLUNG_LABEL: Record<Empfehlung, string> = {
  rueckfrage: "Rückfrage Chirurg vor Verfahrenswahl",
  statisch: "Statische Bohrschablone",
  tendenz_statisch: "Tendenz: Statische Bohrschablone",
  tendenz_falcon: "Tendenz: Falcon-Navigation",
  offen: "Beide Verfahren möglich · Teamentscheidung",
};

export interface Auswertung {
  flags: Flag[];
  proStatisch: string[];
  proFalcon: string[];
  empfehlung: Empfehlung;
  kritisch: boolean;
}

export function auswerten(b: Befund): Auswertung {
  const flags: Flag[] = [];
  if (b.nerv === "nah") flags.push({ key: "nerv", sev: "kritisch", text: "Nervverlauf kritisch nah. Sicherheitsabstand gegen aktuelles IFU/Protokoll prüfen, Rückfrage Chirurg vor Fertigung." });
  if (b.nerv === "unklar") flags.push({ key: "nerv", sev: "kritisch", text: "Nervverlauf nicht sicher beurteilbar. Bildqualität und Segmentierung prüfen, konservativ planen." });
  if (b.sinus === "mit_lift") flags.push({ key: "sinuslift", sev: "kritisch", text: "Sinusbodenelevation nötig. Eigenständige Eingriffsplanung, nicht als Standardfall durchplanen." });
  if (b.sinus === "ohne_lift") flags.push({ key: "sinus", sev: "beachten", text: "Sinus betroffen. Bodenverlauf, Septen und Schleimhautbefund gezielt gegenprüfen." });
  if (b.restknochen === "kritisch") flags.push({ key: "restknochen-kritisch", sev: "kritisch", text: "Restknochenangebot kritisch. Rückfrage Chirurg vor Weiterplanung empfohlen." });
  if (b.restknochen === "grenzwertig") flags.push({ key: "restknochen-grenzwertig", sev: "beachten", text: "Restknochenangebot grenzwertig. Planung besonders sorgfältig gegenprüfen." });
  if (b.matching === "nein") flags.push({ key: "matching", sev: "kritisch", text: "Matching/Segmentierung noch nicht manuell verifiziert. Die Implantatposition steht auf ungeprüfter Grundlage." });
  if (b.suprakonstruktion === "nein") flags.push({ key: "kein-setup", sev: "beachten", text: "Keine Suprakonstruktion/Set-up als Grundlage. Backward Planning noch nicht vollständig möglich." });
  if (b.knochenqualitaet === "D4") flags.push({ key: "d4", sev: "beachten", text: "D4-Knochenqualität. Erwartung an Primärstabilität und ggf. Bohrprotokoll-Anpassung mit Chirurg abstimmen." });
  if (b.versorgungstyp === "vollbogen" && b.falconVerfuegbar === "ja" && b.vollbogenFreigabe !== "nein")
    flags.push({ key: "vollbogen-freigabe", sev: "beachten", text: "Vollbogen + Falcon: aktuellen Freigabestatus für diese Indikation vor Fallannahme verifizieren." });

  const proStatisch: string[] = [];
  const proFalcon: string[] = [];
  let zwingendStatisch = false;

  if (b.falconVerfuegbar === "nein") {
    zwingendStatisch = true;
    proStatisch.push("Falcon-System am Behandlungsort nicht verfügbar.");
  } else {
    if (b.versorgungstyp === "vollbogen" && b.vollbogenFreigabe !== "ja") proStatisch.push("Vollbogen: Falcon-Freigabe für diese Indikation nicht bestätigt.");
    if (b.fuehrung === "vollstaendig") proStatisch.push("Vollständig geführte Insertion über alle Bohrstufen gewünscht.");
    if (b.chirurgErfahrung === "keine") proStatisch.push("Chirurg bisher nur schablonengeführt erfahren.");
    if (b.fuehrung !== "vollstaendig") proFalcon.push("Pilotführung bzw. offene Führungstiefe: intraoperative Flexibilität nutzbar.");
    if (b.zeitfenster === "dringend") proFalcon.push("Kurzfristiges Zeitfenster: kein Vorlauf für Schablonenfertigung nötig.");
    if (b.chirurgErfahrung === "erfahren") proFalcon.push("Chirurg mit dynamischer Navigation erfahren.");
  }

  const kritisch = flags.some((f) => f.sev === "kritisch");
  let empfehlung: Empfehlung;
  if (kritisch) empfehlung = "rueckfrage";
  else if (zwingendStatisch) empfehlung = "statisch";
  else if (proStatisch.length > proFalcon.length) empfehlung = "tendenz_statisch";
  else if (proFalcon.length > proStatisch.length) empfehlung = "tendenz_falcon";
  else empfehlung = "offen";

  return { flags, proStatisch, proFalcon, empfehlung, kritisch };
}

export const DEFAULT_BEFUND: Befund = {
  versorgungstyp: "einzelzahn",
  suprakonstruktion: "ja",
  nerv: "unauffaellig",
  sinus: "nicht_betroffen",
  knochenqualitaet: "D2",
  restknochen: "ausreichend",
  matching: "ja",
  falconVerfuegbar: "ja",
  vollbogenFreigabe: "unsicher",
  fuehrung: "offen",
  chirurgErfahrung: "wenig",
  zeitfenster: "normal",
};

export function heute(): string {
  return new Date().toISOString().slice(0, 10);
}

export function neueId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function naechsteFallId(faelle: Fall[]): string {
  const jahr = new Date().getFullYear();
  const max = faelle
    .map((f) => f.fallId.match(new RegExp(`^${jahr}-(\\d{3})$`)))
    .filter(Boolean)
    .map((m) => parseInt(m![1], 10))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${jahr}-${String(max + 1).padStart(3, "0")}`;
}

export function neuerFall(faelle: Fall[]): Fall {
  const jetzt = new Date().toISOString();
  return {
    id: neueId(),
    fallId: naechsteFallId(faelle),
    regio: "",
    kiefer: "",
    implantat: "",
    chirurg: "",
    datumPlanung: heute(),
    datumOp: "",
    befund: { ...DEFAULT_BEFUND },
    checkliste: CHECKLISTE.map(() => false),
    verfahrenGeplant: "",
    verfahrenDurchgefuehrt: "",
    status: "planung",
    ergebnis: "",
    notizen: { entscheidungen: "", fertigung: "", ergebnis: "" },
    lessons: [],
    erstellt: jetzt,
    geaendert: jetzt,
  };
}

export function fallTitel(f: Fall): string {
  return `${f.fallId}${f.regio ? ` Regio ${f.regio}` : ""}`;
}

export function checklisteFortschritt(f: Fall): number {
  return f.checkliste.filter(Boolean).length;
}

export function freigabeBereit(f: Fall): boolean {
  return checklisteFortschritt(f) === CHECKLISTE.length && !auswerten(f.befund).kritisch;
}
