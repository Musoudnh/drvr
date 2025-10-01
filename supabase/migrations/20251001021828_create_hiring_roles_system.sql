/*
  # Create Hiring Roles and Compensation System

  1. New Tables
    - `hiring_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `role_name` (text) - Job title
      - `description` (text) - Detailed job description
      - `location_state` (text) - US state for tax calculations
      - `start_date` (date) - Role start date
      - `employment_type` (text) - 'hourly' or 'salary'
      - `worker_classification` (text) - 'w2' or '1099'
      - `hourly_rate` (numeric) - For hourly roles
      - `hours_per_week` (numeric) - For hourly roles
      - `annual_salary` (numeric) - For salary roles
      - `base_compensation` (numeric) - Calculated base annual cost
      - `total_loaded_cost` (numeric) - Calculated fully-loaded cost
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `hiring_role_tax_breakdown`
      - `id` (uuid, primary key)
      - `role_id` (uuid, foreign key to hiring_roles)
      - `tax_type` (text) - Type of tax/cost (e.g., 'Social Security', 'Medicare')
      - `tax_rate` (numeric) - Rate as decimal (e.g., 0.062 for 6.2%)
      - `tax_amount` (numeric) - Calculated dollar amount
      - `created_at` (timestamptz)

    - `state_tax_rates`
      - `id` (uuid, primary key)
      - `state_code` (text, unique) - Two-letter state code
      - `state_name` (text) - Full state name
      - `sui_rate` (numeric) - State unemployment insurance rate
      - `workers_comp_rate` (numeric) - Workers' compensation rate
      - `other_taxes` (jsonb) - Additional state-specific taxes
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own roles
*/

-- Create hiring_roles table
CREATE TABLE IF NOT EXISTS hiring_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role_name text NOT NULL,
  description text DEFAULT '',
  location_state text NOT NULL,
  start_date date NOT NULL,
  employment_type text NOT NULL CHECK (employment_type IN ('hourly', 'salary')),
  worker_classification text NOT NULL CHECK (worker_classification IN ('w2', '1099')),
  hourly_rate numeric(10,2) DEFAULT 0,
  hours_per_week numeric(5,2) DEFAULT 40,
  annual_salary numeric(12,2) DEFAULT 0,
  base_compensation numeric(12,2) DEFAULT 0,
  total_loaded_cost numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hiring_role_tax_breakdown table
CREATE TABLE IF NOT EXISTS hiring_role_tax_breakdown (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES hiring_roles(id) ON DELETE CASCADE NOT NULL,
  tax_type text NOT NULL,
  tax_rate numeric(6,5) DEFAULT 0,
  tax_amount numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create state_tax_rates table
CREATE TABLE IF NOT EXISTS state_tax_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code text UNIQUE NOT NULL,
  state_name text NOT NULL,
  sui_rate numeric(6,5) DEFAULT 0,
  workers_comp_rate numeric(6,5) DEFAULT 0,
  other_taxes jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hiring_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_role_tax_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_tax_rates ENABLE ROW LEVEL SECURITY;

-- Policies for hiring_roles
CREATE POLICY "Users can view own hiring roles"
  ON hiring_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hiring roles"
  ON hiring_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hiring roles"
  ON hiring_roles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hiring roles"
  ON hiring_roles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for hiring_role_tax_breakdown
CREATE POLICY "Users can view tax breakdown for own roles"
  ON hiring_role_tax_breakdown FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hiring_roles
      WHERE hiring_roles.id = hiring_role_tax_breakdown.role_id
      AND hiring_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tax breakdown for own roles"
  ON hiring_role_tax_breakdown FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring_roles
      WHERE hiring_roles.id = hiring_role_tax_breakdown.role_id
      AND hiring_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tax breakdown for own roles"
  ON hiring_role_tax_breakdown FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hiring_roles
      WHERE hiring_roles.id = hiring_role_tax_breakdown.role_id
      AND hiring_roles.user_id = auth.uid()
    )
  );

-- Policies for state_tax_rates (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view state tax rates"
  ON state_tax_rates FOR SELECT
  TO authenticated
  USING (true);

-- Insert common state tax rates (sample data for major states)
INSERT INTO state_tax_rates (state_code, state_name, sui_rate, workers_comp_rate) VALUES
  ('AL', 'Alabama', 0.0065, 0.0225),
  ('AK', 'Alaska', 0.0210, 0.0265),
  ('AZ', 'Arizona', 0.0200, 0.0195),
  ('AR', 'Arkansas', 0.0310, 0.0285),
  ('CA', 'California', 0.0340, 0.0320),
  ('CO', 'Colorado', 0.0170, 0.0215),
  ('CT', 'Connecticut', 0.0310, 0.0395),
  ('DE', 'Delaware', 0.0180, 0.0245),
  ('FL', 'Florida', 0.0027, 0.0265),
  ('GA', 'Georgia', 0.0260, 0.0235),
  ('HI', 'Hawaii', 0.0210, 0.0315),
  ('ID', 'Idaho', 0.0155, 0.0195),
  ('IL', 'Illinois', 0.0315, 0.0285),
  ('IN', 'Indiana', 0.0245, 0.0225),
  ('IA', 'Iowa', 0.0280, 0.0245),
  ('KS', 'Kansas', 0.0260, 0.0215),
  ('KY', 'Kentucky', 0.0270, 0.0265),
  ('LA', 'Louisiana', 0.0180, 0.0395),
  ('ME', 'Maine', 0.0230, 0.0285),
  ('MD', 'Maryland', 0.0280, 0.0245),
  ('MA', 'Massachusetts', 0.0310, 0.0315),
  ('MI', 'Michigan', 0.0260, 0.0235),
  ('MN', 'Minnesota', 0.0310, 0.0295),
  ('MS', 'Mississippi', 0.0140, 0.0265),
  ('MO', 'Missouri', 0.0265, 0.0245),
  ('MT', 'Montana', 0.0180, 0.0285),
  ('NE', 'Nebraska', 0.0225, 0.0215),
  ('NV', 'Nevada', 0.0265, 0.0245),
  ('NH', 'New Hampshire', 0.0270, 0.0265),
  ('NJ', 'New Jersey', 0.0340, 0.0345),
  ('NM', 'New Mexico', 0.0200, 0.0315),
  ('NY', 'New York', 0.0340, 0.0365),
  ('NC', 'North Carolina', 0.0210, 0.0245),
  ('ND', 'North Dakota', 0.0195, 0.0195),
  ('OH', 'Ohio', 0.0270, 0.0235),
  ('OK', 'Oklahoma', 0.0190, 0.0265),
  ('OR', 'Oregon', 0.0240, 0.0295),
  ('PA', 'Pennsylvania', 0.0310, 0.0285),
  ('RI', 'Rhode Island', 0.0310, 0.0315),
  ('SC', 'South Carolina', 0.0190, 0.0245),
  ('SD', 'South Dakota', 0.0120, 0.0195),
  ('TN', 'Tennessee', 0.0210, 0.0235),
  ('TX', 'Texas', 0.0260, 0.0225),
  ('UT', 'Utah', 0.0210, 0.0195),
  ('VT', 'Vermont', 0.0270, 0.0315),
  ('VA', 'Virginia', 0.0240, 0.0245),
  ('WA', 'Washington', 0.0310, 0.0295),
  ('WV', 'West Virginia', 0.0270, 0.0345),
  ('WI', 'Wisconsin', 0.0310, 0.0265),
  ('WY', 'Wyoming', 0.0190, 0.0215)
ON CONFLICT (state_code) DO NOTHING;