import { supabase } from '../lib/supabase';

export interface Company {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export const companyService = {
  async getUserCompanies(): Promise<Company[]> {
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || '00000000-0000-0000-0000-000000000001';

    const { data, error } = await supabase
      .from('company_users')
      .select('companies(id, name, code, created_at)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
    return data?.map((cu: any) => cu.companies).filter(Boolean) || [];
  },

  async getSelectedCompany(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || '00000000-0000-0000-0000-000000000001';

    const stored = localStorage.getItem(`selected_company_${userId}`);
    if (stored) return stored;

    const companies = await this.getUserCompanies();
    if (companies.length > 0) {
      localStorage.setItem(`selected_company_${userId}`, companies[0].id);
      return companies[0].id;
    }

    return null;
  },

  setSelectedCompany(companyId: string): void {
    const { data } = supabase.auth.getSession();
    const userId = data?.session?.user?.id || '00000000-0000-0000-0000-000000000001';
    localStorage.setItem(`selected_company_${userId}`, companyId);
  },

  async getCompanyById(companyId: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
