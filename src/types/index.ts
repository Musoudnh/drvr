export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'company' | 'team_member';
  company?: string;
  avatar?: string;
}

export type {
  Department,
  UserRole,
  ApprovalThreshold,
  DepartmentBudgetAllocation,
  ProjectApprovalWorkflow,
  DepartmentWithBudget,
  RoleType
} from './department';

export interface Company {
  id: string;
  name: string;
  plan: 'starter' | 'professional' | 'enterprise';
  members: number;
  industry: string;
}

export interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  period: string;
}

export interface Navigation {
  path: string;
  label: string;
  icon: string;
  children?: Navigation[];
}