export interface Schedule {
  id: string;
  user_id: string;
  subject: string;
  lecturer: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string | null;
  notes: string | null;
  material_url: string | null;
  material_name: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleFormData {
  subject: string;
  lecturer: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  notes: string;
  material_url: string;
  category: string;
}

export const DAY_NAMES = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];

export const SCHEDULE_CATEGORIES = [
  { value: "KP", label: "Kuliah Pengantar (KP)" },
  { value: "KK", label: "Keterampilan Klinis (KK)" },
  { value: "Tutorial", label: "Tutorial" },
  { value: "Praktikum", label: "Praktikum" },
  { value: "MKU", label: "MKU" },
  { value: "Pleno", label: "Pleno" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  KP: "bg-info/10 text-info",
  KK: "bg-success/10 text-success",
  Tutorial: "bg-warning/10 text-warning",
  Praktikum: "bg-error/10 text-error",
  MKU: "bg-primary-50 text-primary-400",
  Pleno: "bg-primary-container/10 text-primary-container",
};
