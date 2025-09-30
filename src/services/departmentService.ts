import { supabase } from './supabaseClient';
import type {
  Department,
  CostCenter,
  CostAllocation,
  DepartmentBudget,
  DepartmentKPI,
  InterDepartmentCharge
} from '../types/financial';

export class DepartmentService {
  static async getDepartments(organizationId: string, activeOnly: boolean = true): Promise<Department[]> {
    let query = supabase
      .from('departments')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getDepartmentById(id: string): Promise<Department | null> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createDepartment(
    department: Omit<Department, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert(department)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDepartment(
    id: string,
    updates: Partial<Department>
  ): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCostCenters(organizationId: string): Promise<CostCenter[]> {
    const { data, error} = await supabase
      .from('cost_centers')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('code', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createCostCenter(
    costCenter: Omit<CostCenter, 'id' | 'created_at'>
  ): Promise<CostCenter> {
    const { data, error } = await supabase
      .from('cost_centers')
      .insert(costCenter)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCostAllocations(organizationId: string): Promise<CostAllocation[]> {
    const { data, error } = await supabase
      .from('cost_allocations')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('effective_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createCostAllocation(
    allocation: Omit<CostAllocation, 'id' | 'created_at'>
  ): Promise<CostAllocation> {
    const { data, error } = await supabase
      .from('cost_allocations')
      .insert(allocation)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getDepartmentBudget(
    departmentId: string,
    budgetVersionId: string
  ): Promise<DepartmentBudget[]> {
    const { data, error } = await supabase
      .from('department_budgets')
      .select('*')
      .eq('department_id', departmentId)
      .eq('budget_version_id', budgetVersionId)
      .order('period_start', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createDepartmentBudget(
    budget: Omit<DepartmentBudget, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DepartmentBudget> {
    const { data, error } = await supabase
      .from('department_budgets')
      .insert(budget)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDepartmentBudget(
    id: string,
    updates: Partial<DepartmentBudget>
  ): Promise<DepartmentBudget> {
    const { data, error } = await supabase
      .from('department_budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getDepartmentKPIs(departmentId: string): Promise<DepartmentKPI[]> {
    const { data, error } = await supabase
      .from('department_kpis')
      .select('*')
      .eq('department_id', departmentId)
      .order('kpi_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async updateDepartmentKPI(
    id: string,
    updates: Partial<DepartmentKPI>
  ): Promise<DepartmentKPI> {
    const { data, error } = await supabase
      .from('department_kpis')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getInterDepartmentCharges(
    organizationId: string,
    departmentId?: string
  ): Promise<InterDepartmentCharge[]> {
    let query = supabase
      .from('inter_department_charges')
      .select('*')
      .eq('organization_id', organizationId)
      .order('charge_date', { ascending: false });

    if (departmentId) {
      query = query.or(`from_department_id.eq.${departmentId},to_department_id.eq.${departmentId}`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async createInterDepartmentCharge(
    charge: Omit<InterDepartmentCharge, 'id' | 'created_at'>
  ): Promise<InterDepartmentCharge> {
    const { data, error } = await supabase
      .from('inter_department_charges')
      .insert(charge)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async approveInterDepartmentCharge(id: string): Promise<InterDepartmentCharge> {
    const { data, error } = await supabase
      .from('inter_department_charges')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
