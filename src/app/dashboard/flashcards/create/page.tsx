"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  Upload,
  FileSpreadsheet,
  X,
  Lightbulb,
  ImagePlus,
} from "lucide-react";

interface CardForm {
  front: string;
  back: string;
  image_url: string;
}

export default function CreateFlashcardsPage() {
  const router = useRouter();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Anatomy & Physiology");
  const [cards, setCards] = useState<CardForm[]>([{ front: "", back: "", image_url: "" }]);
  const [loading, setLoading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvImported, setCsvImported] = useState(false);

  const updateCard = (index: number, field: keyof CardForm, value: string) => {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addCard = () => setCards((prev) => [...prev, { front: "", back: "", image_url: "" }]);
  const removeCard = (index: number) => {
    if (cards.length <= 1) return;
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) { setError("File harus berupa gambar."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Ukuran gambar maksimal 5MB."); return; }

    setUploadingIdx(index);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "flashcard-images");

    const res = await fetch("/api/upload-image", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      updateCard(index, "image_url", url);
    } else {
      setError("Gagal upload gambar.");
    }
    setUploadingIdx(null);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").filter((l) => l.trim());
      const parsed: CardForm[] = [];

      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes("front") && lower.includes("back")) continue;

        let parts: string[];
        if (line.includes(";")) parts = line.split(";").map((s) => s.trim());
        else if (line.includes("\t")) parts = line.split("\t").map((s) => s.trim());
        else parts = line.split(",").map((s) => s.trim());

        if (parts.length >= 2 && parts[0] && parts[1]) {
          const front = parts[0].replace(/^["']|["']$/g, "");
          const back = parts[1].replace(/^["']|["']$/g, "");
          parsed.push({ front, back, image_url: "" });
        }
      }

      if (parsed.length > 0) {
        setCards(parsed);
        setCsvImported(true);
        setError(null);
      } else {
        setError("Tidak ada data valid di file CSV.");
      }
    };
    reader.readAsText(file);
    if (csvInputRef.current) csvInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) { setError("Judul deck wajib diisi."); return; }
    const validCards = cards.filter((c) => c.front.trim() && c.back.trim());
    if (validCards.length === 0) { setError("Minimal 1 kartu lengkap."); return; }

    setLoading(true);
    const res = await fetch("/api/flashcards/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, cards: validCards }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal membuat deck.");
      setLoading(false);
      return;
    }
    router.push("/dashboard/flashcards");
  };

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container mb-1">
        Buat Flashcards
      </h2>
      <p className="text-sm text-on-surface-variant mb-8">
        Buat kartu belajar satu per satu atau upload sekaligus via CSV.
      </p>

      {error && (
        <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deck info */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Nama Deck</label>
          <input className="w-full px-4 py-3 bg-surface-card border border-primary-50 rounded-xl text-base focus:ring-2 focus:ring-primary-400 outline-none" placeholder="Osteology of the Skull" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Kategori</label>
          <select className="w-full px-4 py-3 bg-surface-card border border-primary-50 rounded-xl text-base focus:ring-2 focus:ring-primary-400 outline-none" value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
            {["Anatomy & Physiology", "Pharmacology", "Biochemistry", "Pathology", "Neurology", "Lainnya"].map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>

        {/* Bulk CSV Upload */}
        <div className="bg-primary-50/50 border border-primary-50 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-primary-400" />
            <div>
              <p className="text-sm font-bold text-primary-container">Bulk Upload via CSV</p>
              <p className="text-xs text-secondary">Format: <code className="bg-white px-1 rounded">depan;belakang</code> per baris</p>
            </div>
          </div>
          <input ref={csvInputRef} type="file" accept=".csv,.txt,.tsv" className="hidden" onChange={handleCsvUpload} />
          <button type="button" onClick={() => csvInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary-400/30 rounded-xl text-sm text-primary-400 font-semibold hover:bg-primary-50 transition-all">
            <Upload className="w-4 h-4" />
            {csvImported ? `${cards.length} kartu diimport - Upload lagi?` : "Pilih File CSV"}
          </button>
        </div>

        {csvImported && (
          <div className="flex items-center gap-2 text-sm text-success font-medium">
            <CheckCircle className="w-4 h-4" /> {cards.length} kartu berhasil diimport
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Kartu ({cards.length})</p>

          {cards.map((card, idx) => (
            <div key={idx} className="space-y-0">
              {/* Front */}
              <div className="bg-surface-card rounded-t-xl border border-primary-50 shadow-sm overflow-hidden">
                <div className="bg-secondary-container/30 px-4 py-2 border-b border-primary-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-on-secondary-container uppercase tracking-widest">Front #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {/* Image upload button */}
                    <input
                      ref={(el) => { imageInputRefs.current[idx] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(idx, file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRefs.current[idx]?.click()}
                      disabled={uploadingIdx === idx}
                      className="flex items-center gap-1 text-primary-400 text-xs font-medium hover:text-primary-container transition-colors"
                    >
                      {uploadingIdx === idx ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImagePlus className="w-4 h-4" />
                      )}
                      <span>{card.image_url ? "Ganti" : "Gambar"}</span>
                    </button>
                    {cards.length > 1 && (
                      <button type="button" onClick={() => removeCard(idx)} className="p-1 text-error hover:bg-error/5 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full min-h-[80px] bg-transparent border-none focus:ring-0 text-lg font-[var(--font-heading)] font-semibold text-primary-container placeholder:text-outline-variant resize-none outline-none"
                    placeholder="Istilah atau pertanyaan..."
                    value={card.front}
                    onChange={(e) => updateCard(idx, "front", e.target.value)}
                    disabled={loading}
                  />
                </div>
                {/* Image preview */}
                {card.image_url && (
                  <div className="px-4 pb-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-container border border-primary-50">
                      <Image src={card.image_url} alt="Card image" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => updateCard(idx, "image_url", "")}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Back */}
              <div className="bg-surface-card rounded-b-xl border border-t-0 border-primary-50 shadow-sm overflow-hidden">
                <div className="bg-primary-container/5 px-4 py-2 border-b border-primary-50">
                  <span className="text-[10px] font-bold text-on-secondary-container uppercase tracking-widest">Back</span>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 text-base text-on-surface placeholder:text-outline-variant resize-none outline-none"
                    placeholder="Jawaban atau penjelasan..."
                    value={card.back}
                    onChange={(e) => updateCard(idx, "back", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={addCard} className="w-full flex items-center justify-center gap-2 bg-secondary-100 text-primary-container py-4 rounded-xl font-semibold border border-primary-50 hover:bg-secondary-container transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Tambah Kartu Lagi
        </button>

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary-container text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-primary-400 transition-all active:scale-95 disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          {loading ? "Menyimpan..." : "Finish & Save Deck"}
        </button>
      </form>

      <div className="mt-6 bg-warning/5 border border-warning/20 rounded-xl p-4 flex gap-4">
        <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-on-surface-variant">
          Tip: Untuk input cepat, buat file CSV dengan format <code className="bg-white px-1 rounded text-xs">depan;belakang</code> per baris, lalu upload via Bulk Upload. Gambar bisa ditambahkan manual per kartu.
        </p>
      </div>
    </main>
  );
}
