"use client";

import { use } from "react";
import { ArrowLeft, FolderSearch } from "lucide-react";
import { PageHeader } from "@/components/shell";
import { FallEditor } from "@/components/fall-editor";
import { ButtonLink, Empty } from "@/components/ui";
import { fallTitel, LABELS } from "@/lib/domain";
import { useData } from "@/lib/store/provider";

export default function FallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { faelle, bereit } = useData();
  const fall = faelle.find((f) => f.id === id);

  if (!bereit) return null;
  if (!fall)
    return (
      <Empty
        icon={<FolderSearch className="size-5" />}
        title="Fall nicht gefunden"
        text="Der Fall existiert in dieser Datenquelle nicht oder wurde gelöscht."
        action={<ButtonLink href="/faelle">Zur Fallliste</ButtonLink>}
      />
    );

  return (
    <>
      <PageHeader
        eyebrow={`Fall · ${LABELS.status[fall.status]}`}
        title={fallTitel(fall)}
        text={`Geplant am ${new Date(fall.datumPlanung).toLocaleDateString("de-DE")}${fall.implantat ? ` · ${fall.implantat}` : ""}`}
        actions={
          <ButtonLink href="/faelle" variant="ghost">
            <ArrowLeft className="size-4" /> Alle Fälle
          </ButtonLink>
        }
      />
      <FallEditor key={fall.id} initial={fall} />
    </>
  );
}
