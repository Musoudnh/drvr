/*
  # Allow public access to hiring roles

  1. Changes
    - Drop existing policies
    - Add public access policies
*/

DROP POLICY IF EXISTS "Users can view own hiring roles" ON hiring_roles;
DROP POLICY IF EXISTS "Users can insert own hiring roles" ON hiring_roles;
DROP POLICY IF EXISTS "Users can update own hiring roles" ON hiring_roles;
DROP POLICY IF EXISTS "Users can delete own hiring roles" ON hiring_roles;

CREATE POLICY "Anyone can view hiring roles"
  ON hiring_roles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert hiring roles"
  ON hiring_roles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update hiring roles"
  ON hiring_roles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete hiring roles"
  ON hiring_roles FOR DELETE
  TO public
  USING (true);
