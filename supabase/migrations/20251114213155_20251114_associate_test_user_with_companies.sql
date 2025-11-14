/*
  # Associate Test User with Companies

  ## Overview
  This migration creates associations between the test user and all companies
  so the dropdown will display available companies.

  ## Changes
  - Associates user ID with all test companies in company_users table
  - Allows the test/demo user to access all companies
*/

-- Associate the test user (from AuthContext) with all companies
-- Using the user ID: '00000000-0000-0000-0000-000000000001'
INSERT INTO company_users (user_id, company_id)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  id
FROM companies
WHERE code IN ('ACME', 'TECH', 'GCG')
ON CONFLICT (user_id, company_id) DO NOTHING;
