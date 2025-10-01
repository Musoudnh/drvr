/*
  # Allow public access to state tax rates

  1. Changes
    - Drop the existing policy that requires authentication
    - Add new policy allowing public read access to state tax rates
    
  2. Security
    - State tax rates are public reference data
    - Read-only access for everyone
    - No authentication required
*/

DROP POLICY IF EXISTS "Authenticated users can view state tax rates" ON state_tax_rates;

CREATE POLICY "Anyone can view state tax rates"
  ON state_tax_rates
  FOR SELECT
  TO public
  USING (true);
