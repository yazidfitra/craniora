"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Loader2, Upload, ChevronRight, ImagePlus, X } from "lucide-react";

interface QuestionForm {
  question_text: string;
  image_url: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
}

const emptyQuestion: QuestionForm = {
  question_text: "",
  image_url: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  option_e: "",
  correct_answer: "a",
  explanation: "",
};

export default function CreateExamPage() {
  const router = useRouter();
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Anatomy");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState("60");
  const [questions, setQuestions] = useState<QuestionForm[]>([{ ...emptyQuestion }]);
  const [loading, setLoading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (index: number, field: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, { ...emptyQuestion }]);
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) { setError("File harus berupa gambar."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Ukuran gambar maksimal 5MB."); return; }

    setUploadingIdx(index);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "exam-images");

    const res = await fetch("/api/upload-image", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      updateQuestion(index, "image_url", url);
    } else {
      setError("Gagal upload gambar.");
    }
    setUploadingIdx(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) { setError("Judul wajib diisi."); return; }
    const validQs = questions.filter((q) => q.question_text.trim() && q.option_a.trim() && q.option_b.trim());
    if (validQs.length === 0) { setError("Minimal 1 soal lengkap."); return; }

    setLoading(true);
    const res = await fetch("/api/exams/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description, category, difficulty,
        duration_minutes: parseInt(duration) || 60,
        questions: validQs,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal membuat bank soal.");
      setLoading(false);
      return;
    }
    router.push("/dashboard/tasks");
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs">
        <span className="font-bold">Q-BANK</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary-400 font-bold">CONTRIBUTE</span>
      </div>
      <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container mb-1">
        Upload Bank Soal
      </h2>
      <p className="text-sm text-on-surface-variant mb-8">
        Bantu teman-teman dengan kontribusi soal latihan berkualitas.
      </p>

      {error && (
        <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-card p-6 rounded-xl border border-primary-50 shadow-sm space-y-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Judul Bank Soal</label>
            <input className="w-full px-4 py-3 bg-secondary-100 border-none rounded-lg text-base focus:ring-2 focus:ring-primary-400 outline-none" placeholder="Cardiology: EKG Interpretation" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
          </div>
          <div className="bg-surface-card p-6 rounded-xl border border-primary-50 shadow-sm space-y-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Kategori</label>
            <select className="w-full px-4 py-3 bg-secondary-container border-none rounded-lg text-base focus:ring-2 focus:ring-primary-400 outline-none" value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
              {["Anatomy", "Biochemistry", "Cardiology", "Neurology", "Pathology", "Pharmacology", "Lainnya"].map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-card p-6 rounded-xl border border-primary-50 shadow-sm space-y-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Tingkat Kesulitan</label>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button key={d} type="button" onClick={() => setDifficulty(d)} className={`flex-1 text-center py-2 rounded-lg text-sm font-medium border transition-all ${difficulty === d ? "bg-primary-container text-white border-primary-container" : "border-primary-50 text-secondary hover:border-primary-400"}`}>
                  {d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard"}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-surface-card p-6 rounded-xl border border-primary-50 shadow-sm space-y-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Durasi (menit)</label>
            <input type="number" className="w-full px-4 py-3 bg-secondary-100 border-none rounded-lg text-base focus:ring-2 focus:ring-primary-400 outline-none" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={loading} />
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, idx) => (
          <div key={idx} className="bg-surface-card p-6 rounded-xl border border-primary-50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary-400 font-bold uppercase tracking-wider">Soal #{idx + 1}</span>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(idx)} className="p-1 text-error hover:bg-error/5 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <textarea
              className="w-full px-4 py-3 bg-background border border-primary-50 rounded-lg text-base focus:ring-2 focus:ring-primary-400 outline-none resize-none"
              placeholder="Tulis soal di sini..."
              rows={3}
              value={q.question_text}
              onChange={(e) => updateQuestion(idx, "question_text", e.target.value)}
              disabled={loading}
            />

            {/* Image Upload */}
            <div>
              <input
                ref={(el) => { fileInputRefs.current[idx] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(idx, file);
                  e.target.value = "";
                }}
              />
              {q.image_url ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-container border border-primary-50">
                  <Image src={q.image_url} alt="Gambar soal" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => updateQuestion(idx, "image_url", "")}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[idx]?.click()}
                  disabled={uploadingIdx === idx}
                  className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-outline-variant rounded-lg text-sm text-secondary hover:border-primary-400 hover:text-primary-400 transition-all disabled:opacity-50"
                >
                  {uploadingIdx === idx ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Mengupload...</>
                  ) : (
                    <><ImagePlus className="w-4 h-4" /> Tambah Gambar Soal</>
                  )}
                </button>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {(["a", "b", "c", "d", "e"] as const).map((opt) => (
                <div key={opt} className="flex items-center gap-3">
                  <input type="radio" name={`correct_${idx}`} checked={q.correct_answer === opt} onChange={() => updateQuestion(idx, "correct_answer", opt)} className="w-5 h-5 text-primary-400" disabled={loading} />
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-primary-400 text-sm">{opt.toUpperCase()}.</span>
                    <input className="w-full bg-secondary-100 border-none rounded-lg text-sm py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-400 outline-none" placeholder={`Opsi ${opt.toUpperCase()}${opt === "e" ? " (opsional)" : ""}`} value={q[`option_${opt}` as keyof QuestionForm]} onChange={(e) => updateQuestion(idx, `option_${opt}`, e.target.value)} disabled={loading} />
                  </div>
                </div>
              ))}
            </div>

            <textarea
              className="w-full px-4 py-3 bg-background border border-primary-50 rounded-lg text-base focus:ring-2 focus:ring-primary-400 outline-none resize-none"
              placeholder="Penjelasan jawaban (opsional)..."
              rows={2}
              value={q.explanation}
              onChange={(e) => updateQuestion(idx, "explanation", e.target.value)}
              disabled={loading}
            />
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="w-full flex items-center justify-center gap-2 bg-secondary-container text-primary-container py-4 rounded-xl font-semibold border border-primary-50 hover:bg-secondary-fixed transition-all active:scale-[0.98]">
          <Plus className="w-5 h-5" /> Tambah Soal Lagi
        </button>

        <button type="submit" disabled={loading} className="w-full bg-primary-container text-white py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          {loading ? "Menyimpan..." : "Submit Bank Soal"}
        </button>
      </form>
    </main>
  );
}
