import type { Fall, Lesson } from "../domain";
import type { DataStore } from "./types";

const KEY_FAELLE = "cdx-planer:faelle:v1";
const KEY_LESSONS = "cdx-planer:lessons:v1";

function lesen<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function schreiben<T>(key: string, daten: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(daten));
  } catch {
    /* Speicher voll oder blockiert: Daten bleiben nur für diese Sitzung */
  }
}

function upsert<T extends { id: string }>(key: string, item: T) {
  const alle = lesen<T>(key);
  const i = alle.findIndex((x) => x.id === item.id);
  if (i >= 0) alle[i] = item;
  else alle.unshift(item);
  schreiben(key, alle);
}

export const localStore: DataStore = {
  art: "lokal",
  async listFaelle() {
    return lesen<Fall>(KEY_FAELLE);
  },
  async saveFall(f) {
    upsert(KEY_FAELLE, f);
  },
  async deleteFall(id) {
    schreiben(KEY_FAELLE, lesen<Fall>(KEY_FAELLE).filter((f) => f.id !== id));
  },
  async listLessons() {
    return lesen<Lesson>(KEY_LESSONS);
  },
  async saveLesson(l) {
    upsert(KEY_LESSONS, l);
  },
  async deleteLesson(id) {
    schreiben(KEY_LESSONS, lesen<Lesson>(KEY_LESSONS).filter((l) => l.id !== id));
  },
};

export function lokaleDatenExport() {
  return { faelle: lesen<Fall>(KEY_FAELLE), lessons: lesen<Lesson>(KEY_LESSONS) };
}

export function lokaleDatenImport(d: { faelle?: Fall[]; lessons?: Lesson[] }) {
  if (Array.isArray(d.faelle)) schreiben(KEY_FAELLE, d.faelle);
  if (Array.isArray(d.lessons)) schreiben(KEY_LESSONS, d.lessons);
}
