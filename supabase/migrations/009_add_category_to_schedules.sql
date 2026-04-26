ALTER TABLE schedules ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'KP';
-- category: KP (Kuliah Pengantar), KK (Keterampilan Klinis), Tutorial, Praktikum, MKU, Pleno
-- For Pleno: lecturer field stores multiple names separated by semicolons
