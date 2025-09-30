import { supabase } from './supabaseClient';
import type {
  CashFlowForecast,
  ARaging,
  APTiming,
  WorkingCapitalSnapshot,
  SeasonalPattern
} from '../types/financial';

export class CashFlowService {
  static async getCashFlowForecasts(
    organizationId: string,
    startDate: string,
    endDate: string
  ): Promise<CashFlowForecast[]> {
    const { data, error } = await supabase
      .from('cash_flow_forecasts')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('forecast_date', startDate)
      .lte('forecast_date', endDate)
      .order('forecast_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createCashFlowForecast(
    forecast: Omit<CashFlowForecast, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CashFlowForecast> {
    const { data, error } = await supabase
      .from('cash_flow_forecasts')
      .insert(forecast)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCashFlowForecast(
    id: string,
    updates: Partial<CashFlowForecast>
  ): Promise<CashFlowForecast> {
    const { data, error } = await supabase
      .from('cash_flow_forecasts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getARAgingReport(organizationId: string): Promise<ARaging[]> {
    const { data, error } = await supabase
      .from('ar_aging')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'open')
      .order('days_outstanding', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getARAgingByBucket(
    organizationId: string
  ): Promise<Record<string, ARaging[]>> {
    const data = await this.getARAgingReport(organizationId);

    return data.reduce((acc, item) => {
      if (!acc[item.aging_bucket]) {
        acc[item.aging_bucket] = [];
      }
      acc[item.aging_bucket].push(item);
      return acc;
    }, {} as Record<string, ARaging[]>);
  }

  static async createARAgingEntry(
    entry: Omit<ARaging, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ARaging> {
    const { data, error } = await supabase
      .from('ar_aging')
      .insert(entry)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateARAgingEntry(
    id: string,
    updates: Partial<ARaging>
  ): Promise<ARaging> {
    const { data, error } = await supabase
      .from('ar_aging')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAPTimingOptimization(organizationId: string): Promise<APTiming[]> {
    const { data, error } = await supabase
      .from('ap_timing')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'scheduled')
      .order('optimal_payment_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createAPTimingEntry(
    entry: Omit<APTiming, 'id' | 'created_at' | 'updated_at'>
  ): Promise<APTiming> {
    const { data, error } = await supabase
      .from('ap_timing')
      .insert(entry)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAPTimingEntry(
    id: string,
    updates: Partial<APTiming>
  ): Promise<APTiming> {
    const { data, error } = await supabase
      .from('ap_timing')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getLatestWorkingCapitalSnapshot(
    organizationId: string
  ): Promise<WorkingCapitalSnapshot | null> {
    const { data, error } = await supabase
      .from('working_capital_snapshots')
      .select('*')
      .eq('organization_id', organizationId)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getWorkingCapitalHistory(
    organizationId: string,
    months: number = 12
  ): Promise<WorkingCapitalSnapshot[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data, error } = await supabase
      .from('working_capital_snapshots')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('snapshot_date', startDate.toISOString().split('T')[0])
      .order('snapshot_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createWorkingCapitalSnapshot(
    snapshot: Omit<WorkingCapitalSnapshot, 'id' | 'created_at'>
  ): Promise<WorkingCapitalSnapshot> {
    const { data, error } = await supabase
      .from('working_capital_snapshots')
      .insert(snapshot)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSeasonalPatterns(
    organizationId: string,
    metricName?: string
  ): Promise<SeasonalPattern[]> {
    let query = supabase
      .from('seasonal_patterns')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('month', { ascending: true });

    if (metricName) {
      query = query.eq('metric_name', metricName);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async createSeasonalPattern(
    pattern: Omit<SeasonalPattern, 'id' | 'detected_at'>
  ): Promise<SeasonalPattern> {
    const { data, error } = await supabase
      .from('seasonal_patterns')
      .insert(pattern)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async calculateCashRunway(
    organizationId: string
  ): Promise<{
    runway_days: number;
    burn_rate: number;
    estimated_depletion_date: string;
  }> {
    const forecasts = await this.getCashFlowForecasts(
      organizationId,
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    const outflows = forecasts
      .filter(f => f.forecast_type === 'outflow')
      .reduce((sum, f) => sum + f.forecast_amount, 0);

    const inflows = forecasts
      .filter(f => f.forecast_type === 'inflow')
      .reduce((sum, f) => sum + f.forecast_amount, 0);

    const monthlyBurnRate = (outflows - inflows) / 12;

    const currentSnapshot = await this.getLatestWorkingCapitalSnapshot(organizationId);
    const currentCash = currentSnapshot?.current_assets || 0;

    const runwayDays = monthlyBurnRate > 0
      ? Math.floor((currentCash / monthlyBurnRate) * 30)
      : 999;

    const depletionDate = new Date();
    depletionDate.setDate(depletionDate.getDate() + runwayDays);

    return {
      runway_days: runwayDays,
      burn_rate: monthlyBurnRate,
      estimated_depletion_date: depletionDate.toISOString().split('T')[0]
    };
  }
}
