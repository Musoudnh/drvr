/*
  # Create Cash Flow Management Tables

  ## Overview
  Creates tables for tracking accounts receivable (AR) and accounts payable (AP)
  to enable comprehensive cash flow management and forecasting.

  ## New Tables
  
  ### 1. accounts_receivable
  Tracks money owed to the company by customers
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - User who created the record
  - `customer_name` (text) - Name of the customer
  - `invoice_number` (text) - Invoice reference number
  - `invoice_date` (date) - Date invoice was issued
  - `due_date` (date) - Payment due date
  - `amount_due` (decimal) - Amount owed
  - `status` (text) - Payment status: pending, paid, overdue
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. accounts_payable
  Tracks money the company owes to vendors
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - User who created the record
  - `vendor_name` (text) - Name of the vendor
  - `bill_number` (text) - Bill reference number
  - `bill_date` (date) - Date bill was received
  - `due_date` (date) - Payment due date
  - `amount_due` (decimal) - Amount owed
  - `status` (text) - Payment status: pending, paid, overdue
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Both tables have RLS enabled
  - Users can only access their own records
  - Separate policies for SELECT, INSERT, UPDATE, DELETE operations
  - All policies verify authentication and ownership
*/

-- Create accounts_receivable table
CREATE TABLE IF NOT EXISTS accounts_receivable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_name text NOT NULL,
  invoice_number text NOT NULL,
  invoice_date date NOT NULL,
  due_date date NOT NULL,
  amount_due decimal(12, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create accounts_payable table
CREATE TABLE IF NOT EXISTS accounts_payable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vendor_name text NOT NULL,
  bill_number text NOT NULL,
  bill_date date NOT NULL,
  due_date date NOT NULL,
  amount_due decimal(12, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on accounts_receivable
ALTER TABLE accounts_receivable ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts_receivable
CREATE POLICY "Users can view own receivables"
  ON accounts_receivable FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own receivables"
  ON accounts_receivable FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receivables"
  ON accounts_receivable FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own receivables"
  ON accounts_receivable FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on accounts_payable
ALTER TABLE accounts_payable ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts_payable
CREATE POLICY "Users can view own payables"
  ON accounts_payable FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payables"
  ON accounts_payable FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payables"
  ON accounts_payable FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payables"
  ON accounts_payable FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_user_id ON accounts_receivable(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_due_date ON accounts_receivable(due_date);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_status ON accounts_receivable(status);

CREATE INDEX IF NOT EXISTS idx_accounts_payable_user_id ON accounts_payable(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_due_date ON accounts_payable(due_date);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_status ON accounts_payable(status);
