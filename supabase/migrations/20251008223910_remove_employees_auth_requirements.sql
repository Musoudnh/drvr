/*
  # Remove Authentication Requirements from Employees

  This migration removes all authentication and user_id requirements from the employees table
  to allow public access for saving employees without authentication.

  1. Changes
    - Drop all existing RLS policies
    - Make user_id nullable
    - Add public access policies
    - Allow anonymous access to employees table

  2. Security
    - Open access for development/testing
    - No authentication required
*/

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view own employees" ON employees;
DROP POLICY IF EXISTS "Users can insert own employees" ON employees;
DROP POLICY IF EXISTS "Users can update own employees" ON employees;
DROP POLICY IF EXISTS "Users can delete own employees" ON employees;

-- Make user_id nullable
ALTER TABLE employees ALTER COLUMN user_id DROP NOT NULL;

-- Create public access policies
CREATE POLICY "Allow public read access to employees"
  ON employees FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to employees"
  ON employees FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to employees"
  ON employees FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to employees"
  ON employees FOR DELETE
  USING (true);
