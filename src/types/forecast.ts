export interface ForecastVersion {
  id: string;
  version_number: number;
  year: number;
  name: string;
  description?: string;
  created_by?: string;
  created_at: string;
  is_active: boolean;
  total_forecasted_amount: number;
}

export interface ForecastLineItem {
  id: string;
  version_id: string;
  gl_code: string;
  gl_name: string;
  gl_type: 'revenue' | 'expense';
  month: string;
  year: number;
  forecasted_amount: number;
  actual_amount?: number;
  variance?: number;
  is_actualized: boolean;
  notes?: string;
  created_at: string;
}

export interface ForecastChangeLog {
  id: string;
  version_id: string;
  gl_code: string;
  month: string;
  year: number;
  old_value?: number;
  new_value: number;
  changed_by?: string;
  changed_at: string;
  change_reason?: string;
}

export interface SaveForecastRequest {
  year: number;
  name: string;
  description?: string;
  lineItems: Omit<ForecastLineItem, 'id' | 'version_id' | 'created_at'>[];
}
