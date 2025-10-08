/*
  # Add RLS Policies for Payroll Tables
  
  Enables row-level security on all payroll tables.
*/

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compensation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates_by_state ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Users view own departments" ON departments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own departments" ON departments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own departments" ON departments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own departments" ON departments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Compensation history policies
CREATE POLICY "Users view own comp history" ON compensation_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own comp history" ON compensation_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own comp history" ON compensation_history FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comp history" ON compensation_history FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Payroll runs policies
CREATE POLICY "Users view own payroll runs" ON payroll_runs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payroll runs" ON payroll_runs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own payroll runs" ON payroll_runs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own payroll runs" ON payroll_runs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Payroll line items policies
CREATE POLICY "Users view own payroll items" ON payroll_line_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payroll items" ON payroll_line_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own payroll items" ON payroll_line_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own payroll items" ON payroll_line_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tax rates policies
CREATE POLICY "Users view own tax rates" ON tax_rates_by_state FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own tax rates" ON tax_rates_by_state FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own tax rates" ON tax_rates_by_state FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);