export interface HiringRole {
  id: string;
  user_id: string;
  role_name: string;
  description: string;
  location_state: string;
  start_date: string;
  employment_type: 'hourly' | 'salary';
  worker_classification: 'w2' | '1099';
  hourly_rate: number;
  hours_per_week: number;
  annual_salary: number;
  base_compensation: number;
  total_loaded_cost: number;
  created_at: string;
  updated_at: string;
}

export interface TaxBreakdown {
  id: string;
  role_id: string;
  tax_type: string;
  tax_rate: number;
  tax_amount: number;
  created_at: string;
}

export interface StateTaxRate {
  id: string;
  state_code: string;
  state_name: string;
  sui_rate: number;
  workers_comp_rate: number;
  other_taxes: Record<string, unknown>;
  updated_at: string;
}

export interface RoleFormData {
  role_name: string;
  description: string;
  location_state: string;
  start_date: string;
  employment_type: 'hourly' | 'salary';
  worker_classification: 'w2' | '1099';
  hourly_rate: number;
  hours_per_week: number;
  annual_salary: number;
}
