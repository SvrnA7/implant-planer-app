import type { Fall, Lesson } from "../domain";
import type { DataStore } from "./types";

// Spricht nur mit der eigenen API-Route. Adresse und Zugangsdaten des Laborservers
// bleiben serverseitig (Vercel-Umgebungsvariablen) und erreichen nie den Browser.
async function call<T>(pfad: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/lab/${pfad}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Laborserver antwortet mit ${res.status}`);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const remoteStore: DataStore = {
  art: "labor",
  listFaelle: () => call<Fall[]>("faelle"),
  saveFall: (f) => call<void>(`faelle/${encodeURIComponent(f.id)}`, { method: "PUT", body: JSON.stringify(f) }),
  deleteFall: (id) => call<void>(`faelle/${encodeURIComponent(id)}`, { method: "DELETE" }),
  listLessons: () => call<Lesson[]>("lessons"),
  saveLesson: (l) => call<void>(`lessons/${encodeURIComponent(l.id)}`, { method: "PUT", body: JSON.stringify(l) }),
  deleteLesson: (id) => call<void>(`lessons/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
