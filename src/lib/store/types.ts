import type { Fall, Lesson } from "../domain";

// Gemeinsame Schnittstelle für alle Datenquellen. Heute: Browser-Speicher.
// Später: Laborserver über die API-Route /api/lab (siehe README, Abschnitt "Laborserver").
export interface DataStore {
  readonly art: "lokal" | "labor";
  listFaelle(): Promise<Fall[]>;
  saveFall(f: Fall): Promise<void>;
  deleteFall(id: string): Promise<void>;
  listLessons(): Promise<Lesson[]>;
  saveLesson(l: Lesson): Promise<void>;
  deleteLesson(id: string): Promise<void>;
}
