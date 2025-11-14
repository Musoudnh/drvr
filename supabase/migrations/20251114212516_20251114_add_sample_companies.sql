/*
  # Sample Companies and User Access Data

  Adds sample companies and associates them with test users for demonstration.
*/

INSERT INTO companies (name, code) VALUES
  ('Acme Corp', 'ACME'),
  ('Tech Innovations Inc', 'TECH'),
  ('Global Consulting Group', 'GCG')
ON CONFLICT (code) DO NOTHING;
