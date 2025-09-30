import { supabase } from './supabaseClient';
import type {
  BudgetVersion,
  VarianceAnalysis,
  VarianceComment,
  RollingForecast
} from '../types/financial';

export class VarianceService {
  static async getBudgetVersions(organizationId: string, fiscalYear?: number): Promise<BudgetVersion[]> {
    let query = supabase
      .from('budget_versions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (fiscalYear) {
      query = query.eq('fiscal_year', fiscalYear);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getActiveBudgetVersion(organizationId: string, fiscalYear: number): Promise<BudgetVersion | null> {
    const { data, error } = await supabase
      .from('budget_versions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('fiscal_year', fiscalYear)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createBudgetVersion(
    version: Omit<BudgetVersion, 'id' | 'created_at' | 'updated_at'>
  ): Promise<BudgetVersion> {
    const { data, error } = await supabase
      .from('budget_versions')
      .insert(version)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBudgetVersion(
    id: string,
    updates: Partial<BudgetVersion>
  ): Promise<BudgetVersion> {
    const { data, error } = await supabase
      .from('budget_versions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async approveBudgetVersion(id: string, approvedBy: string): Promise<BudgetVersion> {
    const { data, error } = await supabase
      .from('budget_versions')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getVarianceAnalysis(
    organizationId: string,
    periodStart: string,
    periodEnd: string,
    budgetVersionId?: string
  ): Promise<VarianceAnalysis[]> {
    let query = supabase
      .from('variance_analysis')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('period_start', periodStart)
      .lte('period_end', periodEnd)
      .order('variance_amount', { ascending: false });

    if (budgetVersionId) {
      query = query.eq('budget_version_id', budgetVersionId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getSignificantVariances(
    organizationId: string,
    thresholdPercent: number = 10
  ): Promise<VarianceAnalysis[]> {
    const { data, error } = await supabase
      .from('variance_analysis')
      .select('*')
      .eq('organization_id', organizationId)
      .or(`variance_percent.gt.${thresholdPercent},variance_percent.lt.-${thresholdPercent}`)
      .order('variance_amount', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  static async createVarianceAnalysis(
    variance: Omit<VarianceAnalysis, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VarianceAnalysis> {
    const { data, error } = await supabase
      .from('variance_analysis')
      .insert(variance)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateVarianceAnalysis(
    id: string,
    updates: Partial<VarianceAnalysis>
  ): Promise<VarianceAnalysis> {
    const { data, error } = await supabase
      .from('variance_analysis')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getVarianceComments(varianceAnalysisId: string): Promise<VarianceComment[]> {
    const { data, error } = await supabase
      .from('variance_comments')
      .select('*')
      .eq('variance_analysis_id', varianceAnalysisId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async addVarianceComment(
    comment: Omit<VarianceComment, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VarianceComment> {
    const { data, error } = await supabase
      .from('variance_comments')
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getRollingForecasts(
    organizationId: string,
    horizonMonths: number = 12
  ): Promise<RollingForecast[]> {
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + horizonMonths * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data, error } = await supabase
      .from('rolling_forecasts')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('forecast_date', startDate)
      .lte('forecast_date', endDate)
      .order('forecast_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createRollingForecast(
    forecast: Omit<RollingForecast, 'id' | 'created_at' | 'updated_at'>
  ): Promise<RollingForecast> {
    const { data, error } = await supabase
      .from('rolling_forecasts')
      .insert(forecast)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRollingForecast(
    id: string,
    updates: Partial<RollingForecast>
  ): Promise<RollingForecast> {
    const { data, error } = await supabase
      .from('rolling_forecasts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async generateAIExplanation(variance: VarianceAnalysis): Promise<string> {
    const varPercent = Math.abs(variance.variance_percent);
    const isFavorable = variance.variance_type === 'favorable';

    let explanation = `The ${variance.account_name} shows a ${isFavorable ? 'favorable' : 'unfavorable'} variance of ${varPercent.toFixed(1)}% (${variance.variance_amount >= 0 ? '+' : ''}$${variance.variance_amount.toLocaleString()}). `;

    if (varPercent > 20) {
      explanation += 'This is a significant variance that requires immediate attention. ';
    } else if (varPercent > 10) {
      explanation += 'This variance is noteworthy and should be investigated. ';
    }

    if (variance.root_causes && variance.root_causes.length > 0) {
      explanation += `Key factors contributing to this variance include: ${variance.root_causes.map((rc: any) => rc.cause).join(', ')}.`;
    } else {
      explanation += 'Further investigation is recommended to identify the root causes.';
    }

    return explanation;
  }
}
