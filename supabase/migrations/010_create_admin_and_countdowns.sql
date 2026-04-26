-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user ON admin_users(user_id);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- All authenticated users can check if they are admin
CREATE POLICY "Anyone can read admin_users" ON admin_users FOR SELECT TO authenticated USING (true);
-- Only service_role can manage admin_users (via API with service key)

GRANT SELECT ON admin_users TO authenticated;
GRANT ALL ON admin_users TO service_role;

-- Shared exam countdowns table (visible to all, editable by admin only via API)
CREATE TABLE IF NOT EXISTS exam_countdowns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_name TEXT NOT NULL,
  exam_date TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exam_countdowns ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read countdowns
CREATE POLICY "Anyone can read exam_countdowns" ON exam_countdowns FOR SELECT TO authenticated USING (true);
-- Insert/Update/Delete only via service_role (admin check done in API)
CREATE POLICY "Service role manages exam_countdowns" ON exam_countdowns FOR ALL TO service_role USING (true);

GRANT SELECT ON exam_countdowns TO authenticated;
GRANT ALL ON exam_countdowns TO service_role;

-- Enable realtime for exam_countdowns so all clients get live updates
ALTER PUBLICATION supabase_realtime ADD TABLE exam_countdowns;
