"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shell";
import { FallEditor } from "@/components/fall-editor";
import { neuerFall } from "@/lib/domain";
import { useData } from "@/lib/store/provider";

export default function NeuerFallPage() {
  const { faelle, bereit } = useData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fall = useMemo(() => (bereit ? neuerFall(faelle) : null), [bereit]);
  return (
    <>
      <PageHeader eyebrow="Fallnavigator" title="Neuen Fall planen" text="Schritt für Schritt durch Fallgrundlage, Anatomie, Verfahren und Freigabe. Die Empfehlung aktualisiert sich bei jeder Angabe live." />
      {fall && <FallEditor initial={fall} neu />}
    </>
  );
}
