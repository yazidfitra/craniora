ALTER TABLE exam_sets ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS author_name TEXT;
