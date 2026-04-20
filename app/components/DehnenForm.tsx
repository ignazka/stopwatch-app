"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Measurement {
  nbp: string;
  bp: string;
}

interface ImageFiles {
  laenge_s_nbp: File | null;
  laenge_s_bp: File | null;
  laenge_e_nbp: File | null;
  laenge_e_bp: File | null;
}

async function uploadImage(file: File, month: string, field: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("month", month);
  formData.append("field", field);
  const res = await fetch("/api/dehnen-progress/image", { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Bild-Upload fehlgeschlagen: ${field}`);
  return `${month}-${field}.jpg`;
}

export function DehnenForm() {
  const today = new Date();
  const isAllowed = today.getDate() >= 19;
  const month = today.toISOString().slice(0, 7);

  const [laengeS, setLaengeS] = useState<Measurement>({ nbp: "", bp: "" });
  const [laengeE, setLaengeE] = useState<Measurement>({ nbp: "", bp: "" });
  const [images, setImages] = useState<ImageFiles>({
    laenge_s_nbp: null,
    laenge_s_bp: null,
    laenge_e_nbp: null,
    laenge_e_bp: null,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  function setImage(field: keyof ImageFiles, file: File | null) {
    setImages((prev) => ({ ...prev, [field]: file }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    try {
      // Alle vorhandenen Bilder hochladen, Dateinamen sammeln
      const uploadedImages: Partial<Record<keyof ImageFiles, string>> = {};
      for (const [field, file] of Object.entries(images)) {
        if (file) {
          uploadedImages[field as keyof ImageFiles] = await uploadImage(file, month, field);
        }
      }

      const res = await fetch("/api/dehnen-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          laenge_s: { nbp: parseFloat(laengeS.nbp), bp: parseFloat(laengeS.bp) },
          laenge_e: { nbp: parseFloat(laengeE.nbp), bp: parseFloat(laengeE.bp) },
          images: Object.keys(uploadedImages).length > 0 ? uploadedImages : undefined,
        }),
      });
      if (!res.ok) throw new Error("Speichern fehlgeschlagen");

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (!isAllowed) {
    return (
      <Card className="mb-4 font-thin w-full max-w-md">
        <CardHeader className="text-foreground text-[1.15em]">{month}</CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm">Messungen sind ab dem 19. des Monats möglich.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 font-thin w-full max-w-md">
      <CardHeader className="text-foreground text-[1.15em]">{month} — Messung erfassen</CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-zinc-400 mb-1">Länge S</legend>
            <div className="flex items-center gap-3">
              <span className="w-10 text-zinc-500">NBP</span>
              <input
                type="number" step="0.1" value={laengeS.nbp} required
                onChange={(e) => setLaengeS((p) => ({ ...p, nbp: e.target.value }))}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-24 font-mono"
              />
              <input type="file" accept="image/*" className="text-xs text-zinc-400"
                onChange={(e) => setImage("laenge_s_nbp", e.target.files?.[0] ?? null)} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-zinc-500">BP</span>
              <input
                type="number" step="0.1" value={laengeS.bp} required
                onChange={(e) => setLaengeS((p) => ({ ...p, bp: e.target.value }))}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-24 font-mono"
              />
              <input type="file" accept="image/*" className="text-xs text-zinc-400"
                onChange={(e) => setImage("laenge_s_bp", e.target.files?.[0] ?? null)} />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-zinc-400 mb-1">Länge E</legend>
            <div className="flex items-center gap-3">
              <span className="w-10 text-zinc-500">NBP</span>
              <input
                type="number" step="0.1" value={laengeE.nbp} required
                onChange={(e) => setLaengeE((p) => ({ ...p, nbp: e.target.value }))}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-24 font-mono"
              />
              <input type="file" accept="image/*" className="text-xs text-zinc-400"
                onChange={(e) => setImage("laenge_e_nbp", e.target.files?.[0] ?? null)} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-zinc-500">BP</span>
              <input
                type="number" step="0.1" value={laengeE.bp} required
                onChange={(e) => setLaengeE((p) => ({ ...p, bp: e.target.value }))}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-24 font-mono"
              />
              <input type="file" accept="image/*" className="text-xs text-zinc-400"
                onChange={(e) => setImage("laenge_e_bp", e.target.files?.[0] ?? null)} />
            </div>
          </fieldset>
        </CardContent>

        <CardFooter className="flex items-center gap-4">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Speichern…" : "Speichern"}
          </Button>
          {status === "done" && <span className="text-green-400 text-sm">Gespeichert.</span>}
          {status === "error" && <span className="text-red-400 text-sm">Fehler beim Speichern.</span>}
        </CardFooter>
      </form>
    </Card>
  );
}
