export interface AccountReceivable {
  id: string;
  user_id: string;
  customer_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  reminder_sent: boolean;
  reminder_sent_date?: string;
  contact_email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountPayable {
  id: string;
  user_id: string;
  vendor_name: string;
  bill_number: string;
  bill_date: string;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  scheduled_payment_date?: string;
  contact_email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CashFlowAlert {
  id: string;
  user_id: string;
  alert_type: 'payment_due' | 'overdue' | 'reminder_sent' | 'approval_needed';
  reference_type?: 'receivable' | 'payable';
  reference_id?: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  created_at: string;
}

export interface CashFlowMetrics {
  id: string;
  user_id: string;
  metric_date: string;
  dso?: number;
  dpo?: number;
  total_receivables: number;
  total_payables: number;
  net_cash_position: number;
  created_at: string;
}

export interface TimelineDataPoint {
  date: string;
  receivables: number;
  payables: number;
  netCash: number;
}

export interface OverdueItem {
  id: string;
  type: 'receivable' | 'payable';
  name: string;
  referenceNumber: string;
  dueDate: string;
  amountDue: number;
  daysOverdue: number;
  contactEmail?: string;
  status: string;
}

export interface TopCustomerVendor {
  name: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  status: string;
}

export interface CashConversionMetrics {
  dso: number;
  dpo: number;
  dio: number;
  ccc: number;
  trends: {
    dso: 'up' | 'down' | 'stable';
    dpo: 'up' | 'down' | 'stable';
    ccc: 'up' | 'down' | 'stable';
  };
}
