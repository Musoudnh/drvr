/*
  # Create Tax Rates by State Table
  
  Configures tax rates for different states and years.
*/

CREATE TABLE IF NOT EXISTS tax_rates_by_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  year integer NOT NULL,
  federal_rate numeric DEFAULT 0.22,
  state_rate numeric DEFAULT 0.05,
  social_security_rate numeric DEFAULT 0.062,
  medicare_rate numeric DEFAULT 0.0145,
  sui_rate numeric DEFAULT 0.03,
  futa_rate numeric DEFAULT 0.006,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(state, year, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tax_rates_state_year ON tax_rates_by_state(state, year);
CREATE INDEX IF NOT EXISTS idx_tax_rates_user ON tax_rates_by_state(user_id);