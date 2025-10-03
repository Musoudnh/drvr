export type DriverType =
  | 'volume_price'
  | 'cac'
  | 'retention'
  | 'funnel'
  | 'seasonality'
  | 'contract_terms'
  | 'sales_productivity'
  | 'discounting';

export interface InputField {
  name: string;
  label: string;
  type: 'number' | 'percentage' | 'currency' | 'array';
  required: boolean;
  defaultValue?: number | number[];
  min?: number;
  max?: number;
  description?: string;
}

export interface DriverTemplate {
  id: string;
  user_id: string;
  name: string;
  type: DriverType;
  description?: string;
  formula: string;
  input_schema: InputField[];
  created_at: string;
  updated_at: string;
}

export interface DriverInputs {
  [key: string]: number | number[] | string;
}

export interface DriverConfiguration {
  period_start?: string;
  period_end?: string;
  period_type?: 'month' | 'quarter';
  dependencies?: string[];
  [key: string]: unknown;
}

export interface DriverInstance {
  id: string;
  user_id: string;
  forecast_version_id?: string;
  template_id: string;
  name: string;
  inputs: DriverInputs;
  configuration: DriverConfiguration;
  created_at: string;
  updated_at: string;
  template?: DriverTemplate;
}

export interface DriverResult {
  id: string;
  instance_id: string;
  period_type: 'month' | 'quarter';
  period_date: string;
  revenue: number;
  customers?: number;
  units?: number;
  calculated_values: Record<string, number>;
  created_at: string;
}

export interface DriverDependency {
  id: string;
  parent_instance_id: string;
  child_instance_id: string;
  mapping: Record<string, string>;
  created_at: string;
}

export interface DriverCalculationResult {
  revenue: number;
  customers?: number;
  units?: number;
  breakdown: Record<string, number>;
}

export interface VolumePriceInputs {
  base_units: number;
  growth_units_pct: number;
  base_asp: number;
  price_adjustment_pct: number;
}

export interface CACInputs {
  marketing_spend: number;
  cac: number;
  arpu: number;
  period_months: number;
}

export interface RetentionInputs {
  starting_customers: number;
  churn_rate_pct: number;
  arpu: number;
  period_months: number;
}

export interface FunnelInputs {
  leads: number;
  lead_to_opportunity_pct: number;
  opportunity_to_close_pct: number;
  arpu: number;
}

export interface SeasonalityInputs {
  base_revenue: number;
  seasonality_indices: number[];
}

export interface ContractTermsInputs {
  new_customers: number;
  contract_length_months: number;
  renewal_rate_pct: number;
  arpu: number;
}

export interface SalesProductivityInputs {
  sales_reps: number;
  quota_per_rep: number;
  ramp_up_period: number;
}

export interface DiscountingInputs {
  base_asp: number;
  discount_pct: number;
  volume_elasticity: number;
  base_units: number;
}
