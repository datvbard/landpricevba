-- Migration: Drop redundant 'users' table
-- Keep Better Auth's 'user' table (singular)
-- The 'users' table was from initial schema but conflicts with Better Auth

-- Drop search_history policies that depend on user_id column
DROP POLICY IF EXISTS "Users read own history" ON search_history;
DROP POLICY IF EXISTS "Users insert own history" ON search_history;
DROP POLICY IF EXISTS "Users delete own history" ON search_history;

-- Drop the old foreign key constraint if exists
ALTER TABLE search_history DROP CONSTRAINT IF EXISTS search_history_user_id_fkey;

-- Drop the index on user_id
DROP INDEX IF EXISTS idx_history_user;

-- Better Auth uses TEXT for id, not UUID - change column type
ALTER TABLE search_history ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Recreate the index
CREATE INDEX idx_history_user ON search_history(user_id);

-- Add new foreign key to Better Auth's 'user' table
ALTER TABLE search_history
  ADD CONSTRAINT search_history_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL;

-- Recreate policies for search_history (using TEXT comparison now)
CREATE POLICY "Users read own history" ON search_history
  FOR SELECT USING (user_id = auth.uid()::TEXT);
CREATE POLICY "Users insert own history" ON search_history
  FOR INSERT WITH CHECK (user_id = auth.uid()::TEXT);
CREATE POLICY "Users delete own history" ON search_history
  FOR DELETE USING (user_id = auth.uid()::TEXT);

-- Drop the redundant 'users' table and its policies
DROP POLICY IF EXISTS "Users read own profile" ON users;
DROP POLICY IF EXISTS "Users update own profile" ON users;
DROP TABLE IF EXISTS users CASCADE;
