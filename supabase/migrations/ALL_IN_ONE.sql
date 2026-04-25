-- ============================================
-- JALANKAN INI DI SUPABASE SQL EDITOR
-- Ini gabungan SEMUA migration yang dibutuhkan
-- ============================================

-- 1. SHARED MATERIALS
CREATE TABLE IF NOT EXISTS shared_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'notes',
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  author_name TEXT,
  page_count INTEGER,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXAM SETS
CREATE TABLE IF NOT EXISTS exam_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_minutes INTEGER DEFAULT 60,
  question_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXAM QUESTIONS
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_set_id UUID NOT NULL REFERENCES exam_sets(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  image_url TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('a','b','c','d','e')),
  explanation TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 4. EXAM ATTEMPTS
CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_set_id UUID NOT NULL REFERENCES exam_sets(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '{}',
  score INTEGER,
  total_questions INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE
);

-- 5. FLASHCARD DECKS
CREATE TABLE IF NOT EXISTS flashcard_decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  card_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FLASHCARDS
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 7. FLASHCARD PROGRESS
CREATE TABLE IF NOT EXISTS flashcard_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  known BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE shared_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP ALL EXISTING POLICIES (safe cleanup)
-- ============================================
DROP POLICY IF EXISTS "Anyone can view shared materials" ON shared_materials;
DROP POLICY IF EXISTS "Users can insert own materials" ON shared_materials;
DROP POLICY IF EXISTS "Users can delete own materials" ON shared_materials;

DROP POLICY IF EXISTS "Anyone can view exam sets" ON exam_sets;
DROP POLICY IF EXISTS "Users can insert own exam sets" ON exam_sets;
DROP POLICY IF EXISTS "Users can delete own exam sets" ON exam_sets;

DROP POLICY IF EXISTS "Anyone can view exam questions" ON exam_questions;
DROP POLICY IF EXISTS "Owner can manage exam questions" ON exam_questions;

DROP POLICY IF EXISTS "Users can view own attempts" ON exam_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON exam_attempts;
DROP POLICY IF EXISTS "Users can update own attempts" ON exam_attempts;

DROP POLICY IF EXISTS "Anyone can view flashcard decks" ON flashcard_decks;
DROP POLICY IF EXISTS "Users can insert own decks" ON flashcard_decks;
DROP POLICY IF EXISTS "Users can delete own decks" ON flashcard_decks;

DROP POLICY IF EXISTS "Anyone can view flashcards" ON flashcards;
DROP POLICY IF EXISTS "Owner can manage flashcards" ON flashcards;

DROP POLICY IF EXISTS "Users can view own progress" ON flashcard_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON flashcard_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON flashcard_progress;

-- ============================================
-- CREATE POLICIES
-- ============================================

-- shared_materials
CREATE POLICY "Anyone can view shared materials" ON shared_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own materials" ON shared_materials FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own materials" ON shared_materials FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- exam_sets
CREATE POLICY "Anyone can view exam sets" ON exam_sets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own exam sets" ON exam_sets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own exam sets" ON exam_sets FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- exam_questions
CREATE POLICY "Anyone can view exam questions" ON exam_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner can manage exam questions" ON exam_questions FOR INSERT TO authenticated WITH CHECK (true);

-- exam_attempts
CREATE POLICY "Users can view own attempts" ON exam_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON exam_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attempts" ON exam_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- flashcard_decks
CREATE POLICY "Anyone can view flashcard decks" ON flashcard_decks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own decks" ON flashcard_decks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own decks" ON flashcard_decks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- flashcards
CREATE POLICY "Anyone can view flashcards" ON flashcards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner can manage flashcards" ON flashcards FOR INSERT TO authenticated WITH CHECK (true);

-- flashcard_progress
CREATE POLICY "Users can view own progress" ON flashcard_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON flashcard_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON flashcard_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- GRANTS
-- ============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON shared_materials TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON exam_sets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON exam_questions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON exam_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON flashcard_decks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON flashcards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON flashcard_progress TO authenticated;

GRANT ALL ON shared_materials TO service_role;
GRANT ALL ON exam_sets TO service_role;
GRANT ALL ON exam_questions TO service_role;
GRANT ALL ON exam_attempts TO service_role;
GRANT ALL ON flashcard_decks TO service_role;
GRANT ALL ON flashcards TO service_role;
GRANT ALL ON flashcard_progress TO service_role;
