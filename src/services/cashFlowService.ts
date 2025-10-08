import { supabase } from '../lib/supabase';
import type {
  AccountReceivable,
  AccountPayable,
  CashFlowAlert,
  CashFlowMetrics,
  TimelineDataPoint,
  OverdueItem,
  TopCustomerVendor,
  CashConversionMetrics,
} from '../types/cashFlow';

class CashFlowService {
  async getReceivables(userId?: string): Promise<AccountReceivable[]> {
    const query = supabase
      .from('accounts_receivable')
      .select('*')
      .order('due_date', { ascending: true });

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getPayables(userId?: string): Promise<AccountPayable[]> {
    const query = supabase
      .from('accounts_payable')
      .select('*')
      .order('due_date', { ascending: true });

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createReceivable(receivable: Partial<AccountReceivable>): Promise<AccountReceivable> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('accounts_receivable')
      .insert({
        ...receivable,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createPayable(payable: Partial<AccountPayable>): Promise<AccountPayable> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('accounts_payable')
      .insert({
        ...payable,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateReceivable(id: string, updates: Partial<AccountReceivable>): Promise<AccountReceivable> {
    const { data, error } = await supabase
      .from('accounts_receivable')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePayable(id: string, updates: Partial<AccountPayable>): Promise<AccountPayable> {
    const { data, error } = await supabase
      .from('accounts_payable')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReceivable(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts_receivable')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async deletePayable(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts_payable')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTimelineData(startDate: string, endDate: string): Promise<TimelineDataPoint[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const [receivables, payables] = await Promise.all([
      this.getReceivables(user.id),
      this.getPayables(user.id),
    ]);

    const dateMap = new Map<string, { receivables: number; payables: number }>();
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMap.set(dateStr, { receivables: 0, payables: 0 });
    }

    receivables.forEach((r) => {
      if (r.due_date >= startDate && r.due_date <= endDate && r.status !== 'paid') {
        const existing = dateMap.get(r.due_date) || { receivables: 0, payables: 0 };
        existing.receivables += r.amount_due - r.amount_paid;
        dateMap.set(r.due_date, existing);
      }
    });

    payables.forEach((p) => {
      if (p.due_date >= startDate && p.due_date <= endDate && p.status !== 'paid') {
        const existing = dateMap.get(p.due_date) || { receivables: 0, payables: 0 };
        existing.payables += p.amount_due - p.amount_paid;
        dateMap.set(p.due_date, existing);
      }
    });

    const timeline: TimelineDataPoint[] = [];
    let cumulativeNet = 0;

    Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, { receivables, payables }]) => {
        cumulativeNet += receivables - payables;
        timeline.push({
          date,
          receivables,
          payables,
          netCash: cumulativeNet,
        });
      });

    return timeline;
  }

  async getOverdueItems(): Promise<OverdueItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = new Date().toISOString().split('T')[0];
    const [receivables, payables] = await Promise.all([
      this.getReceivables(user.id),
      this.getPayables(user.id),
    ]);

    const overdueItems: OverdueItem[] = [];

    receivables
      .filter((r) => r.due_date < today && r.status !== 'paid')
      .forEach((r) => {
        const daysOverdue = Math.floor(
          (new Date().getTime() - new Date(r.due_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        overdueItems.push({
          id: r.id,
          type: 'receivable',
          name: r.customer_name,
          referenceNumber: r.invoice_number,
          dueDate: r.due_date,
          amountDue: r.amount_due - r.amount_paid,
          daysOverdue,
          contactEmail: r.contact_email,
          status: r.status,
        });
      });

    payables
      .filter((p) => p.due_date < today && p.status !== 'paid')
      .forEach((p) => {
        const daysOverdue = Math.floor(
          (new Date().getTime() - new Date(p.due_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        overdueItems.push({
          id: p.id,
          type: 'payable',
          name: p.vendor_name,
          referenceNumber: p.bill_number,
          dueDate: p.due_date,
          amountDue: p.amount_due - p.amount_paid,
          daysOverdue,
          contactEmail: p.contact_email,
          status: p.status,
        });
      });

    return overdueItems.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  async getTopCustomers(limit: number = 10): Promise<TopCustomerVendor[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const receivables = await this.getReceivables(user.id);
    const customerMap = new Map<string, { total: number; count: number; status: string }>();

    receivables.forEach((r) => {
      const existing = customerMap.get(r.customer_name) || { total: 0, count: 0, status: 'active' };
      existing.total += r.amount_due;
      existing.count += 1;
      customerMap.set(r.customer_name, existing);
    });

    return Array.from(customerMap.entries())
      .map(([name, data]) => ({
        name,
        totalAmount: data.total,
        transactionCount: data.count,
        averageAmount: data.total / data.count,
        status: data.status,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  }

  async getTopVendors(limit: number = 10): Promise<TopCustomerVendor[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const payables = await this.getPayables(user.id);
    const vendorMap = new Map<string, { total: number; count: number; status: string }>();

    payables.forEach((p) => {
      const existing = vendorMap.get(p.vendor_name) || { total: 0, count: 0, status: 'active' };
      existing.total += p.amount_due;
      existing.count += 1;
      vendorMap.set(p.vendor_name, existing);
    });

    return Array.from(vendorMap.entries())
      .map(([name, data]) => ({
        name,
        totalAmount: data.total,
        transactionCount: data.count,
        averageAmount: data.total / data.count,
        status: data.status,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  }

  async getCashConversionMetrics(): Promise<CashConversionMetrics> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const [receivables, payables] = await Promise.all([
      this.getReceivables(user.id),
      this.getPayables(user.id),
    ]);

    const pendingReceivables = receivables.filter((r) => r.status === 'pending' || r.status === 'overdue');
    const pendingPayables = payables.filter((p) => p.status === 'pending' || p.status === 'overdue');

    const totalReceivables = pendingReceivables.reduce((sum, r) => sum + (r.amount_due - r.amount_paid), 0);
    const totalPayables = pendingPayables.reduce((sum, p) => sum + (p.amount_due - p.amount_paid), 0);

    const avgDaysReceivable = pendingReceivables.length > 0
      ? pendingReceivables.reduce((sum, r) => {
          const days = Math.floor(
            (new Date().getTime() - new Date(r.invoice_date).getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / pendingReceivables.length
      : 0;

    const avgDaysPayable = pendingPayables.length > 0
      ? pendingPayables.reduce((sum, p) => {
          const days = Math.floor(
            (new Date().getTime() - new Date(p.bill_date).getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / pendingPayables.length
      : 0;

    const dso = avgDaysReceivable;
    const dpo = avgDaysPayable;
    const dio = 0;
    const ccc = dso + dio - dpo;

    const { data: historicalMetrics } = await supabase
      .from('cash_flow_metrics')
      .select('dso, dpo')
      .eq('user_id', user.id)
      .order('metric_date', { ascending: false })
      .limit(2);

    let dsoTrend: 'up' | 'down' | 'stable' = 'stable';
    let dpoTrend: 'up' | 'down' | 'stable' = 'stable';
    let cccTrend: 'up' | 'down' | 'stable' = 'stable';

    if (historicalMetrics && historicalMetrics.length > 1) {
      const prevDso = historicalMetrics[1].dso || 0;
      const prevDpo = historicalMetrics[1].dpo || 0;
      const prevCcc = prevDso - prevDpo;

      if (dso > prevDso * 1.05) dsoTrend = 'up';
      else if (dso < prevDso * 0.95) dsoTrend = 'down';

      if (dpo > prevDpo * 1.05) dpoTrend = 'up';
      else if (dpo < prevDpo * 0.95) dpoTrend = 'down';

      if (ccc > prevCcc * 1.05) cccTrend = 'up';
      else if (ccc < prevCcc * 0.95) cccTrend = 'down';
    }

    await supabase.from('cash_flow_metrics').upsert({
      user_id: user.id,
      metric_date: new Date().toISOString().split('T')[0],
      dso,
      dpo,
      total_receivables: totalReceivables,
      total_payables: totalPayables,
      net_cash_position: totalReceivables - totalPayables,
    });

    return {
      dso,
      dpo,
      dio,
      ccc,
      trends: { dso: dsoTrend, dpo: dpoTrend, ccc: cccTrend },
    };
  }

  async getAlerts(): Promise<CashFlowAlert[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cash_flow_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  async createAlert(alert: Partial<CashFlowAlert>): Promise<CashFlowAlert> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cash_flow_alerts')
      .insert({
        ...alert,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAlertAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('cash_flow_alerts')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  }

  async sendReminder(receivableId: string): Promise<void> {
    await this.updateReceivable(receivableId, {
      reminder_sent: true,
      reminder_sent_date: new Date().toISOString(),
    });

    const receivable = await supabase
      .from('accounts_receivable')
      .select('*')
      .eq('id', receivableId)
      .single();

    if (receivable.data) {
      await this.createAlert({
        alert_type: 'reminder_sent',
        reference_type: 'receivable',
        reference_id: receivableId,
        message: `Reminder sent to ${receivable.data.customer_name} for invoice ${receivable.data.invoice_number}`,
        priority: 'low',
      });
    }
  }

  async schedulePayment(payableId: string, scheduledDate: string): Promise<void> {
    await this.updatePayable(payableId, {
      scheduled_payment_date: scheduledDate,
    });

    const payable = await supabase
      .from('accounts_payable')
      .select('*')
      .eq('id', payableId)
      .single();

    if (payable.data) {
      await this.createAlert({
        alert_type: 'payment_due',
        reference_type: 'payable',
        reference_id: payableId,
        message: `Payment scheduled for ${payable.data.vendor_name} - ${payable.data.bill_number} on ${scheduledDate}`,
        priority: 'medium',
      });
    }
  }

  async approvePayable(payableId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await this.updatePayable(payableId, {
      approval_status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    });
  }
}

export const cashFlowService = new CashFlowService();
