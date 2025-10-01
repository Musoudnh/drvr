/*
  # Create Payroll Employees System

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `employee_type` (text) - 'salary' or 'hourly'
      - `annual_salary` (numeric) - for salaried employees
      - `hourly_rate` (numeric) - for hourly employees
      - `weekly_hours` (numeric) - for hourly employees
      - `state` (text) - for state tax calculations
      - `filing_status` (text) - single, married, etc.
      - `allowances` (integer) - tax allowances
      - `additional_withholding` (numeric) - extra withholding amount
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `payroll_calculations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `employee_id` (uuid, references employees)
      - `calculation_date` (timestamptz)
      - `pay_period_type` (text) - weekly, biweekly, semimonthly, monthly
      - `gross_pay` (numeric)
      - `federal_tax` (numeric)
      - `state_tax` (numeric)
      - `social_security_tax` (numeric)
      - `medicare_tax` (numeric)
      - `other_deductions` (numeric)
      - `net_pay` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  employee_type text NOT NULL CHECK (employee_type IN ('salary', 'hourly')),
  annual_salary numeric(12, 2),
  hourly_rate numeric(8, 2),
  weekly_hours numeric(5, 2),
  state text DEFAULT 'CA',
  filing_status text DEFAULT 'single' CHECK (filing_status IN ('single', 'married', 'head_of_household')),
  allowances integer DEFAULT 0,
  additional_withholding numeric(8, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payroll_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  calculation_date timestamptz DEFAULT now(),
  pay_period_type text NOT NULL CHECK (pay_period_type IN ('weekly', 'biweekly', 'semimonthly', 'monthly')),
  gross_pay numeric(12, 2) NOT NULL,
  federal_tax numeric(12, 2) DEFAULT 0,
  state_tax numeric(12, 2) DEFAULT 0,
  social_security_tax numeric(12, 2) DEFAULT 0,
  medicare_tax numeric(12, 2) DEFAULT 0,
  other_deductions numeric(12, 2) DEFAULT 0,
  net_pay numeric(12, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own employees"
  ON employees FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own employees"
  ON employees FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payroll calculations"
  ON payroll_calculations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payroll calculations"
  ON payroll_calculations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payroll calculations"
  ON payroll_calculations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payroll calculations"
  ON payroll_calculations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS employees_user_id_idx ON employees(user_id);
CREATE INDEX IF NOT EXISTS payroll_calculations_user_id_idx ON payroll_calculations(user_id);
CREATE INDEX IF NOT EXISTS payroll_calculations_employee_id_idx ON payroll_calculations(employee_id);