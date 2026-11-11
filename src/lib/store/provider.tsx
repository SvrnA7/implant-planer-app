"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Fall, Lesson } from "../domain";
import { localStore } from "./local";
import { remoteStore } from "./remote";
import type { DataStore } from "./types";

interface DataContextValue {
  bereit: boolean;
  quelle: DataStore["art"];
  laborStatus: { konfiguriert: boolean; erreichbar: boolean };
  faelle: Fall[];
  lessons: Lesson[];
  speichereFall(f: Fall): Promise<void>;
  loescheFall(id: string): Promise<void>;
  speichereLesson(l: Lesson): Promise<void>;
  loescheLesson(id: string): Promise<void>;
  neuLaden(): Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<DataStore>(localStore);
  const [laborStatus, setLaborStatus] = useState({ konfiguriert: false, erreichbar: false });
  const [faelle, setFaelle] = useState<Fall[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [bereit, setBereit] = useState(false);

  const laden = useCallback(async (s: DataStore) => {
    const [f, l] = await Promise.all([s.listFaelle(), s.listLessons()]);
    setFaelle(f.sort((a, b) => b.geaendert.localeCompare(a.geaendert)));
    setLessons(l.sort((a, b) => b.datum.localeCompare(a.datum)));
  }, []);

  useEffect(() => {
    let aktiv = true;
    (async () => {
      let gewaehlt: DataStore = localStore;
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const s = (await res.json()) as { labor: boolean; erreichbar?: boolean };
        if (!aktiv) return;
        setLaborStatus({ konfiguriert: s.labor, erreichbar: !!s.erreichbar });
        if (s.labor && s.erreichbar) gewaehlt = remoteStore;
      } catch {
        /* ohne API (z. B. lokal statisch) bleibt der Browser-Speicher aktiv */
      }
      setStore(gewaehlt);
      try {
        await laden(gewaehlt);
      } catch {
        gewaehlt = localStore;
        setStore(localStore);
        await laden(localStore);
      }
      if (aktiv) setBereit(true);
    })();
    return () => {
      aktiv = false;
    };
  }, [laden]);

  const value = useMemo<DataContextValue>(
    () => ({
      bereit,
      quelle: store.art,
      laborStatus,
      faelle,
      lessons,
      async speichereFall(f) {
        const neu = { ...f, geaendert: new Date().toISOString() };
        setFaelle((alt) => [neu, ...alt.filter((x) => x.id !== f.id)]);
        await store.saveFall(neu);
      },
      async loescheFall(id) {
        setFaelle((alt) => alt.filter((x) => x.id !== id));
        await store.deleteFall(id);
      },
      async speichereLesson(l) {
        setLessons((alt) => [l, ...alt.filter((x) => x.id !== l.id)]);
        await store.saveLesson(l);
      },
      async loescheLesson(id) {
        setLessons((alt) => alt.filter((x) => x.id !== id));
        await store.deleteLesson(id);
      },
      neuLaden: () => laden(store),
    }),
    [bereit, store, laborStatus, faelle, lessons, laden],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData außerhalb von DataProvider");
  return ctx;
}
