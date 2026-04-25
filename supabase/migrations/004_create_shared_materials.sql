-- Tabel shared materials (Berbagi Ilmu)
CREATE TABLE IF NOT EXISTS shared_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'notes',
  -- category: 'notes', 'questions', 'flashcards'
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  author_name TEXT,
  page_count INTEGER,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shared_materials_user ON shared_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_materials_category ON shared_materials(category);
CREATE INDEX IF NOT EXISTS idx_shared_materials_created ON shared_materials(created_at DESC);

ALTER TABLE shared_materials ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can view all shared materials
CREATE POLICY "Anyone can view shared materials"
  ON shared_materials FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own
CREATE POLICY "Users can insert own materials"
  ON shared_materials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own
CREATE POLICY "Users can delete own materials"
  ON shared_materials FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON shared_materials TO authenticated;
GRANT ALL ON shared_materials TO service_role;
