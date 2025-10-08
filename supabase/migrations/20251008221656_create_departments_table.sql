/*
  # Create Departments Table
  
  Creates department table for organizational structure.
*/

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  manager_name text,
  budget_annual numeric DEFAULT 0,
  headcount_target integer DEFAULT 0,
  headcount_current integer DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(name, user_id),
  UNIQUE(code, user_id)
);

CREATE INDEX IF NOT EXISTS idx_departments_user ON departments(user_id);
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);