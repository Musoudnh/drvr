/*
  # Enhance Cash Flow Tables for Dashboard Views

  ## Overview
  Extends existing cash flow tables with additional fields needed for comprehensive
  dashboard views including automation tracking, payment history, and customer metrics.

  ## Changes to Existing Tables

  ### accounts_receivable enhancements
  - Add `amount_paid` (decimal) - Track partial payments
  - Add `payment_date` (date) - When payment was received
  - Add `reminder_sent` (boolean) - Track if reminder was sent
  - Add `reminder_sent_date` (timestamptz) - When reminder was sent
  - Add `contact_email` (text) - Customer contact email
  - Add `notes` (text) - Additional notes

  ### accounts_payable enhancements
  - Add `amount_paid` (decimal) - Track partial payments
  - Add `payment_date` (date) - When payment was made
  - Add `approval_status` (text) - Workflow status: pending, approved, rejected
  - Add `approved_by` (uuid) - User who approved
  - Add `approved_at` (timestamptz) - When it was approved
  - Add `scheduled_payment_date` (date) - Scheduled payment date
  - Add `contact_email` (text) - Vendor contact email
  - Add `notes` (text) - Additional notes

  ## New Tables

  ### cash_flow_alerts
  Tracks automated alerts and notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `alert_type` (text) - Type: payment_due, overdue, reminder_sent, approval_needed
  - `reference_type` (text) - receivable or payable
  - `reference_id` (uuid) - ID of the related record
  - `message` (text) - Alert message
  - `priority` (text) - low, medium, high, critical
  - `is_read` (boolean) - Whether user has seen it
  - `created_at` (timestamptz)

  ### cash_flow_metrics
  Stores calculated metrics for performance tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `metric_date` (date) - Date of calculation
  - `dso` (decimal) - Days Sales Outstanding
  - `dpo` (decimal) - Days Payable Outstanding
  - `total_receivables` (decimal)
  - `total_payables` (decimal)
  - `net_cash_position` (decimal)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all new tables
  - Users can only access their own data
  - Proper policies for all CRUD operations
*/

-- Extend accounts_receivable table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts_receivable' AND column_name = 'amount_paid'
  ) THEN
    ALTER TABLE accounts_receivable
    ADD COLUMN amount_paid decimal(12, 2) DEFAULT 0,
    ADD COLUMN payment_date date,
    ADD COLUMN reminder_sent boolean DEFAULT false,
    ADD COLUMN reminder_sent_date timestamptz,
    ADD COLUMN contact_email text,
    ADD COLUMN notes text;
  END IF;
END $$;

-- Extend accounts_payable table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts_payable' AND column_name = 'amount_paid'
  ) THEN
    ALTER TABLE accounts_payable
    ADD COLUMN amount_paid decimal(12, 2) DEFAULT 0,
    ADD COLUMN payment_date date,
    ADD COLUMN approval_status text DEFAULT 'pending',
    ADD COLUMN approved_by uuid,
    ADD COLUMN approved_at timestamptz,
    ADD COLUMN scheduled_payment_date date,
    ADD COLUMN contact_email text,
    ADD COLUMN notes text;
  END IF;
END $$;

-- Create cash_flow_alerts table
CREATE TABLE IF NOT EXISTS cash_flow_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alert_type text NOT NULL,
  reference_type text,
  reference_id uuid,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create cash_flow_metrics table
CREATE TABLE IF NOT EXISTS cash_flow_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  metric_date date NOT NULL,
  dso decimal(10, 2),
  dpo decimal(10, 2),
  total_receivables decimal(12, 2) DEFAULT 0,
  total_payables decimal(12, 2) DEFAULT 0,
  net_cash_position decimal(12, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, metric_date)
);

-- Enable RLS on cash_flow_alerts
ALTER TABLE cash_flow_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cash_flow_alerts
CREATE POLICY "Users can view own alerts"
  ON cash_flow_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts"
  ON cash_flow_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON cash_flow_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON cash_flow_alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on cash_flow_metrics
ALTER TABLE cash_flow_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cash_flow_metrics
CREATE POLICY "Users can view own metrics"
  ON cash_flow_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own metrics"
  ON cash_flow_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON cash_flow_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own metrics"
  ON cash_flow_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cash_flow_alerts_user_id ON cash_flow_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_alerts_created_at ON cash_flow_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cash_flow_alerts_is_read ON cash_flow_alerts(is_read);

CREATE INDEX IF NOT EXISTS idx_cash_flow_metrics_user_id ON cash_flow_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_metrics_metric_date ON cash_flow_metrics(metric_date DESC);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_accounts_receivable_updated_at ON accounts_receivable;
CREATE TRIGGER update_accounts_receivable_updated_at
  BEFORE UPDATE ON accounts_receivable
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_payable_updated_at ON accounts_payable;
CREATE TRIGGER update_accounts_payable_updated_at
  BEFORE UPDATE ON accounts_payable
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
