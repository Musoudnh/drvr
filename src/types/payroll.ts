export interface Employee {
  id: string;
  user_id: string;
  employee_number?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  department_name?: string;
  job_title?: string;
  employee_type: 'salary' | 'hourly';
  employment_type?: string;
  classification?: string;
  location?: string;
  state: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  manager_name?: string;
  cost_center?: string;
  annual_salary?: number;
  hourly_rate?: number;
  weekly_hours?: number;
  filing_status?: string;
  allowances?: number;
  additional_withholding?: number;
  bonus_eligible?: boolean;
  pto_days_annual?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  manager_name?: string;
  budget_annual: number;
  headcount_target: number;
  headcount_current: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
  user_id: string;
}

export interface CompensationHistory {
  id: string;
  employee_id: string;
  effective_date: string;
  end_date?: string;
  base_salary: number;
  hourly_rate: number;
  pay_frequency: string;
  currency: string;
  bonus_eligible: boolean;
  annual_bonus_target: number;
  commission_rate: number;
  overtime_eligible: boolean;
  benefits_package: string;
  health_insurance_cost: number;
  retirement_match_percent: number;
  pto_days_annual: number;
  equity_shares: number;
  notes?: string;
  created_at?: string;
  user_id: string;
}

export interface PayrollRun {
  id: string;
  run_number: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  status: 'Draft' | 'Processing' | 'Approved' | 'Paid';
  total_gross: number;
  total_taxes: number;
  total_deductions: number;
  total_net: number;
  employee_count: number;
  processed_by_name?: string;
  approved_by_name?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}

export interface PayrollLineItem {
  id: string;
  payroll_run_id: string;
  employee_id: string;
  regular_hours: number;
  overtime_hours: number;
  pto_hours: number;
  regular_pay: number;
  overtime_pay: number;
  bonus: number;
  commission: number;
  gross_pay: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  health_insurance: number;
  retirement_401k: number;
  other_deductions: number;
  total_taxes: number;
  total_deductions: number;
  net_pay: number;
  created_at?: string;
  user_id: string;
}

export interface TaxRate {
  id: string;
  state: string;
  year: number;
  federal_rate: number;
  state_rate: number;
  social_security_rate: number;
  medicare_rate: number;
  sui_rate: number;
  futa_rate: number;
  created_at?: string;
  user_id: string;
}

export interface PayrollCalculation {
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  totalTaxes: number;
  totalDeductions: number;
  netPay: number;
}

export interface EmployeeFilter {
  status?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  search?: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxes: number;
  averageSalary: number;
  byDepartment: {
    department: string;
    count: number;
    totalPay: number;
  }[];
  byLocation: {
    location: string;
    count: number;
    totalPay: number;
  }[];
}
