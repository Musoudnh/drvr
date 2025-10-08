/*
  # Create Compensation History Table
  
  Tracks compensation changes over time for each employee.
*/

CREATE TABLE IF NOT EXISTS compensation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  base_salary numeric DEFAULT 0,
  hourly_rate numeric DEFAULT 0,
  pay_frequency text DEFAULT 'Bi-weekly',
  currency text DEFAULT 'USD',
  bonus_eligible boolean DEFAULT false,
  annual_bonus_target numeric DEFAULT 0,
  commission_rate numeric DEFAULT 0,
  overtime_eligible boolean DEFAULT false,
  benefits_package text DEFAULT 'Standard',
  health_insurance_cost numeric DEFAULT 0,
  retirement_match_percent numeric DEFAULT 0,
  pto_days_annual numeric DEFAULT 15,
  equity_shares integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_compensation_history_employee ON compensation_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_compensation_history_user ON compensation_history(user_id);