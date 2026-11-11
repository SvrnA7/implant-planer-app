import { NextRequest, NextResponse } from "next/server";

// Proxy zum Laborserver. Aktiv, sobald LAB_SERVER_URL gesetzt ist.
// Erlaubt sind nur die Ressourcen "faelle" und "lessons" (optional mit ID).
export const dynamic = "force-dynamic";

const ERLAUBT = new Set(["faelle", "lessons"]);

async function weiterleiten(req: NextRequest, ctx: { params: Promise<{ pfad: string[] }> }) {
  const base = process.env.LAB_SERVER_URL;
  if (!base) return NextResponse.json({ fehler: "Kein Laborserver konfiguriert" }, { status: 501 });

  const { pfad } = await ctx.params;
  if (!pfad.length || pfad.length > 2 || !ERLAUBT.has(pfad[0])) {
    return NextResponse.json({ fehler: "Unbekannte Ressource" }, { status: 404 });
  }
  const ziel = new URL(pfad.map(encodeURIComponent).join("/"), base.endsWith("/") ? base : base + "/");

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.LAB_SERVER_TOKEN) headers.authorization = `Bearer ${process.env.LAB_SERVER_TOKEN}`;

  try {
    const res = await fetch(ziel, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "DELETE" ? undefined : await req.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const body = res.status === 204 ? null : await res.text();
    return new NextResponse(body, { status: res.status, headers: { "content-type": "application/json" } });
  } catch {
    return NextResponse.json({ fehler: "Laborserver nicht erreichbar" }, { status: 502 });
  }
}

export { weiterleiten as GET, weiterleiten as PUT, weiterleiten as DELETE };
