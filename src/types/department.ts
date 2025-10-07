export type RoleType = 'CEO' | 'Finance Controller' | 'Department Manager' | 'Team Member' | 'Admin';

export interface Department {
  id: string;
  name: string;
  parent_department_id: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_type: RoleType;
  department_id: string | null;
  spending_authority_limit: number;
  can_create_projects: boolean;
  can_approve_projects: boolean;
  can_manage_budgets: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApprovalThreshold {
  id: string;
  tier_name: string;
  min_amount: number;
  max_amount: number | null;
  required_roles: string[];
  approval_order: number;
  require_sequential: boolean;
  sla_hours: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentBudgetAllocation {
  id: string;
  department_id: string;
  fiscal_year: number;
  scenario: 'Base Case' | 'Best Case' | 'Downside Case';
  allocated_budget: number;
  committed_budget: number;
  spent_budget: number;
  available_budget: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectApprovalWorkflow {
  id: string;
  project_id: string;
  threshold_tier_id: string | null;
  current_step: number;
  total_steps: number;
  required_approvers: string[];
  completed_approvers: string[];
  pending_approvers: string[];
  workflow_status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'revision_requested';
  submitted_at: string;
  completed_at: string | null;
  sla_deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentWithBudget extends Department {
  budget_allocations?: DepartmentBudgetAllocation[];
  members?: UserRole[];
}
