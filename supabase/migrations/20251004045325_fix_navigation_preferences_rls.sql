/*
  # Fix Navigation Preferences RLS for Demo App

  1. Changes
    - Drop existing restrictive RLS policies
    - Add public access policies for demo purposes
    - Allow any authenticated or anonymous user to read/write preferences
  
  2. Notes
    - This is for demo/development purposes
    - In production, you'd use real Supabase Auth
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own navigation preferences" ON user_navigation_preferences;
DROP POLICY IF EXISTS "Users can insert own navigation preferences" ON user_navigation_preferences;
DROP POLICY IF EXISTS "Users can update own navigation preferences" ON user_navigation_preferences;

-- Create public policies
CREATE POLICY "Allow public read navigation preferences"
  ON user_navigation_preferences
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert navigation preferences"
  ON user_navigation_preferences
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update navigation preferences"
  ON user_navigation_preferences
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete navigation preferences"
  ON user_navigation_preferences
  FOR DELETE
  USING (true);
