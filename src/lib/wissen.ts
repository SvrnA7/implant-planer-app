// Inhalte aus dem Regelwerk "Planungsagent CoDiagnostiX & Straumann Falcon" (Stand 14.09.2026,
// ergänzt 20.10.2026). Bei Änderungen am Regelwerk hier mitpflegen.

export const LEITPLANKEN = [
  {
    titel: "Keine erfundenen Zahlenwerte",
    text: "Sleeve-Maße, vertikale Offsets, Bohrer-Stufenlängen und Sicherheitsabstände unterscheiden sich je nach Systemgeneration. Sie kommen immer aus dem aktuellen IFU bzw. Bohrprotokoll, nie aus dem Gedächtnis.",
  },
  {
    titel: "Keine klinische Freigabe",
    text: "Die finale Freigabe von Implantatposition, Bohrschablone und OP-Protokoll liegt beim behandelnden Chirurgen. Die App unterstützt Planung, Entscheidung und Kommunikation.",
  },
  {
    titel: "Rückfrage statt Annahme",
    text: "Fehlen entscheidungsrelevante Informationen wie Knochenqualität, Nachbarstrukturen oder Prothetiktyp, wird nachgefragt statt eine Standardannahme zu unterstellen.",
  },
  {
    titel: "Versionsstand beachten",
    text: "Falcon ist im aktiven Rollout mit wachsendem Indikationsspektrum. Verfügbarkeit, Länder und Indikationen vor Fallannahme an aktueller Straumann-Quelle prüfen.",
  },
];

export const WORKFLOW = [
  { titel: "Datenimport", text: "DVT/CBCT (DICOM) und Intraoral- bzw. Modellscan (STL) importieren. Direkte Anbindungen an gängige IOS-Plattformen." },
  { titel: "Matching", text: "Überlagerung von DVT und STL. Eine der fehleranfälligsten Stellen: ungenaues Matching pflanzt sich direkt in die Implantatposition fort." },
  { titel: "Segmentierung & KI", text: "Automatische Segmentierung, Nervdetektion und Abstandsmessung über den AI Assistant. Erkannte Strukturen immer manuell verifizieren." },
  { titel: "Backward Planning", text: "Ausgangspunkt ist die geplante Suprakonstruktion. Die Achse wird von Kaufläche und Emergenzprofil rückwärts in den Knochen geplant." },
  { titel: "Implantatauswahl", text: "Systemspezifische 3D-Bibliotheken liefern die reale Geometrie für die Kollisionskontrolle mit Nachbarzähnen, Implantaten und Anatomie." },
  { titel: "Schablone oder Marker", text: "Je nach Verfahren physische Bohrschablone mit Hülsen konstruieren oder Planung samt Markerschiene für Falcon vorbereiten." },
  { titel: "Export & Fertigung", text: "Export der Schablonen- bzw. Markergeometrie für Druck oder Fräsung, ggf. Versand über caseXchange an einen Fertigungspartner." },
];

export const VERFAHREN = {
  statisch: {
    name: "Statische Bohrschablone",
    kurz: "Physische Schablone mit Führungshülsen, die die Bohrachse starr vorgibt.",
    sinnvoll: [
      "Hohe Fallzahl oder Serienplanung",
      "Maximale Reproduzierbarkeit ohne Live-Tracking",
      "Kein Navigationssystem am Stuhl",
      "Vollständig geführte Chirurgie über alle Bohrstufen",
    ],
    grenzen: [
      "Keine intraoperative Anpassung bei unerwartetem Befund",
      "Abhängig von exakter Passung, Abstützung und Verwindungsfreiheit",
    ],
  },
  falcon: {
    name: "Straumann Falcon",
    kurz: "Dynamische Navigation: Echtzeit-Tracking über Kamera und intraoralen Patientenmarker, ohne Schablonenkörper.",
    sinnvoll: [
      "Intraoperative Anpassbarkeit der Position",
      "Freie Sicht ohne Schablonenkörper",
      "Kurzfristig einsatzbereit, grundsätzlich Same-Day-fähig",
      "Kalibrierung laut Hersteller nur einmal jährlich",
    ],
    grenzen: [
      "Markerschiene ersetzt keine Bohrschablone, sie dient nur der Referenzierung",
      "Indikationsspektrum im Ausbau, Freigabestatus prüfen",
    ],
  },
};

export const RASTER = [
  "Zahnlückenumfang: Einzelzahn, Schaltlücke, Freiend, zahnlos/Vollbogen",
  "Verfügbarkeit eines Falcon-Systems am Behandlungsort",
  "Erfahrung des Chirurgen mit navigierter vs. schablonengeführter Chirurgie",
  "Vollständig geführte Insertion nötig oder intraoperative Flexibilität gewünscht",
  "Zeitfenster: Schablonenfertigung braucht Vorlauf",
  "Aktueller Falcon-Freigabestatus für die Indikation",
];

export const ANATOMIE = [
  { titel: "N. alveolaris inferior / Foramen mentale", text: "Nervverlauf manuell nachvollziehen, auch wenn automatisch erkannt. Abstand zur Implantatspitze dokumentieren. Bei unsicherer Segmentierung konservativ planen und Rücksprache halten." },
  { titel: "Sinus maxillaris", text: "Bodenverlauf, Septen und Schleimhautbefunde prüfen. Geplante Sinusbodenelevation (intern/extern) in der Planung kennzeichnen." },
  { titel: "Nachbarzähne & Implantate", text: "Kollisionskontrolle mit realer 3D-Geometrie statt nur über die Achse. Wurzelkonvergenz und -divergenz berücksichtigen." },
  { titel: "Knochenqualität", text: "Qualitative Einordnung D1 bis D4 für Erwartung an Primärstabilität und Protokollanpassung. Die Anpassung selbst bleibt chirurgische Entscheidung." },
  { titel: "Weichgewebe & Prothetik", text: "Abstand zur Suprakonstruktion, Emergenzprofil und Durchtrittspunkt okklusal/vestibulär im Sinne des Backward Planning prüfen." },
  { titel: "Erhöhtes Risiko", text: "Sehr schmaler Restknochen, unmittelbare Nervnähe, komplexe Vorchirurgie oder unklare Segmentierung explizit als Rückfragefall kennzeichnen." },
];

export const SCHABLONE = [
  { titel: "Abstützung", text: "Zahn-, schleimhaut- oder knochengetragen je nach Restbezahnung. Schleimhautgetragen: Kompressionsfreiheit und definierte Auflagepunkte." },
  { titel: "Führungstyp", text: "Nur Pilotbohrung oder vollständig geführt, passend zu Erfahrung des Chirurgen und Schwierigkeit des Falls." },
  { titel: "Fenster", text: "Inspektions- und Kühlfenster für Sicht auf das OP-Feld und Kühlmittelzufuhr einplanen." },
  { titel: "Stabilität", text: "Materialstärke ausreichend gegen Verwindung und Bruch. Druckmaterial und Parameter gemäß Freigabe des Sleeve-Herstellers." },
  { titel: "Beschriftung", text: "Fall-ID, Zahnschema-Position, Ausrichtung und Datum gegen Verwechslung." },
  { titel: "Passkontrolle", text: "Virtuelle Passkontrolle bzw. Probeaufsetzen vor Fertigung gegen den Ausgangsscan." },
];

export const GLOSSAR = [
  { begriff: "Backward Planning", text: "Implantatposition wird von der geplanten Suprakonstruktion aus rückwärts geplant, nicht vom vorhandenen Knochen." },
  { begriff: "Matching / Registrierung", text: "Überlagerung von DVT- und Oberflächenscan zu einem gemeinsamen 3D-Modell." },
  { begriff: "Statisch geführte Chirurgie", text: "Implantation mit im Voraus gefertigter Bohrschablone mit Führungshülsen." },
  { begriff: "Dynamische Navigation", text: "Implantation mit Echtzeit-Instrumentenverfolgung über Kameratracking, ohne starre Führung." },
  { begriff: "caseXchange", text: "Plattform zum digitalen Versand von CoDiagnostiX-Fällen an Fertigungspartner." },
  { begriff: "Sleeve / Führungshülse", text: "Hülse in der Schablone, die Achse und ggf. Tiefe vorgibt. Maße und Offsets systemspezifisch laut Herstellerdokument." },
];

export const QUELLEN = [
  { titel: "coDiagnostiX – Digital Dental Implant Planning Software", url: "https://www.straumann.com/us/en/dental-professionals/digital-performance/software/codiagnostix.html" },
  { titel: "coDiagnostiX Instructions for Use (PDF)", url: "https://www.straumann.com/content/dam/media-center/digital/en-us/documents/knowledge-center/codiagnostix/coDiagnostiX-10-IFU-EN-v14.4.pdf" },
  { titel: "Straumann Falcon – Navigate through the invisible", url: "https://www.straumann.com/en/dental-professionals/dental-implants/guided-surgery/straumann-falcon.html" },
  { titel: "Product overview: Straumann Falcon (PDF)", url: "https://www.straumann.com/content/dam/media-center/straumann/en/documents/brochure/product-information/491.026-en_low.pdf" },
  { titel: "Basisinformationen Straumann Guided Surgery (PDF)", url: "https://www.straumann.com/content/dam/media-center/straumann/de-de/documents/brochure/technical-information/straumann_de151753_guided_surgery.pdf" },
  { titel: "Straumann iGuide – Basisinformationen (PDF)", url: "https://www.straumann.com/content/dam/media-center/straumann/de-de/documents/brochure/technical-information/straumann_de707930_iguide.pdf" },
  { titel: "Straumann Smile in a Box – Basisinformationen (PDF)", url: "https://www.straumann.com/content/dam/media-center/straumann/de/documents/brochure/technical-information/704634-de_low.pdf" },
];
