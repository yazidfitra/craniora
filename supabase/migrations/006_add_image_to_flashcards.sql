-- Tambah kolom image_url ke flashcards
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS image_url TEXT;
