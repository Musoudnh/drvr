/*
  # Create Payroll Line Items Table
  
  Stores detailed payroll calculations for each employee per run.
*/

CREATE TABLE IF NOT EXISTS payroll_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id uuid NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id),
  regular_hours numeric DEFAULT 0,
  overtime_hours numeric DEFAULT 0,
  pto_hours numeric DEFAULT 0,
  regular_pay numeric DEFAULT 0,
  overtime_pay numeric DEFAULT 0,
  bonus numeric DEFAULT 0,
  commission numeric DEFAULT 0,
  gross_pay numeric DEFAULT 0,
  federal_tax numeric DEFAULT 0,
  state_tax numeric DEFAULT 0,
  social_security numeric DEFAULT 0,
  medicare numeric DEFAULT 0,
  health_insurance numeric DEFAULT 0,
  retirement_401k numeric DEFAULT 0,
  other_deductions numeric DEFAULT 0,
  total_taxes numeric DEFAULT 0,
  total_deductions numeric DEFAULT 0,
  net_pay numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payroll_line_items_run ON payroll_line_items(payroll_run_id);
CREATE INDEX IF NOT EXISTS idx_payroll_line_items_employee ON payroll_line_items(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_line_items_user ON payroll_line_items(user_id);