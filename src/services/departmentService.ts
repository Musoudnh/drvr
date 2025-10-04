import { supabase } from '../lib/supabase';
import type {
  Department,
  UserRole,
  ApprovalThreshold,
  DepartmentBudgetAllocation,
  ProjectApprovalWorkflow,
  DepartmentWithBudget,
  RoleType
} from '../types/department';

export const departmentService = {
  async getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getDepartmentById(id: string): Promise<DepartmentWithBudget | null> {
    const { data: department, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!department) return null;

    const [budgetAllocations, members] = await Promise.all([
      this.getDepartmentBudgetAllocations(id),
      this.getDepartmentMembers(id)
    ]);

    return {
      ...department,
      budget_allocations: budgetAllocations,
      members
    };
  },

  async createDepartment(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert(department)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDepartment(id: string, updates: Partial<Department>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDepartment(id: string): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getUserRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async getDepartmentMembers(departmentId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('department_id', departmentId);

    if (error) throw error;
    return data || [];
  },

  async createUserRole(role: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_roles')
      .insert(role)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserRole(id: string, updates: Partial<UserRole>): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_roles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUserRole(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getApprovalThresholds(): Promise<ApprovalThreshold[]> {
    const { data, error } = await supabase
      .from('approval_thresholds')
      .select('*')
      .order('min_amount', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getApprovalThresholdForAmount(amount: number): Promise<ApprovalThreshold | null> {
    const { data, error } = await supabase
      .from('approval_thresholds')
      .select('*')
      .lte('min_amount', amount)
      .or(`max_amount.is.null,max_amount.gte.${amount}`)
      .order('min_amount', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createApprovalThreshold(threshold: Omit<ApprovalThreshold, 'id' | 'created_at' | 'updated_at'>): Promise<ApprovalThreshold> {
    const { data, error } = await supabase
      .from('approval_thresholds')
      .insert(threshold)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApprovalThreshold(id: string, updates: Partial<ApprovalThreshold>): Promise<ApprovalThreshold> {
    const { data, error } = await supabase
      .from('approval_thresholds')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteApprovalThreshold(id: string): Promise<void> {
    const { error } = await supabase
      .from('approval_thresholds')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getDepartmentBudgetAllocations(departmentId: string): Promise<DepartmentBudgetAllocation[]> {
    const { data, error } = await supabase
      .from('department_budget_allocations')
      .select('*')
      .eq('department_id', departmentId)
      .order('fiscal_year', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getDepartmentBudgetByYear(departmentId: string, fiscalYear: number, scenario: string): Promise<DepartmentBudgetAllocation | null> {
    const { data, error } = await supabase
      .from('department_budget_allocations')
      .select('*')
      .eq('department_id', departmentId)
      .eq('fiscal_year', fiscalYear)
      .eq('scenario', scenario)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createDepartmentBudget(budget: Omit<DepartmentBudgetAllocation, 'id' | 'created_at' | 'updated_at' | 'available_budget'>): Promise<DepartmentBudgetAllocation> {
    const { data, error } = await supabase
      .from('department_budget_allocations')
      .insert(budget)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDepartmentBudget(id: string, updates: Partial<DepartmentBudgetAllocation>): Promise<DepartmentBudgetAllocation> {
    const { data, error } = await supabase
      .from('department_budget_allocations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async allocateBudgetToDepartment(
    departmentId: string,
    fiscalYear: number,
    scenario: string,
    amount: number
  ): Promise<DepartmentBudgetAllocation> {
    const existing = await this.getDepartmentBudgetByYear(departmentId, fiscalYear, scenario);

    if (existing) {
      return this.updateDepartmentBudget(existing.id, { allocated_budget: amount });
    } else {
      return this.createDepartmentBudget({
        department_id: departmentId,
        fiscal_year: fiscalYear,
        scenario,
        allocated_budget: amount,
        committed_budget: 0,
        spent_budget: 0
      });
    }
  },

  async getProjectApprovalWorkflow(projectId: string): Promise<ProjectApprovalWorkflow | null> {
    const { data, error } = await supabase
      .from('project_approval_workflow')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProjectApprovalWorkflow(workflow: Omit<ProjectApprovalWorkflow, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectApprovalWorkflow> {
    const { data, error } = await supabase
      .from('project_approval_workflow')
      .insert(workflow)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProjectApprovalWorkflow(id: string, updates: Partial<ProjectApprovalWorkflow>): Promise<ProjectApprovalWorkflow> {
    const { data, error } = await supabase
      .from('project_approval_workflow')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserPendingApprovals(userId: string, roleType: RoleType): Promise<ProjectApprovalWorkflow[]> {
    const { data, error } = await supabase
      .from('project_approval_workflow')
      .select('*')
      .contains('pending_approvers', [roleType])
      .in('workflow_status', ['pending', 'in_progress'])
      .order('submitted_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async canUserApprove(userId: string, projectBudget: number): Promise<boolean> {
    const roles = await this.getUserRoles(userId);

    for (const role of roles) {
      if (role.can_approve_projects && role.spending_authority_limit >= projectBudget) {
        return true;
      }
    }

    return false;
  }
};
