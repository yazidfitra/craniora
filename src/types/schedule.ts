export interface Schedule {
  id: string;
  user_id: string;
  subject: string;
  lecturer: string | null;
  day_of_week: number; // 0=Minggu, 1=Senin, ..., 6=Sabtu
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  room: string | null;
  notes: string | null;
  material_url: string | null;
  material_name: string | null;
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
}

export const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
