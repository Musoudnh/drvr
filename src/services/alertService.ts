import { supabase } from './supabaseClient';
import type { Alert, AlertRule, Anomaly, AlertAnalytics } from '../types/financial';

export class AlertService {
  static async getAlertRules(organizationId: string, activeOnly: boolean = true): Promise<AlertRule[]> {
    let query = supabase
      .from('alert_rules')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async createAlertRule(
    rule: Omit<AlertRule, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AlertRule> {
    const { data, error } = await supabase
      .from('alert_rules')
      .insert(rule)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAlertRule(
    id: string,
    updates: Partial<AlertRule>
  ): Promise<AlertRule> {
    const { data, error } = await supabase
      .from('alert_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAlertRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('alert_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getAlerts(
    organizationId: string,
    status?: string,
    limit: number = 50
  ): Promise<Alert[]> {
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getActiveAlerts(organizationId: string): Promise<Alert[]> {
    return this.getAlerts(organizationId, 'active');
  }

  static async createAlert(
    alert: Omit<Alert, 'id' | 'created_at'>
  ): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async acknowledgeAlert(id: string, userId: string): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .update({
        status: 'acknowledged',
        acknowledged_by: userId,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async resolveAlert(
    id: string,
    userId: string,
    resolutionNotes?: string
  ): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .update({
        status: 'resolved',
        resolved_by: userId,
        resolved_at: new Date().toISOString(),
        resolution_notes: resolutionNotes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAnomalies(
    organizationId: string,
    status?: string
  ): Promise<Anomaly[]> {
    let query = supabase
      .from('anomalies')
      .select('*')
      .eq('organization_id', organizationId)
      .order('detection_date', { ascending: false })
      .limit(100);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async updateAnomaly(
    id: string,
    updates: Partial<Anomaly>
  ): Promise<Anomaly> {
    const { data, error } = await supabase
      .from('anomalies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAlertAnalytics(organizationId: string): Promise<AlertAnalytics[]> {
    const { data, error } = await supabase
      .from('alert_analytics')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  }

  static async recordAlertAnalytics(
    analytics: Omit<AlertAnalytics, 'id' | 'created_at'>
  ): Promise<AlertAnalytics> {
    const { data, error } = await supabase
      .from('alert_analytics')
      .insert(analytics)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAlertStats(organizationId: string): Promise<{
    total: number;
    active: number;
    resolved: number;
    avgResponseTime: number;
    avgResolutionTime: number;
  }> {
    const [alerts, analytics] = await Promise.all([
      this.getAlerts(organizationId, undefined, 1000),
      this.getAlertAnalytics(organizationId)
    ]);

    const active = alerts.filter(a => a.status === 'active').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;

    const avgResponseTime = analytics.reduce((sum, a) => sum + (a.response_time_minutes || 0), 0) / (analytics.length || 1);
    const avgResolutionTime = analytics.reduce((sum, a) => sum + (a.resolution_time_minutes || 0), 0) / (analytics.length || 1);

    return {
      total: alerts.length,
      active,
      resolved,
      avgResponseTime,
      avgResolutionTime
    };
  }
}
