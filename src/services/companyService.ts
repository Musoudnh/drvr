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
    if (!user) return [];

    const { data, error } = await supabase
      .from('company_users')
      .select('companies(id, name, code, created_at)')
      .eq('user_id', user.id);

    if (error) throw error;
    return data?.map((cu: any) => cu.companies).filter(Boolean) || [];
  },

  async getSelectedCompany(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const stored = localStorage.getItem(`selected_company_${user.id}`);
    if (stored) return stored;

    const companies = await this.getUserCompanies();
    if (companies.length > 0) {
      localStorage.setItem(`selected_company_${user.id}`, companies[0].id);
      return companies[0].id;
    }

    return null;
  },

  setSelectedCompany(companyId: string): void {
    const { data } = supabase.auth.getSession();
    if (data?.session?.user?.id) {
      localStorage.setItem(`selected_company_${data.session.user.id}`, companyId);
    }
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
