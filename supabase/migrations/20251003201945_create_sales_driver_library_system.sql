/*
  # Sales Driver Library System

  1. New Tables
    - `driver_templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Driver name
      - `type` (text) - Driver type (volume_price, cac, retention, funnel, etc.)
      - `description` (text)
      - `formula` (text) - Formula definition
      - `input_schema` (jsonb) - Input field definitions
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `driver_instances`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `forecast_version_id` (uuid, references forecast_versions, nullable)
      - `template_id` (uuid, references driver_templates)
      - `name` (text) - Instance name
      - `inputs` (jsonb) - Input values
      - `configuration` (jsonb) - Additional config (period, dependencies, etc.)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `driver_results`
      - `id` (uuid, primary key)
      - `instance_id` (uuid, references driver_instances)
      - `period_type` (text) - 'month' or 'quarter'
      - `period_date` (date) - Start date of period
      - `revenue` (numeric)
      - `customers` (numeric, nullable)
      - `units` (numeric, nullable)
      - `calculated_values` (jsonb) - Additional metrics
      - `created_at` (timestamptz)

    - `driver_dependencies`
      - `id` (uuid, primary key)
      - `parent_instance_id` (uuid, references driver_instances)
      - `child_instance_id` (uuid, references driver_instances)
      - `mapping` (jsonb) - Field mapping config
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own data
*/

-- Create driver_templates table
CREATE TABLE IF NOT EXISTS driver_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  description text,
  formula text NOT NULL,
  input_schema jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE driver_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own driver templates"
  ON driver_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own driver templates"
  ON driver_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own driver templates"
  ON driver_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own driver templates"
  ON driver_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create driver_instances table
CREATE TABLE IF NOT EXISTS driver_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  forecast_version_id uuid REFERENCES forecast_versions,
  template_id uuid REFERENCES driver_templates NOT NULL,
  name text NOT NULL,
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE driver_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own driver instances"
  ON driver_instances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own driver instances"
  ON driver_instances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own driver instances"
  ON driver_instances FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own driver instances"
  ON driver_instances FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create driver_results table
CREATE TABLE IF NOT EXISTS driver_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid REFERENCES driver_instances ON DELETE CASCADE NOT NULL,
  period_type text NOT NULL DEFAULT 'month',
  period_date date NOT NULL,
  revenue numeric NOT NULL DEFAULT 0,
  customers numeric,
  units numeric,
  calculated_values jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(instance_id, period_type, period_date)
);

ALTER TABLE driver_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own driver results"
  ON driver_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_results.instance_id
      AND driver_instances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own driver results"
  ON driver_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_results.instance_id
      AND driver_instances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own driver results"
  ON driver_results FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_results.instance_id
      AND driver_instances.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_results.instance_id
      AND driver_instances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own driver results"
  ON driver_results FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_results.instance_id
      AND driver_instances.user_id = auth.uid()
    )
  );

-- Create driver_dependencies table
CREATE TABLE IF NOT EXISTS driver_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_instance_id uuid REFERENCES driver_instances ON DELETE CASCADE NOT NULL,
  child_instance_id uuid REFERENCES driver_instances ON DELETE CASCADE NOT NULL,
  mapping jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_instance_id, child_instance_id)
);

ALTER TABLE driver_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own driver dependencies"
  ON driver_dependencies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_dependencies.parent_instance_id
      AND driver_instances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own driver dependencies"
  ON driver_dependencies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_dependencies.parent_instance_id
      AND driver_instances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own driver dependencies"
  ON driver_dependencies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM driver_instances
      WHERE driver_instances.id = driver_dependencies.parent_instance_id
      AND driver_instances.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_driver_templates_user_id ON driver_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_templates_type ON driver_templates(type);
CREATE INDEX IF NOT EXISTS idx_driver_instances_user_id ON driver_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_instances_forecast_version_id ON driver_instances(forecast_version_id);
CREATE INDEX IF NOT EXISTS idx_driver_instances_template_id ON driver_instances(template_id);
CREATE INDEX IF NOT EXISTS idx_driver_results_instance_id ON driver_results(instance_id);
CREATE INDEX IF NOT EXISTS idx_driver_results_period_date ON driver_results(period_date);
CREATE INDEX IF NOT EXISTS idx_driver_dependencies_parent ON driver_dependencies(parent_instance_id);
CREATE INDEX IF NOT EXISTS idx_driver_dependencies_child ON driver_dependencies(child_instance_id);