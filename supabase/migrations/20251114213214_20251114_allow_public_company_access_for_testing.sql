/*
  # Allow Public Access to Companies for Testing

  ## Overview
  This migration temporarily allows public access to companies and company_users
  tables for testing purposes when authentication is not fully configured.

  ## Security
  - Adds public SELECT policies for testing
  - Should be restricted in production environment
*/

-- Allow public access to view all companies for testing
CREATE POLICY "Allow public to view companies for testing"
  ON companies FOR SELECT
  TO anon
  USING (true);

-- Allow public access to view company_users for testing
CREATE POLICY "Allow public to view company_users for testing"
  ON company_users FOR SELECT
  TO anon
  USING (true);
