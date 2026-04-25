-- Tambah kolom notes dan material_url ke tabel schedules
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS material_url TEXT;
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS material_name TEXT;
