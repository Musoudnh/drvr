/*
  # Sales Scenario Drivers System

  ## Overview
  This migration creates a comprehensive sales scenario planning system with advanced revenue drivers
  for modeling complex business scenarios including volume/price splits, customer acquisition,
  retention, conversion funnels, seasonality, and more.

  ## New Tables

  ### 1. `sales_scenarios`
  Stores metadata about sales scenarios
  - `id` (uuid, primary key) - Unique identifier for each scenario
  - `name` (text) - Name of the scenario
  - `description` (text, optional) - Detailed description
  - `scenario_type` (text) - Type: 'revenue', 'sales', 'custom'
  - `base_revenue` (numeric) - Starting revenue baseline
  - `start_month` (text) - Start month for scenario
  - `end_month` (text) - End month for scenario
  - `start_year` (integer) - Start year
  - `end_year` (integer) - End year
  - `created_by` (uuid) - User who created this scenario
  - `created_at` (timestamptz) - When this scenario was created
  - `updated_at` (timestamptz) - Last update timestamp
  - `is_active` (boolean) - Whether this scenario is currently active

  ### 2. `sales_drivers`
  Stores individual sales driver configurations
  - `id` (uuid, primary key) - Unique identifier
  - `scenario_id` (uuid) - References sales_scenarios(id)
  - `driver_type` (text) - Type of driver: 'volume_price', 'cac', 'retention', 'funnel', 'seasonality', 'contract_terms', 'rep_productivity', 'discounting'
  - `driver_name` (text) - Custom name for this driver
  - `is_active` (boolean) - Whether this driver is enabled
  - `start_month` (text) - When driver starts applying
  - `end_month` (text) - When driver stops applying
  - `parameters` (jsonb) - Driver-specific parameters
  - `created_at` (timestamptz) - When driver was created
  - `sort_order` (integer) - Order for display/calculation

  ### 3. `sales_driver_results`
  Caches calculated results for performance
  - `id` (uuid, primary key) - Unique identifier
  - `driver_id` (uuid) - References sales_drivers(id)
  - `month` (text) - Month for this result
  - `year` (integer) - Year for this result
  - `revenue_impact` (numeric) - Revenue impact for this month
  - `volume_impact` (numeric) - Volume/unit impact
  - `price_impact` (numeric) - Price impact
  - `customer_impact` (numeric) - Customer count impact
  - `calculated_at` (timestamptz) - When this was calculated

  ## Security
  - Enable RLS on all tables
  - Users can manage their own scenarios
  - Users can view shared scenarios (future feature)

  ## Indexes
  - Index on scenario_id for fast lookups
  - Index on driver_type for filtering
  - Index on created_at for sorting
  - Composite index on month and year for time-based queries
*/

-- Create sales_scenarios table
CREATE TABLE IF NOT EXISTS sales_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  scenario_type text NOT NULL DEFAULT 'revenue' CHECK (scenario_type IN ('revenue', 'sales', 'custom')),
  base_revenue numeric(15, 2) DEFAULT 0,
  start_month text NOT NULL,
  end_month text NOT NULL,
  start_year integer NOT NULL,
  end_year integer NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create sales_drivers table
CREATE TABLE IF NOT EXISTS sales_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES sales_scenarios(id) ON DELETE CASCADE,
  driver_type text NOT NULL CHECK (driver_type IN (
    'volume_price',
    'cac',
    'retention',
    'funnel',
    'seasonality',
    'contract_terms',
    'rep_productivity',
    'discounting'
  )),
  driver_name text NOT NULL,
  is_active boolean DEFAULT true,
  start_month text NOT NULL,
  end_month text NOT NULL,
  parameters jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  sort_order integer DEFAULT 0
);

-- Create sales_driver_results table
CREATE TABLE IF NOT EXISTS sales_driver_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES sales_drivers(id) ON DELETE CASCADE,
  month text NOT NULL,
  year integer NOT NULL,
  revenue_impact numeric(15, 2) DEFAULT 0,
  volume_impact numeric(15, 2) DEFAULT 0,
  price_impact numeric(15, 2) DEFAULT 0,
  customer_impact numeric(15, 2) DEFAULT 0,
  calculated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_scenarios_created_by ON sales_scenarios(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_scenarios_created_at ON sales_scenarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_scenarios_active ON sales_scenarios(is_active);

CREATE INDEX IF NOT EXISTS idx_sales_drivers_scenario ON sales_drivers(scenario_id);
CREATE INDEX IF NOT EXISTS idx_sales_drivers_type ON sales_drivers(driver_type);
CREATE INDEX IF NOT EXISTS idx_sales_drivers_active ON sales_drivers(is_active);
CREATE INDEX IF NOT EXISTS idx_sales_drivers_sort ON sales_drivers(sort_order);

CREATE INDEX IF NOT EXISTS idx_sales_driver_results_driver ON sales_driver_results(driver_id);
CREATE INDEX IF NOT EXISTS idx_sales_driver_results_period ON sales_driver_results(month, year);

-- Enable Row Level Security
ALTER TABLE sales_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_driver_results ENABLE ROW LEVEL SECURITY;

-- Policies for sales_scenarios
CREATE POLICY "Users can view all sales scenarios"
  ON sales_scenarios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create sales scenarios"
  ON sales_scenarios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their sales scenarios"
  ON sales_scenarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their sales scenarios"
  ON sales_scenarios FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies for sales_drivers
CREATE POLICY "Users can view sales drivers for accessible scenarios"
  ON sales_drivers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales_scenarios
      WHERE id = scenario_id
    )
  );

CREATE POLICY "Users can create sales drivers for their scenarios"
  ON sales_drivers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sales_scenarios
      WHERE id = scenario_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update sales drivers for their scenarios"
  ON sales_drivers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales_scenarios
      WHERE id = scenario_id AND created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sales_scenarios
      WHERE id = scenario_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete sales drivers for their scenarios"
  ON sales_drivers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales_scenarios
      WHERE id = scenario_id AND created_by = auth.uid()
    )
  );

-- Policies for sales_driver_results
CREATE POLICY "Users can view driver results for accessible scenarios"
  ON sales_driver_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales_drivers sd
      JOIN sales_scenarios ss ON sd.scenario_id = ss.id
      WHERE sd.id = driver_id
    )
  );

CREATE POLICY "Users can create driver results for their scenarios"
  ON sales_driver_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sales_drivers sd
      JOIN sales_scenarios ss ON sd.scenario_id = ss.id
      WHERE sd.id = driver_id AND ss.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update driver results for their scenarios"
  ON sales_driver_results FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales_drivers sd
      JOIN sales_scenarios ss ON sd.scenario_id = ss.id
      WHERE sd.id = driver_id AND ss.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sales_drivers sd
      JOIN sales_scenarios ss ON sd.scenario_id = ss.id
      WHERE sd.id = driver_id AND ss.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete driver results for their scenarios"
  ON sales_driver_results FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales_drivers sd
      JOIN sales_scenarios ss ON sd.scenario_id = ss.id
      WHERE sd.id = driver_id AND ss.created_by = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sales_scenario_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS sales_scenarios_updated_at ON sales_scenarios;
CREATE TRIGGER sales_scenarios_updated_at
  BEFORE UPDATE ON sales_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION update_sales_scenario_updated_at();