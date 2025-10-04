/*
  # Complete Approval Thresholds System

  1. Tables
    - approval_thresholds: Configure approval requirements based on budget tiers

  2. Security
    - Enable RLS with appropriate policies
*/

-- Create approval_thresholds table
CREATE TABLE IF NOT EXISTS approval_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name text NOT NULL,
  min_amount numeric NOT NULL DEFAULT 0,
  max_amount numeric,
  required_roles text[] NOT NULL DEFAULT '{}',
  approval_order integer NOT NULL DEFAULT 1,
  require_sequential boolean DEFAULT true,
  sla_hours integer DEFAULT 72,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE approval_thresholds ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approval thresholds" ON approval_thresholds;
DROP POLICY IF EXISTS "Authenticated users can manage thresholds" ON approval_thresholds;

-- Create policies
CREATE POLICY "Anyone can view approval thresholds"
  ON approval_thresholds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage thresholds"
  ON approval_thresholds FOR ALL
  TO authenticated
  USING (true);

-- Insert default approval thresholds
INSERT INTO approval_thresholds (tier_name, min_amount, max_amount, required_roles, approval_order, require_sequential, sla_hours)
VALUES
  ('Tier 1: Under $10K', 0, 10000, ARRAY['Department Manager'], 1, false, 48),
  ('Tier 2: $10K - $50K', 10000, 50000, ARRAY['Department Manager', 'Finance Controller'], 2, true, 72),
  ('Tier 3: $50K - $100K', 50000, 100000, ARRAY['Department Manager', 'Finance Controller', 'Department Manager'], 3, true, 120),
  ('Tier 4: Over $100K', 100000, NULL, ARRAY['Department Manager', 'Finance Controller', 'CEO'], 4, true, 168)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_approval_thresholds_amounts ON approval_thresholds(min_amount, max_amount);
