export interface ExamSet {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
  question_count: number;
  created_at: string;
}

export interface ExamQuestion {
  id: string;
  exam_set_id: string;
  question_text: string;
  image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  option_e: string | null;
  correct_answer: string;
  explanation: string | null;
  sort_order: number;
}

export interface ExamAttempt {
  id: string;
  user_id: string;
  exam_set_id: string;
  answers: Record<string, string>;
  score: number | null;
  total_questions: number | null;
  started_at: string;
  finished_at: string | null;
  is_completed: boolean;
}

export const DIFFICULTY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: "Easy", color: "text-success", bg: "bg-success/10" },
  medium: { label: "Medium", color: "text-warning", bg: "bg-warning/10" },
  hard: { label: "Hard", color: "text-error", bg: "bg-error/10" },
};
