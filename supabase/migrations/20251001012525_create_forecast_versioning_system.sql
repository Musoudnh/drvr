/*
  # Budget Forecasting System with Version Control
  
  ## Overview
  This migration creates a comprehensive budget forecasting system with full version control capabilities.
  
  ## New Tables
  
  ### 1. `forecast_versions`
  Stores metadata about each saved forecast version
  - `id` (uuid, primary key) - Unique identifier for each version
  - `version_number` (integer) - Sequential version number
  - `year` (integer) - Fiscal year for this forecast
  - `name` (text) - User-friendly name for the version
  - `description` (text, optional) - Description of changes or notes
  - `created_by` (uuid) - User who created this version (references auth.users)
  - `created_at` (timestamptz) - When this version was created
  - `is_active` (boolean) - Whether this is the currently active version
  - `total_forecasted_amount` (numeric) - Total forecast for quick reference
  
  ### 2. `forecast_line_items`
  Stores individual forecast entries for each GL code and month
  - `id` (uuid, primary key) - Unique identifier
  - `version_id` (uuid) - References forecast_versions(id)
  - `gl_code` (text) - General ledger code
  - `gl_name` (text) - GL account name
  - `gl_type` (text) - 'revenue' or 'expense'
  - `month` (text) - Month name (e.g., 'January')
  - `year` (integer) - Year
  - `forecasted_amount` (numeric) - Forecasted amount
  - `actual_amount` (numeric, optional) - Actual amount if actualized
  - `variance` (numeric, optional) - Variance percentage
  - `is_actualized` (boolean) - Whether this entry is actualized
  - `notes` (text, optional) - Any notes for this line item
  - `created_at` (timestamptz) - When this entry was created
  
  ### 3. `forecast_changes_log`
  Audit trail of all changes made
  - `id` (uuid, primary key) - Unique identifier
  - `version_id` (uuid) - References forecast_versions(id)
  - `gl_code` (text) - GL code that was changed
  - `month` (text) - Month that was changed
  - `year` (integer) - Year
  - `old_value` (numeric) - Previous forecasted amount
  - `new_value` (numeric) - New forecasted amount
  - `changed_by` (uuid) - User who made the change
  - `changed_at` (timestamptz) - When the change was made
  - `change_reason` (text, optional) - Reason for the change
  
  ## Security
  - Enable RLS on all tables
  - Create policies for authenticated users to manage their forecasts
  - Create policies for viewing historical versions
  
  ## Indexes
  - Index on version_id for fast lookup
  - Index on gl_code and month for filtering
  - Index on created_at for sorting
*/

-- Create forecast_versions table
CREATE TABLE IF NOT EXISTS forecast_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number integer NOT NULL,
  year integer NOT NULL,
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT false,
  total_forecasted_amount numeric(15, 2) DEFAULT 0,
  CONSTRAINT unique_version_number UNIQUE (year, version_number)
);

-- Create forecast_line_items table
CREATE TABLE IF NOT EXISTS forecast_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid NOT NULL REFERENCES forecast_versions(id) ON DELETE CASCADE,
  gl_code text NOT NULL,
  gl_name text NOT NULL,
  gl_type text NOT NULL CHECK (gl_type IN ('revenue', 'expense')),
  month text NOT NULL,
  year integer NOT NULL,
  forecasted_amount numeric(15, 2) NOT NULL DEFAULT 0,
  actual_amount numeric(15, 2),
  variance numeric(10, 2),
  is_actualized boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_forecast_entry UNIQUE (version_id, gl_code, month, year)
);

-- Create forecast_changes_log table
CREATE TABLE IF NOT EXISTS forecast_changes_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid REFERENCES forecast_versions(id) ON DELETE CASCADE,
  gl_code text NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  old_value numeric(15, 2),
  new_value numeric(15, 2) NOT NULL,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at timestamptz DEFAULT now(),
  change_reason text
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_forecast_line_items_version ON forecast_line_items(version_id);
CREATE INDEX IF NOT EXISTS idx_forecast_line_items_gl_code ON forecast_line_items(gl_code);
CREATE INDEX IF NOT EXISTS idx_forecast_line_items_month_year ON forecast_line_items(month, year);
CREATE INDEX IF NOT EXISTS idx_forecast_versions_year ON forecast_versions(year);
CREATE INDEX IF NOT EXISTS idx_forecast_versions_created_at ON forecast_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forecast_changes_version ON forecast_changes_log(version_id);

-- Enable Row Level Security
ALTER TABLE forecast_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_changes_log ENABLE ROW LEVEL SECURITY;

-- Policies for forecast_versions
CREATE POLICY "Users can view all forecast versions"
  ON forecast_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forecast versions"
  ON forecast_versions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their forecast versions"
  ON forecast_versions FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their forecast versions"
  ON forecast_versions FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies for forecast_line_items
CREATE POLICY "Users can view all forecast line items"
  ON forecast_line_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forecast line items"
  ON forecast_line_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forecast_versions
      WHERE id = version_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update forecast line items"
  ON forecast_line_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forecast_versions
      WHERE id = version_id AND created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forecast_versions
      WHERE id = version_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete forecast line items"
  ON forecast_line_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forecast_versions
      WHERE id = version_id AND created_by = auth.uid()
    )
  );

-- Policies for forecast_changes_log
CREATE POLICY "Users can view all change logs"
  ON forecast_changes_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create change logs"
  ON forecast_changes_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = changed_by);