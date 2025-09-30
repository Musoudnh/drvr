export interface CashFlowForecast {
  id: string;
  organization_id: string;
  forecast_date: string;
  forecast_amount: number;
  confidence_level: number;
  forecast_type: 'inflow' | 'outflow' | 'net';
  category?: string;
  ml_model_version?: string;
  lower_bound?: number;
  upper_bound?: number;
  actual_amount?: number;
  variance?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ARaging {
  id: string;
  organization_id: string;
  customer_id?: string;
  customer_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  outstanding_balance: number;
  days_outstanding: number;
  aging_bucket: 'current' | '1-30' | '31-60' | '61-90' | '90+';
  collection_priority?: 'high' | 'medium' | 'low';
  collection_probability?: number;
  recommended_actions?: RecommendedAction[];
  contact_history?: ContactHistory[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RecommendedAction {
  action: string;
  priority: 'high' | 'medium' | 'low';
  expected_impact?: string;
}

export interface ContactHistory {
  date: string;
  method: 'email' | 'phone' | 'letter';
  outcome: string;
  notes?: string;
}

export interface APTiming {
  id: string;
  organization_id: string;
  vendor_id?: string;
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  payment_terms?: string;
  early_payment_discount?: number;
  optimal_payment_date?: string;
  cash_impact_score?: number;
  priority_rank?: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkingCapitalSnapshot {
  id: string;
  organization_id: string;
  snapshot_date: string;
  current_assets: number;
  current_liabilities: number;
  working_capital: number;
  working_capital_ratio?: number;
  quick_ratio?: number;
  cash_ratio?: number;
  days_sales_outstanding?: number;
  days_payable_outstanding?: number;
  cash_conversion_cycle?: number;
  optimization_score?: number;
  recommendations?: WorkingCapitalRecommendation[];
  created_at: string;
}

export interface WorkingCapitalRecommendation {
  category: string;
  recommendation: string;
  potential_savings: number;
  implementation_effort: 'low' | 'medium' | 'high';
}

export interface SeasonalPattern {
  id: string;
  organization_id: string;
  metric_name: string;
  month: number;
  seasonal_factor: number;
  confidence_level?: number;
  years_analyzed?: number;
  detected_at: string;
  is_active: boolean;
}

export interface BudgetVersion {
  id: string;
  organization_id: string;
  version_name: string;
  version_number: number;
  fiscal_year: number;
  status: 'draft' | 'approved' | 'active' | 'archived';
  description?: string;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  is_baseline: boolean;
  parent_version_id?: string;
  created_at: string;
  updated_at: string;
}

export interface VarianceAnalysis {
  id: string;
  organization_id: string;
  budget_version_id?: string;
  gl_code: string;
  account_name: string;
  period_start: string;
  period_end: string;
  budget_amount: number;
  actual_amount: number;
  variance_amount: number;
  variance_percent: number;
  variance_type: 'favorable' | 'unfavorable' | 'neutral';
  ai_explanation?: string;
  root_causes?: RootCause[];
  confidence_score?: number;
  alert_triggered: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RootCause {
  cause: string;
  impact_percentage: number;
  category: string;
}

export interface VarianceComment {
  id: string;
  variance_analysis_id: string;
  user_id?: string;
  comment_text: string;
  comment_type: 'explanation' | 'action' | 'note' | 'question';
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface RollingForecast {
  id: string;
  organization_id: string;
  gl_code: string;
  account_name: string;
  forecast_date: string;
  forecast_amount: number;
  forecast_horizon_months: number;
  actual_amount?: number;
  adjustment_factor: number;
  confidence_level?: number;
  method: 'weighted_average' | 'exponential_smoothing' | 'regression' | 'ml';
  created_at: string;
  updated_at: string;
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'hiring' | 'expansion' | 'downturn' | 'investment' | 'custom';
  is_system_template: boolean;
  template_data: ScenarioTemplateData;
  created_at: string;
  created_by?: string;
}

export interface ScenarioTemplateData {
  assumptions: Assumption[];
  variables: Variable[];
  default_values?: Record<string, number>;
}

export interface Assumption {
  name: string;
  description: string;
  value?: number | string;
}

export interface Variable {
  name: string;
  type: 'revenue' | 'expense' | 'headcount' | 'other';
  change_type: 'percentage' | 'absolute';
  default_change?: number;
}

export interface Scenario {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  scenario_type: string;
  template_id?: string;
  base_year: number;
  time_horizon_months: number;
  probability_weight: number;
  status: 'draft' | 'active' | 'archived';
  assumptions?: Record<string, any>;
  results?: ScenarioResults;
  impact_summary?: ImpactSummary;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ScenarioResults {
  revenue_impact: number;
  expense_impact: number;
  profit_impact: number;
  cash_flow_impact: number;
  monthly_projections?: MonthlyProjection[];
}

export interface MonthlyProjection {
  month: number;
  revenue: number;
  expenses: number;
  profit: number;
  cash_flow: number;
}

export interface ImpactSummary {
  key_metrics: KeyMetric[];
  risks: string[];
  opportunities: string[];
}

export interface KeyMetric {
  metric: string;
  current: number;
  projected: number;
  change_percent: number;
}

export interface ScenarioVersion {
  id: string;
  scenario_id: string;
  version_number: number;
  changes_summary?: string;
  version_data: Record<string, any>;
  created_by?: string;
  created_at: string;
}

export interface ScenarioComparison {
  id: string;
  organization_id: string;
  comparison_name: string;
  scenario_ids: string[];
  metrics_compared: string[];
  comparison_results?: ComparisonResult[];
  created_by?: string;
  created_at: string;
}

export interface ComparisonResult {
  metric_name: string;
  scenario_values: Record<string, number>;
  variance_analysis: Record<string, number>;
}

export interface MonteCarloSimulation {
  id: string;
  scenario_id: string;
  simulation_date: string;
  iterations: number;
  variables: SimulationVariable[];
  results: SimulationResults;
  percentile_results?: PercentileResults;
  risk_metrics?: RiskMetrics;
  created_at: string;
}

export interface SimulationVariable {
  name: string;
  distribution: 'normal' | 'uniform' | 'triangular';
  parameters: Record<string, number>;
}

export interface SimulationResults {
  mean: number;
  median: number;
  std_dev: number;
  min: number;
  max: number;
  distribution_data: number[];
}

export interface PercentileResults {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface RiskMetrics {
  probability_of_loss: number;
  value_at_risk: number;
  expected_shortfall: number;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  parent_department_id?: string;
  manager_user_id?: string;
  description?: string;
  cost_center_type: 'revenue' | 'expense' | 'profit';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCenter {
  id: string;
  organization_id: string;
  department_id?: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface CostAllocation {
  id: string;
  organization_id: string;
  source_department_id?: string;
  target_department_id?: string;
  allocation_method: 'percentage' | 'headcount' | 'revenue' | 'square_footage' | 'custom';
  allocation_percentage?: number;
  allocation_basis?: Record<string, any>;
  effective_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface DepartmentBudget {
  id: string;
  department_id?: string;
  budget_version_id?: string;
  gl_code: string;
  period_start: string;
  period_end: string;
  budget_amount: number;
  actual_amount?: number;
  forecast_amount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentKPI {
  id: string;
  department_id?: string;
  kpi_name: string;
  kpi_category?: string;
  current_value?: number;
  target_value?: number;
  unit?: string;
  measurement_period?: string;
  trend: 'up' | 'down' | 'stable';
  status: 'on_track' | 'at_risk' | 'off_track';
  updated_at: string;
}

export interface InterDepartmentCharge {
  id: string;
  organization_id: string;
  from_department_id?: string;
  to_department_id?: string;
  charge_date: string;
  amount: number;
  description: string;
  gl_code?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_by?: string;
  created_at: string;
}

export interface AlertRule {
  id: string;
  organization_id: string;
  rule_name: string;
  rule_type: 'threshold' | 'anomaly' | 'variance' | 'predictive' | 'custom';
  metric_name: string;
  condition: AlertCondition;
  threshold_value?: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  recipients?: string[];
  notification_channels: ('email' | 'slack' | 'teams' | 'in_app')[];
  is_active: boolean;
  snooze_until?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AlertCondition {
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'between';
  value?: number;
  range?: { min: number; max: number };
  lookback_period?: number;
}

export interface Alert {
  id: string;
  organization_id: string;
  alert_rule_id?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  metric_name?: string;
  current_value?: number;
  threshold_value?: number;
  data?: Record<string, any>;
  status: 'active' | 'acknowledged' | 'resolved' | 'false_positive';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface Anomaly {
  id: string;
  organization_id: string;
  detection_date: string;
  metric_name: string;
  actual_value: number;
  expected_value: number;
  deviation_score: number;
  anomaly_type: 'spike' | 'drop' | 'trend_break' | 'pattern_change';
  confidence_score?: number;
  potential_causes?: string[];
  impact_assessment?: string;
  status: 'new' | 'investigating' | 'explained' | 'dismissed';
  created_at: string;
}

export interface AlertAnalytics {
  id: string;
  organization_id: string;
  alert_id?: string;
  response_time_minutes?: number;
  resolution_time_minutes?: number;
  was_actionable?: boolean;
  outcome_notes?: string;
  created_at: string;
}

export interface CustomReport {
  id: string;
  organization_id: string;
  report_name: string;
  report_type?: string;
  description?: string;
  report_config: ReportConfig;
  filters?: ReportFilters;
  is_template: boolean;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportConfig {
  chart_type: string;
  metrics: string[];
  dimensions?: string[];
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  time_period?: string;
}

export interface ReportFilters {
  date_range?: { start: string; end: string };
  departments?: string[];
  gl_codes?: string[];
  custom_filters?: Record<string, any>;
}

export interface ScheduledReport {
  id: string;
  custom_report_id?: string;
  schedule_config: ScheduleConfig;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  is_active: boolean;
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
}

export interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  day_of_week?: number;
  day_of_month?: number;
  time?: string;
}

export interface ReportExport {
  id: string;
  report_id?: string;
  exported_by?: string;
  export_format: string;
  file_size_bytes?: number;
  download_url?: string;
  expires_at?: string;
  created_at: string;
}

export interface TaxEstimate {
  id: string;
  organization_id: string;
  tax_year: number;
  quarter: number;
  estimated_income: number;
  estimated_deductions?: number;
  estimated_tax_liability: number;
  payment_amount?: number;
  payment_due_date: string;
  payment_status: 'pending' | 'paid' | 'overdue';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TaxDocument {
  id: string;
  organization_id: string;
  document_name: string;
  document_type: '1099' | 'W2' | 'K1' | '1120' | '1065' | 'other';
  tax_year: number;
  file_path?: string;
  file_size_bytes?: number;
  uploaded_by?: string;
  uploaded_at: string;
  tags?: string[];
}

export interface DepreciationSchedule {
  id: string;
  organization_id: string;
  asset_name: string;
  asset_category?: string;
  purchase_date: string;
  purchase_price: number;
  salvage_value: number;
  useful_life_years: number;
  depreciation_method: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production';
  current_book_value?: number;
  accumulated_depreciation?: number;
  is_active: boolean;
  created_at: string;
}

export interface RDCredit {
  id: string;
  organization_id: string;
  tax_year: number;
  project_name: string;
  qualified_expenses: number;
  credit_amount: number;
  credit_type: 'federal' | 'state' | 'both';
  status: 'calculated' | 'claimed' | 'approved';
  documentation?: Record<string, any>;
  created_at: string;
}

export interface TaxScenario {
  id: string;
  organization_id: string;
  scenario_name: string;
  tax_year: number;
  entity_structure: 'sole_proprietor' | 'partnership' | 'llc' | 's_corp' | 'c_corp';
  scenario_assumptions: Record<string, any>;
  calculated_results?: TaxCalculationResults;
  created_by?: string;
  created_at: string;
}

export interface TaxCalculationResults {
  effective_tax_rate: number;
  total_tax_liability: number;
  federal_tax: number;
  state_tax: number;
  self_employment_tax?: number;
  estimated_refund?: number;
}

export interface HealthScore {
  id: string;
  organization_id: string;
  calculation_date: string;
  overall_score: number;
  liquidity_score?: number;
  profitability_score?: number;
  efficiency_score?: number;
  leverage_score?: number;
  growth_score?: number;
  cash_flow_score?: number;
  dimension_scores?: Record<string, number>;
  trend: 'improving' | 'stable' | 'declining';
  percentile_ranking?: number;
  created_at: string;
}

export interface HealthRecommendation {
  id: string;
  health_score_id?: string;
  recommendation_type: 'opportunity' | 'risk' | 'action';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expected_impact?: string;
  implementation_effort: 'low' | 'medium' | 'high';
  related_metrics?: string[];
  is_dismissed: boolean;
  created_at: string;
}

export interface HealthGoal {
  id: string;
  organization_id: string;
  goal_name: string;
  metric_name: string;
  current_value?: number;
  target_value: number;
  target_date: string;
  progress_percentage?: number;
  status: 'on_track' | 'at_risk' | 'off_track' | 'achieved';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionPlan {
  id: string;
  organization_id: string;
  plan_name: string;
  related_goal_id?: string;
  related_recommendation_id?: string;
  action_items: ActionItem[];
  priority?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Workflow {
  id: string;
  organization_id: string;
  workflow_name: string;
  workflow_type: 'approval' | 'review' | 'notification' | 'custom';
  entity_type: string;
  entity_id?: string;
  workflow_definition: WorkflowDefinition;
  current_step: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowDefinition {
  steps: WorkflowStepDefinition[];
  approval_type: 'sequential' | 'parallel' | 'any';
}

export interface WorkflowStepDefinition {
  step_number: number;
  step_name: string;
  assigned_to?: string;
  required: boolean;
}

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  step_number: number;
  step_name: string;
  assigned_to?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  decision?: string;
  comments?: string;
  completed_at?: string;
  created_at: string;
}

export interface Task {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  task_type: 'approval' | 'review' | 'action' | 'reminder';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assigned_to?: string;
  assigned_by?: string;
  due_date?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  related_entity_type?: string;
  related_entity_id?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  entity_type: string;
  entity_id: string;
  user_id?: string;
  comment_text: string;
  parent_comment_id?: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_type: string;
  document_id: string;
  version_number: number;
  version_data: Record<string, any>;
  changes_summary?: string;
  created_by?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserPermission {
  id: string;
  user_id?: string;
  organization_id: string;
  role: 'owner' | 'admin' | 'manager' | 'analyst' | 'viewer';
  permissions: Permission[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}
