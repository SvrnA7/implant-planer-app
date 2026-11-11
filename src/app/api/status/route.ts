import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.LAB_SERVER_URL;
  if (!url) return NextResponse.json({ labor: false });
  try {
    const res = await fetch(new URL("health", url.endsWith("/") ? url : url + "/"), {
      headers: process.env.LAB_SERVER_TOKEN ? { authorization: `Bearer ${process.env.LAB_SERVER_TOKEN}` } : {},
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    return NextResponse.json({ labor: true, erreichbar: res.ok });
  } catch {
    return NextResponse.json({ labor: true, erreichbar: false });
  }
}
