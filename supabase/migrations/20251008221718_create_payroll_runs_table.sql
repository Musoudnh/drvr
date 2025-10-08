/*
  # Create Payroll Runs Table
  
  Manages batch payroll processing cycles.
*/

CREATE TABLE IF NOT EXISTS payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_number text NOT NULL,
  pay_period_start date NOT NULL,
  pay_period_end date NOT NULL,
  pay_date date NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  total_gross numeric DEFAULT 0,
  total_taxes numeric DEFAULT 0,
  total_deductions numeric DEFAULT 0,
  total_net numeric DEFAULT 0,
  employee_count integer DEFAULT 0,
  processed_by_name text,
  approved_by_name text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(run_number, user_id)
);

CREATE INDEX IF NOT EXISTS idx_payroll_runs_dates ON payroll_runs(pay_period_start, pay_period_end);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_status ON payroll_runs(status);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_user ON payroll_runs(user_id);