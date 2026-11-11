# Implant Planer · CoDiagnostiX & Falcon

Web-App für die Implantatplanung mit CoDiagnostiX: Fallnavigator mit Live-Empfehlung (statische Bohrschablone oder Straumann Falcon), Risiko-Flags, Freigabe-Checkliste, Falldokumentation, Lessons Learned und das Regelwerk als Wissensbasis.

> Entscheidungsunterstützung, keine klinische Freigabe. Sicherheitsabstände, Sleeve-Offsets und Bohrprotokolle kommen immer aus dem aktuellen Hersteller-IFU.

## Funktionen

- **Fallnavigator** in fünf Schritten (Fall, Anatomie, Verfahren, Freigabe, Dokumentation) mit Empfehlung, Begründung und Flags, die sich live aktualisieren.
- **Falldatenbank** mit Suche, Status-Filtern und Freigabestand.
- **Lessons Learned** mit Status Hypothese → bestätigt → Regel, verknüpfbar mit Fällen.
- **Wissensbasis** aus dem Regelwerk: Workflow, Verfahrenswahl, Anatomie, Schablonendesign, QS-Checkliste, Glossar, Quellen.
- **Obsidian-Export**: Fälle und Lessons als Markdown im Format des Vaults `CoDiagnostiX-Falcon` (Frontmatter wie `99 Vorlagen/Vorlage Fall.md`).
- Hell/Dunkel, Desktop und Smartphone.

## Daten

Ohne weitere Einrichtung speichert die App im Browser des jeweiligen Geräts. Unter **Daten** gibt es Sicherung (JSON), Wiederherstellung und den Obsidian-Export.

Sobald ein Laborserver konfiguriert und erreichbar ist, nutzt die App automatisch ihn. Die Adresse und der Token bleiben serverseitig in Vercel und erreichen nie den Browser: der Browser spricht nur mit `/api/lab/*`, die Route leitet weiter.

## Deploy auf Vercel

1. Auf vercel.com **Add New → Project**, dieses Repo importieren. Framework „Next.js“ wird erkannt, keine weiteren Einstellungen nötig.
2. Deploy. Die App läuft dann im lokalen Modus.

## Laborserver anbinden

In Vercel unter **Settings → Environment Variables** setzen und neu deployen:

| Variable | Bedeutung |
|---|---|
| `LAB_SERVER_URL` | Basis-URL der Labor-API, z. B. `https://planer.labor-xyz.de/api/` |
| `LAB_SERVER_TOKEN` | Geheimer Token, wird als `Authorization: Bearer <token>` mitgeschickt |

Der Server muss von Vercel aus über HTTPS erreichbar sein (öffentliche Adresse, Reverse Proxy oder Tunnel, z. B. Cloudflare Tunnel). Erwartete Schnittstelle, alles JSON:

| Methode | Pfad | Antwort |
|---|---|---|
| `GET` | `/health` | `200`, wenn erreichbar |
| `GET` | `/faelle` | Array aller Fälle (`Fall` aus `src/lib/domain.ts`) |
| `PUT` | `/faelle/{id}` | Fall anlegen oder ersetzen, `204` |
| `DELETE` | `/faelle/{id}` | `204` |
| `GET` | `/lessons` | Array aller Lessons (`Lesson`) |
| `PUT` | `/lessons/{id}` | `204` |
| `DELETE` | `/lessons/{id}` | `204` |

Lokale Fälle vorher unter **Daten → Sicherung herunterladen** sichern; die JSON-Datei enthält `faelle` und `lessons` im selben Format und lässt sich auf dem Server einspielen.

## Entwicklung

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Fachlogik: `src/lib/domain.ts` (Auswertung, Flags, Checkliste), Inhalte des Regelwerks: `src/lib/wissen.ts`, Datenquellen: `src/lib/store/`.
