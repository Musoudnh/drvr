/*
  # Create User Navigation Preferences System

  1. New Tables
    - `user_navigation_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `hidden_items` (jsonb, array of hidden navigation paths)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_navigation_preferences` table
    - Add policy for users to read their own preferences
    - Add policy for users to insert their own preferences
    - Add policy for users to update their own preferences

  3. Notes
    - Each user can have one preferences record
    - Hidden items stored as JSON array of navigation paths
    - Defaults to empty array (all items visible)
*/

CREATE TABLE IF NOT EXISTS user_navigation_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hidden_items jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE user_navigation_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own navigation preferences"
  ON user_navigation_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own navigation preferences"
  ON user_navigation_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own navigation preferences"
  ON user_navigation_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_navigation_preferences_user_id 
  ON user_navigation_preferences(user_id);
