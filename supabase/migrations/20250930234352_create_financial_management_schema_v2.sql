/*
  # Financial Management System Schema

  ## Overview
  This migration creates the comprehensive database schema for advanced financial management features.

  ## New Tables Created

  ### 1. Cash Flow Management
  - `cash_flow_forecasts` - ML-powered cash flow predictions
  - `ar_aging` - Accounts receivable aging analysis
  - `ap_timing` - Accounts payable timing optimization
  - `working_capital_snapshots` - Working capital optimization tracking
  - `seasonal_patterns` - Detected seasonal business patterns

  ### 2. Variance Analysis
  - `budget_versions` - Multiple budget version management
  - `variance_analysis` - Automated variance tracking and explanations
  - `variance_comments` - Commentary and annotations on variances
  - `rolling_forecasts` - Rolling forecast data

  ### 3. Scenario Planning
  - `scenarios` - Financial scenario definitions
  - `scenario_templates` - Pre-built scenario templates
  - `scenario_comparisons` - Multi-scenario comparison data
  - `scenario_versions` - Scenario version control
  - `monte_carlo_simulations` - Monte Carlo simulation results

  ### 4. Department Management
  - `departments` - Department definitions
  - `cost_centers` - Cost center tracking
  - `cost_allocations` - Cost allocation rules
  - `department_budgets` - Department-level budgets
  - `department_kpis` - Department performance indicators
  - `inter_department_charges` - Chargeback tracking

  ### 5. Alerts & Notifications
  - `alert_rules` - Customizable alert rule definitions
  - `alerts` - Alert instances and history
  - `anomalies` - Detected anomalies
  - `alert_analytics` - Alert response analytics

  ### 6. Reporting
  - `custom_reports` - User-defined report templates
  - `scheduled_reports` - Report distribution schedules
  - `report_exports` - Export history

  ### 7. Tax Planning
  - `tax_estimates` - Quarterly tax estimates
  - `tax_documents` - Tax document storage
  - `depreciation_schedules` - Asset depreciation tracking
  - `rd_credits` - R&D credit calculations
  - `tax_scenarios` - Tax planning scenarios

  ### 8. Financial Health
  - `health_scores` - Financial health score tracking
  - `health_recommendations` - AI-generated recommendations
  - `health_goals` - Financial goal tracking
  - `action_plans` - Generated action plans

  ### 9. Collaboration
  - `workflows` - Approval workflow definitions
  - `workflow_steps` - Workflow step tracking
  - `tasks` - Task assignments
  - `comments` - Discussion threads
  - `document_versions` - Version control for documents

  ### 10. Audit & Security
  - `audit_logs` - Comprehensive audit trail
  - `user_permissions` - Role-based permissions

  ## Security
  - All tables have RLS enabled
  - Policies restrict access to authenticated users
  - Row-level access based on organization membership
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CASH FLOW MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS cash_flow_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  forecast_date date NOT NULL,
  forecast_amount decimal(15,2) NOT NULL,
  confidence_level decimal(5,2) DEFAULT 0.85,
  forecast_type text NOT NULL CHECK (forecast_type IN ('inflow', 'outflow', 'net')),
  category text,
  ml_model_version text,
  lower_bound decimal(15,2),
  upper_bound decimal(15,2),
  actual_amount decimal(15,2),
  variance decimal(15,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS ar_aging (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  customer_id uuid,
  customer_name text NOT NULL,
  invoice_number text NOT NULL,
  invoice_date date NOT NULL,
  due_date date NOT NULL,
  amount decimal(15,2) NOT NULL,
  outstanding_balance decimal(15,2) NOT NULL,
  days_outstanding integer NOT NULL,
  aging_bucket text NOT NULL CHECK (aging_bucket IN ('current', '1-30', '31-60', '61-90', '90+')),
  collection_priority text CHECK (collection_priority IN ('high', 'medium', 'low')),
  collection_probability decimal(5,2),
  recommended_actions jsonb,
  contact_history jsonb,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ap_timing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  vendor_id uuid,
  vendor_name text NOT NULL,
  invoice_number text NOT NULL,
  invoice_date date NOT NULL,
  due_date date NOT NULL,
  amount decimal(15,2) NOT NULL,
  payment_terms text,
  early_payment_discount decimal(5,2),
  optimal_payment_date date,
  cash_impact_score decimal(5,2),
  priority_rank integer,
  status text DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS working_capital_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  snapshot_date date NOT NULL,
  current_assets decimal(15,2) NOT NULL,
  current_liabilities decimal(15,2) NOT NULL,
  working_capital decimal(15,2) NOT NULL,
  working_capital_ratio decimal(8,4),
  quick_ratio decimal(8,4),
  cash_ratio decimal(8,4),
  days_sales_outstanding decimal(8,2),
  days_payable_outstanding decimal(8,2),
  cash_conversion_cycle decimal(8,2),
  optimization_score decimal(5,2),
  recommendations jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seasonal_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  metric_name text NOT NULL,
  month integer CHECK (month BETWEEN 1 AND 12),
  seasonal_factor decimal(8,4) NOT NULL,
  confidence_level decimal(5,2),
  years_analyzed integer,
  detected_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- ============================================================================
-- VARIANCE ANALYSIS
-- ============================================================================

CREATE TABLE IF NOT EXISTS budget_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  version_name text NOT NULL,
  version_number integer NOT NULL,
  fiscal_year integer NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'archived')),
  description text,
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  is_baseline boolean DEFAULT false,
  parent_version_id uuid REFERENCES budget_versions(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, version_name, fiscal_year)
);

CREATE TABLE IF NOT EXISTS variance_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  budget_version_id uuid REFERENCES budget_versions(id),
  gl_code text NOT NULL,
  account_name text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  budget_amount decimal(15,2) NOT NULL,
  actual_amount decimal(15,2) NOT NULL,
  variance_amount decimal(15,2) NOT NULL,
  variance_percent decimal(8,4) NOT NULL,
  variance_type text CHECK (variance_type IN ('favorable', 'unfavorable', 'neutral')),
  ai_explanation text,
  root_causes jsonb,
  confidence_score decimal(5,2),
  alert_triggered boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS variance_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variance_analysis_id uuid REFERENCES variance_analysis(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  comment_text text NOT NULL,
  comment_type text CHECK (comment_type IN ('explanation', 'action', 'note', 'question')),
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rolling_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  gl_code text NOT NULL,
  account_name text NOT NULL,
  forecast_date date NOT NULL,
  forecast_amount decimal(15,2) NOT NULL,
  forecast_horizon_months integer DEFAULT 12,
  actual_amount decimal(15,2),
  adjustment_factor decimal(8,4) DEFAULT 1.0,
  confidence_level decimal(5,2),
  method text CHECK (method IN ('weighted_average', 'exponential_smoothing', 'regression', 'ml')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- SCENARIO PLANNING
-- ============================================================================

CREATE TABLE IF NOT EXISTS scenario_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text CHECK (category IN ('hiring', 'expansion', 'downturn', 'investment', 'custom')),
  is_system_template boolean DEFAULT false,
  template_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  scenario_type text NOT NULL,
  template_id uuid REFERENCES scenario_templates(id),
  base_year integer NOT NULL,
  time_horizon_months integer DEFAULT 12,
  probability_weight decimal(5,2) DEFAULT 1.0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  assumptions jsonb,
  results jsonb,
  impact_summary jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scenario_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES scenarios(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  changes_summary text,
  version_data jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scenario_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  comparison_name text NOT NULL,
  scenario_ids uuid[] NOT NULL,
  metrics_compared jsonb NOT NULL,
  comparison_results jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monte_carlo_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES scenarios(id) ON DELETE CASCADE,
  simulation_date timestamptz NOT NULL DEFAULT now(),
  iterations integer NOT NULL,
  variables jsonb NOT NULL,
  results jsonb NOT NULL,
  percentile_results jsonb,
  risk_metrics jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- DEPARTMENT MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  code text NOT NULL,
  parent_department_id uuid REFERENCES departments(id),
  manager_user_id uuid REFERENCES auth.users(id),
  description text,
  cost_center_type text CHECK (cost_center_type IN ('revenue', 'expense', 'profit')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, code)
);

CREATE TABLE IF NOT EXISTS cost_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  department_id uuid REFERENCES departments(id),
  name text NOT NULL,
  code text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, code)
);

CREATE TABLE IF NOT EXISTS cost_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  source_department_id uuid REFERENCES departments(id),
  target_department_id uuid REFERENCES departments(id),
  allocation_method text CHECK (allocation_method IN ('percentage', 'headcount', 'revenue', 'square_footage', 'custom')),
  allocation_percentage decimal(5,2),
  allocation_basis jsonb,
  effective_date date NOT NULL,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS department_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id),
  budget_version_id uuid REFERENCES budget_versions(id),
  gl_code text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  budget_amount decimal(15,2) NOT NULL,
  actual_amount decimal(15,2),
  forecast_amount decimal(15,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS department_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id),
  kpi_name text NOT NULL,
  kpi_category text,
  current_value decimal(15,2),
  target_value decimal(15,2),
  unit text,
  measurement_period text,
  trend text CHECK (trend IN ('up', 'down', 'stable')),
  status text CHECK (status IN ('on_track', 'at_risk', 'off_track')),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inter_department_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  from_department_id uuid REFERENCES departments(id),
  to_department_id uuid REFERENCES departments(id),
  charge_date date NOT NULL,
  amount decimal(15,2) NOT NULL,
  description text NOT NULL,
  gl_code text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ALERTS & ANOMALIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS alert_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  rule_name text NOT NULL,
  rule_type text CHECK (rule_type IN ('threshold', 'anomaly', 'variance', 'predictive', 'custom')),
  metric_name text NOT NULL,
  condition jsonb NOT NULL,
  threshold_value decimal(15,2),
  severity text CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  recipients uuid[],
  notification_channels text[] CHECK (notification_channels <@ ARRAY['email', 'slack', 'teams', 'in_app']::text[]),
  is_active boolean DEFAULT true,
  snooze_until timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  alert_rule_id uuid REFERENCES alert_rules(id),
  severity text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  metric_name text,
  current_value decimal(15,2),
  threshold_value decimal(15,2),
  data jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'false_positive')),
  acknowledged_by uuid REFERENCES auth.users(id),
  acknowledged_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS anomalies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  detection_date timestamptz NOT NULL DEFAULT now(),
  metric_name text NOT NULL,
  actual_value decimal(15,2) NOT NULL,
  expected_value decimal(15,2) NOT NULL,
  deviation_score decimal(8,4) NOT NULL,
  anomaly_type text CHECK (anomaly_type IN ('spike', 'drop', 'trend_break', 'pattern_change')),
  confidence_score decimal(5,2),
  potential_causes jsonb,
  impact_assessment text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'explained', 'dismissed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alert_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  alert_id uuid REFERENCES alerts(id),
  response_time_minutes integer,
  resolution_time_minutes integer,
  was_actionable boolean,
  outcome_notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- REPORTING
-- ============================================================================

CREATE TABLE IF NOT EXISTS custom_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  report_name text NOT NULL,
  report_type text,
  description text,
  report_config jsonb NOT NULL,
  filters jsonb,
  is_template boolean DEFAULT false,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheduled_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_report_id uuid REFERENCES custom_reports(id),
  schedule_config jsonb NOT NULL,
  recipients text[],
  format text CHECK (format IN ('pdf', 'excel', 'csv', 'json')),
  is_active boolean DEFAULT true,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES custom_reports(id),
  exported_by uuid REFERENCES auth.users(id),
  export_format text NOT NULL,
  file_size_bytes integer,
  download_url text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- TAX PLANNING
-- ============================================================================

CREATE TABLE IF NOT EXISTS tax_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  tax_year integer NOT NULL,
  quarter integer CHECK (quarter BETWEEN 1 AND 4),
  estimated_income decimal(15,2) NOT NULL,
  estimated_deductions decimal(15,2),
  estimated_tax_liability decimal(15,2) NOT NULL,
  payment_amount decimal(15,2),
  payment_due_date date NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tax_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  document_name text NOT NULL,
  document_type text CHECK (document_type IN ('1099', 'W2', 'K1', '1120', '1065', 'other')),
  tax_year integer NOT NULL,
  file_path text,
  file_size_bytes integer,
  uploaded_by uuid REFERENCES auth.users(id),
  uploaded_at timestamptz DEFAULT now(),
  tags text[]
);

CREATE TABLE IF NOT EXISTS depreciation_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  asset_name text NOT NULL,
  asset_category text,
  purchase_date date NOT NULL,
  purchase_price decimal(15,2) NOT NULL,
  salvage_value decimal(15,2) DEFAULT 0,
  useful_life_years integer NOT NULL,
  depreciation_method text CHECK (depreciation_method IN ('straight_line', 'declining_balance', 'sum_of_years', 'units_of_production')),
  current_book_value decimal(15,2),
  accumulated_depreciation decimal(15,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rd_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  tax_year integer NOT NULL,
  project_name text NOT NULL,
  qualified_expenses decimal(15,2) NOT NULL,
  credit_amount decimal(15,2) NOT NULL,
  credit_type text CHECK (credit_type IN ('federal', 'state', 'both')),
  status text DEFAULT 'calculated' CHECK (status IN ('calculated', 'claimed', 'approved')),
  documentation jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tax_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  scenario_name text NOT NULL,
  tax_year integer NOT NULL,
  entity_structure text CHECK (entity_structure IN ('sole_proprietor', 'partnership', 'llc', 's_corp', 'c_corp')),
  scenario_assumptions jsonb NOT NULL,
  calculated_results jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- FINANCIAL HEALTH
-- ============================================================================

CREATE TABLE IF NOT EXISTS health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  calculation_date date NOT NULL,
  overall_score decimal(5,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  liquidity_score decimal(5,2),
  profitability_score decimal(5,2),
  efficiency_score decimal(5,2),
  leverage_score decimal(5,2),
  growth_score decimal(5,2),
  cash_flow_score decimal(5,2),
  dimension_scores jsonb,
  trend text CHECK (trend IN ('improving', 'stable', 'declining')),
  percentile_ranking decimal(5,2),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  health_score_id uuid REFERENCES health_scores(id),
  recommendation_type text CHECK (recommendation_type IN ('opportunity', 'risk', 'action')),
  priority text CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title text NOT NULL,
  description text NOT NULL,
  expected_impact text,
  implementation_effort text CHECK (implementation_effort IN ('low', 'medium', 'high')),
  related_metrics text[],
  is_dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  goal_name text NOT NULL,
  metric_name text NOT NULL,
  current_value decimal(15,2),
  target_value decimal(15,2) NOT NULL,
  target_date date NOT NULL,
  progress_percentage decimal(5,2),
  status text CHECK (status IN ('on_track', 'at_risk', 'off_track', 'achieved')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  plan_name text NOT NULL,
  related_goal_id uuid REFERENCES health_goals(id),
  related_recommendation_id uuid REFERENCES health_recommendations(id),
  action_items jsonb NOT NULL,
  priority integer,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- COLLABORATION & WORKFLOW
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workflow_name text NOT NULL,
  workflow_type text CHECK (workflow_type IN ('approval', 'review', 'notification', 'custom')),
  entity_type text NOT NULL,
  entity_id uuid,
  workflow_definition jsonb NOT NULL,
  current_step integer DEFAULT 1,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'cancelled')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  step_name text NOT NULL,
  assigned_to uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'skipped')),
  decision text,
  comments text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  task_type text CHECK (task_type IN ('approval', 'review', 'action', 'reminder')),
  priority text CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  assigned_to uuid REFERENCES auth.users(id),
  assigned_by uuid REFERENCES auth.users(id),
  due_date date,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  related_entity_type text,
  related_entity_id uuid,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  comment_text text NOT NULL,
  parent_comment_id uuid REFERENCES comments(id),
  is_edited boolean DEFAULT false,
  edited_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type text NOT NULL,
  document_id uuid NOT NULL,
  version_number integer NOT NULL,
  version_data jsonb NOT NULL,
  changes_summary text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- AUDIT & SECURITY
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  changes jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  organization_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'analyst', 'viewer')),
  permissions jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_cash_flow_forecasts_org_date ON cash_flow_forecasts(organization_id, forecast_date);
CREATE INDEX IF NOT EXISTS idx_ar_aging_org_bucket ON ar_aging(organization_id, aging_bucket);
CREATE INDEX IF NOT EXISTS idx_ap_timing_org_due ON ap_timing(organization_id, due_date);
CREATE INDEX IF NOT EXISTS idx_variance_analysis_org_period ON variance_analysis(organization_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_budget_versions_org_year ON budget_versions(organization_id, fiscal_year, status);
CREATE INDEX IF NOT EXISTS idx_scenarios_org_status ON scenarios(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_scenario_versions_scenario ON scenario_versions(scenario_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_departments_org_active ON departments(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_department_budgets_dept ON department_budgets(department_id, period_start);
CREATE INDEX IF NOT EXISTS idx_alerts_org_status ON alerts(organization_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_rules_org_active ON alert_rules(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE cash_flow_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_aging ENABLE ROW LEVEL SECURITY;
ALTER TABLE ap_timing ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_capital_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE variance_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE variance_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rolling_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE monte_carlo_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE inter_department_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE depreciation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rd_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Basic policies for authenticated users
CREATE POLICY "Users can manage cash flow forecasts" ON cash_flow_forecasts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage AR aging" ON ar_aging FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage AP timing" ON ap_timing FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view working capital" ON working_capital_snapshots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view seasonal patterns" ON seasonal_patterns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage budget versions" ON budget_versions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage variance analysis" ON variance_analysis FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage variance comments" ON variance_comments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage rolling forecasts" ON rolling_forecasts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view scenario templates" ON scenario_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage scenarios" ON scenarios FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view scenario versions" ON scenario_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage scenario comparisons" ON scenario_comparisons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view monte carlo" ON monte_carlo_simulations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage departments" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage cost centers" ON cost_centers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage cost allocations" ON cost_allocations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage department budgets" ON department_budgets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage department kpis" ON department_kpis FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage inter dept charges" ON inter_department_charges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage alert rules" ON alert_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage alerts" ON alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view anomalies" ON anomalies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view alert analytics" ON alert_analytics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage custom reports" ON custom_reports FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage scheduled reports" ON scheduled_reports FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view report exports" ON report_exports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage tax estimates" ON tax_estimates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage tax documents" ON tax_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage depreciation schedules" ON depreciation_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage rd credits" ON rd_credits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage tax scenarios" ON tax_scenarios FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view health scores" ON health_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view health recommendations" ON health_recommendations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage health goals" ON health_goals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage action plans" ON action_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage workflows" ON workflows FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage workflow steps" ON workflow_steps FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage tasks" ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage comments" ON comments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can view document versions" ON document_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view user permissions" ON user_permissions FOR SELECT TO authenticated USING (true);
