export interface SharedMaterial {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: "notes" | "questions" | "flashcards";
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  author_name: string | null;
  page_count: number | null;
  views: number;
  downloads: number;
  created_at: string;
}

export interface MaterialFormData {
  title: string;
  description: string;
  category: "notes" | "questions" | "flashcards";
  page_count: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  notes: "Catatan",
  questions: "Bank Soal",
  flashcards: "Flashcards",
};
