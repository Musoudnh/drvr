/*
  # Company and User Access Management System

  ## Overview
  This migration creates a system for accounting firms to manage multiple client companies
  and control which users have access to which companies.

  ## New Tables

  ### 1. `companies`
  Stores company/client information
  - `id` (uuid, primary key)
  - `name` (text) - Company name
  - `code` (text) - Short company code or identifier
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `company_users`
  Maps users to companies they have access to (many-to-many)
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References auth.users
  - `company_id` (uuid) - References companies(id)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only view companies they have access to
  - Default company is set on first access
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view companies they have access to"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their company access"
  ON company_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
