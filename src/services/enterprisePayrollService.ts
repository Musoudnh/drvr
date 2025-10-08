import { supabase } from '../lib/supabase';
import type {
  Employee,
  Department,
  CompensationHistory,
  PayrollRun,
  PayrollLineItem,
  TaxRate,
  PayrollCalculation,
  EmployeeFilter,
  PayrollSummary,
} from '../types/payroll';

class EnterprisePayrollService {
  async getEmployees(filters?: EmployeeFilter): Promise<Employee[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('employees')
      .select('*')
      .eq('user_id', user.id)
      .order('last_name', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.department) {
      query = query.eq('department_name', filters.department);
    }
    if (filters?.location) {
      query = query.eq('location', filters.location);
    }
    if (filters?.employmentType) {
      query = query.eq('employment_type', filters.employmentType);
    }
    if (filters?.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getEmployee(id: string): Promise<Employee | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createEmployee(employee: Partial<Employee>): Promise<Employee> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('employees')
      .insert([{ ...employee, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('employees')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEmployee(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  async bulkImportEmployees(employees: Partial<Employee>[]): Promise<{ success: number; errors: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const employeesWithUser = employees.map(emp => ({
      ...emp,
      user_id: user.id,
    }));

    const { data, error } = await supabase
      .from('employees')
      .insert(employeesWithUser)
      .select();

    if (error) {
      return { success: 0, errors: employees.length };
    }

    return { success: data?.length || 0, errors: employees.length - (data?.length || 0) };
  }

  async getDepartments(): Promise<Department[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createDepartment(department: Partial<Department>): Promise<Department> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('departments')
      .insert([{ ...department, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCompensationHistory(employeeId: string): Promise<CompensationHistory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('compensation_history')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('user_id', user.id)
      .order('effective_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addCompensationRecord(record: Partial<CompensationHistory>): Promise<CompensationHistory> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('compensation_history')
      .insert([{ ...record, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPayrollRuns(status?: string): Promise<PayrollRun[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('payroll_runs')
      .select('*')
      .eq('user_id', user.id)
      .order('pay_period_start', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createPayrollRun(run: Partial<PayrollRun>): Promise<PayrollRun> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('payroll_runs')
      .insert([{ ...run, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePayrollRun(id: string, updates: Partial<PayrollRun>): Promise<PayrollRun> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('payroll_runs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPayrollLineItems(runId: string): Promise<PayrollLineItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('payroll_line_items')
      .select('*, employees(*)')
      .eq('payroll_run_id', runId)
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  }

  async calculatePayroll(
    employee: Employee,
    hours: number = 80,
    overtimeHours: number = 0,
    bonus: number = 0
  ): Promise<PayrollCalculation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: taxRates } = await supabase
      .from('tax_rates_by_state')
      .select('*')
      .eq('state', employee.state)
      .eq('year', new Date().getFullYear())
      .eq('user_id', user.id)
      .maybeSingle();

    const rates = taxRates || {
      federal_rate: 0.22,
      state_rate: 0.05,
      social_security_rate: 0.062,
      medicare_rate: 0.0145,
    };

    let regularPay = 0;
    let overtimePay = 0;

    if (employee.employee_type === 'hourly' && employee.hourly_rate) {
      regularPay = hours * employee.hourly_rate;
      overtimePay = overtimeHours * employee.hourly_rate * 1.5;
    } else if (employee.employee_type === 'salary' && employee.annual_salary) {
      regularPay = employee.annual_salary / 26;
    }

    const grossPay = regularPay + overtimePay + bonus;

    const federalTax = grossPay * rates.federal_rate;
    const stateTax = grossPay * rates.state_rate;
    const socialSecurity = Math.min(grossPay * rates.social_security_rate, 160200 * rates.social_security_rate / 26);
    const medicare = grossPay * rates.medicare_rate;

    const totalTaxes = federalTax + stateTax + socialSecurity + medicare;
    const totalDeductions = totalTaxes + (employee.additional_withholding || 0);
    const netPay = grossPay - totalDeductions;

    return {
      grossPay,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalTaxes,
      totalDeductions,
      netPay,
    };
  }

  async processPayrollRun(runId: string, employees: Employee[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const lineItems: Partial<PayrollLineItem>[] = [];
    let totalGross = 0;
    let totalTaxes = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    for (const employee of employees) {
      const calculation = await this.calculatePayroll(employee, 80, 0, 0);

      const lineItem: Partial<PayrollLineItem> = {
        payroll_run_id: runId,
        employee_id: employee.id,
        regular_hours: 80,
        overtime_hours: 0,
        pto_hours: 0,
        regular_pay: calculation.grossPay,
        overtime_pay: 0,
        bonus: 0,
        commission: 0,
        gross_pay: calculation.grossPay,
        federal_tax: calculation.federalTax,
        state_tax: calculation.stateTax,
        social_security: calculation.socialSecurity,
        medicare: calculation.medicare,
        health_insurance: 0,
        retirement_401k: 0,
        other_deductions: 0,
        total_taxes: calculation.totalTaxes,
        total_deductions: calculation.totalDeductions,
        net_pay: calculation.netPay,
        user_id: user.id,
      };

      lineItems.push(lineItem);
      totalGross += calculation.grossPay;
      totalTaxes += calculation.totalTaxes;
      totalDeductions += calculation.totalDeductions;
      totalNet += calculation.netPay;
    }

    const { error: lineItemsError } = await supabase
      .from('payroll_line_items')
      .insert(lineItems);

    if (lineItemsError) throw lineItemsError;

    await this.updatePayrollRun(runId, {
      total_gross: totalGross,
      total_taxes: totalTaxes,
      total_deductions: totalDeductions,
      total_net: totalNet,
      employee_count: employees.length,
      status: 'Processing',
    });
  }

  async getPayrollSummary(): Promise<PayrollSummary> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const employees = await this.getEmployees({ status: 'Active' });

    const totalEmployees = employees.length;
    let totalGrossPay = 0;
    let totalNetPay = 0;
    let totalTaxes = 0;

    const byDepartment: Map<string, { count: number; totalPay: number }> = new Map();
    const byLocation: Map<string, { count: number; totalPay: number }> = new Map();

    for (const employee of employees) {
      const annualPay = employee.annual_salary || (employee.hourly_rate || 0) * (employee.weekly_hours || 40) * 52;
      totalGrossPay += annualPay;

      const dept = employee.department_name || 'Unassigned';
      const deptData = byDepartment.get(dept) || { count: 0, totalPay: 0 };
      byDepartment.set(dept, {
        count: deptData.count + 1,
        totalPay: deptData.totalPay + annualPay,
      });

      const loc = employee.location || 'Unknown';
      const locData = byLocation.get(loc) || { count: 0, totalPay: 0 };
      byLocation.set(loc, {
        count: locData.count + 1,
        totalPay: locData.totalPay + annualPay,
      });
    }

    const averageSalary = totalEmployees > 0 ? totalGrossPay / totalEmployees : 0;

    return {
      totalEmployees,
      totalGrossPay,
      totalNetPay,
      totalTaxes,
      averageSalary,
      byDepartment: Array.from(byDepartment.entries()).map(([department, data]) => ({
        department,
        count: data.count,
        totalPay: data.totalPay,
      })),
      byLocation: Array.from(byLocation.entries()).map(([location, data]) => ({
        location,
        count: data.count,
        totalPay: data.totalPay,
      })),
    };
  }

  async exportToCSV(employees: Employee[]): Promise<string> {
    const headers = [
      'Employee Number',
      'First Name',
      'Last Name',
      'Email',
      'Department',
      'Job Title',
      'Employment Type',
      'Location',
      'State',
      'Status',
      'Start Date',
      'Annual Salary',
      'Hourly Rate',
    ];

    const rows = employees.map(emp => [
      emp.employee_number || '',
      emp.first_name,
      emp.last_name,
      emp.email || '',
      emp.department_name || '',
      emp.job_title || '',
      emp.employment_type || '',
      emp.location || '',
      emp.state,
      emp.status || '',
      emp.start_date || '',
      emp.annual_salary?.toString() || '',
      emp.hourly_rate?.toString() || '',
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  }

  parseCSV(csv: string): Partial<Employee>[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    const employees: Partial<Employee>[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      const employee: Partial<Employee> = {
        employee_number: values[0] || undefined,
        first_name: values[1],
        last_name: values[2],
        email: values[3] || undefined,
        department_name: values[4] || undefined,
        job_title: values[5] || undefined,
        employment_type: values[6] || 'Full-time',
        location: values[7] || undefined,
        state: values[8] || 'CA',
        status: values[9] || 'Active',
        start_date: values[10] || undefined,
        employee_type: values[11] ? 'salary' : 'hourly',
        annual_salary: values[11] ? parseFloat(values[11]) : undefined,
        hourly_rate: values[12] ? parseFloat(values[12]) : undefined,
      };

      employees.push(employee);
    }

    return employees;
  }
}

export const enterprisePayrollService = new EnterprisePayrollService();
