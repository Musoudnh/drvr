import { supabase } from '../lib/supabase';
import {
  DriverType,
  DriverTemplate,
  DriverInstance,
  DriverResult,
  DriverDependency,
  DriverCalculationResult,
  DriverInputs,
  VolumePriceInputs,
  CACInputs,
  RetentionInputs,
  FunnelInputs,
  SeasonalityInputs,
  ContractTermsInputs,
  SalesProductivityInputs,
  DiscountingInputs,
} from '../types/driverLibrary';
import { addMonths, startOfMonth, format } from 'date-fns';

export class DriverCalculator {
  static volumeVsPrice(inputs: VolumePriceInputs): DriverCalculationResult {
    const units = inputs.base_units * (1 + inputs.growth_units_pct / 100);
    const price = inputs.base_asp * (1 + inputs.price_adjustment_pct / 100);
    const revenue = units * price;

    return {
      revenue,
      units,
      breakdown: {
        adjusted_units: units,
        adjusted_price: price,
        units_growth: inputs.growth_units_pct,
        price_growth: inputs.price_adjustment_pct,
      },
    };
  }

  static customerAcquisition(inputs: CACInputs): DriverCalculationResult {
    const customers = inputs.marketing_spend / inputs.cac;
    const revenue = customers * inputs.arpu * inputs.period_months;

    return {
      revenue,
      customers,
      breakdown: {
        new_customers: customers,
        ltv: inputs.arpu * inputs.period_months,
        cac_ratio: (inputs.arpu * inputs.period_months) / inputs.cac,
      },
    };
  }

  static retentionChurn(inputs: RetentionInputs): DriverCalculationResult {
    const retentionRate = 1 - inputs.churn_rate_pct / 100;
    const retainedCustomers = inputs.starting_customers * Math.pow(retentionRate, inputs.period_months);
    const revenue = retainedCustomers * inputs.arpu * inputs.period_months;

    return {
      revenue,
      customers: retainedCustomers,
      breakdown: {
        retention_rate: retentionRate * 100,
        churned_customers: inputs.starting_customers - retainedCustomers,
        retained_customers: retainedCustomers,
      },
    };
  }

  static conversionFunnel(inputs: FunnelInputs): DriverCalculationResult {
    const opportunities = inputs.leads * (inputs.lead_to_opportunity_pct / 100);
    const customers = opportunities * (inputs.opportunity_to_close_pct / 100);
    const revenue = customers * inputs.arpu;

    return {
      revenue,
      customers,
      breakdown: {
        opportunities,
        closed_customers: customers,
        conversion_rate: (inputs.lead_to_opportunity_pct / 100) * (inputs.opportunity_to_close_pct / 100) * 100,
      },
    };
  }

  static seasonality(inputs: SeasonalityInputs, monthIndex: number): DriverCalculationResult {
    const seasonalityIndex = inputs.seasonality_indices[monthIndex % 12] || 1;
    const revenue = inputs.base_revenue * seasonalityIndex;

    return {
      revenue,
      breakdown: {
        base_revenue: inputs.base_revenue,
        seasonality_index: seasonalityIndex,
        adjustment: (seasonalityIndex - 1) * 100,
      },
    };
  }

  static contractTermsRenewals(inputs: ContractTermsInputs): DriverCalculationResult {
    const newRevenue = inputs.new_customers * inputs.arpu * inputs.contract_length_months;
    const renewalRevenue = inputs.new_customers * (inputs.renewal_rate_pct / 100) * inputs.arpu * inputs.contract_length_months;
    const totalRevenue = newRevenue + renewalRevenue;

    return {
      revenue: totalRevenue,
      customers: inputs.new_customers,
      breakdown: {
        new_contract_revenue: newRevenue,
        renewal_revenue: renewalRevenue,
        total_contract_value: totalRevenue,
        expected_renewals: inputs.new_customers * (inputs.renewal_rate_pct / 100),
      },
    };
  }

  static salesRepProductivity(inputs: SalesProductivityInputs): DriverCalculationResult {
    const rampUpDiscount = Math.min(inputs.ramp_up_period / 12, 1) * 0.5;
    const effectiveQuota = inputs.quota_per_rep * (1 - rampUpDiscount);
    const revenue = inputs.sales_reps * effectiveQuota;

    return {
      revenue,
      breakdown: {
        effective_quota: effectiveQuota,
        ramp_discount: rampUpDiscount * 100,
        total_capacity: inputs.sales_reps * inputs.quota_per_rep,
        productivity_rate: (1 - rampUpDiscount) * 100,
      },
    };
  }

  static discountingPromotions(inputs: DiscountingInputs): DriverCalculationResult {
    const discountedPrice = inputs.base_asp * (1 - inputs.discount_pct / 100);
    const volumeIncrease = inputs.discount_pct * inputs.volume_elasticity;
    const adjustedUnits = inputs.base_units * (1 + volumeIncrease / 100);
    const revenue = discountedPrice * adjustedUnits;

    return {
      revenue,
      units: adjustedUnits,
      breakdown: {
        discounted_price: discountedPrice,
        adjusted_units: adjustedUnits,
        volume_lift: volumeIncrease,
        revenue_impact: ((revenue - inputs.base_asp * inputs.base_units) / (inputs.base_asp * inputs.base_units)) * 100,
      },
    };
  }

  static calculate(type: DriverType, inputs: DriverInputs, monthIndex: number = 0): DriverCalculationResult {
    switch (type) {
      case 'volume_price':
        return this.volumeVsPrice(inputs as VolumePriceInputs);
      case 'cac':
        return this.customerAcquisition(inputs as CACInputs);
      case 'retention':
        return this.retentionChurn(inputs as RetentionInputs);
      case 'funnel':
        return this.conversionFunnel(inputs as FunnelInputs);
      case 'seasonality':
        return this.seasonality(inputs as SeasonalityInputs, monthIndex);
      case 'contract_terms':
        return this.contractTermsRenewals(inputs as ContractTermsInputs);
      case 'sales_productivity':
        return this.salesRepProductivity(inputs as SalesProductivityInputs);
      case 'discounting':
        return this.discountingPromotions(inputs as DiscountingInputs);
      default:
        throw new Error(`Unknown driver type: ${type}`);
    }
  }
}

export async function getDriverTemplates(): Promise<DriverTemplate[]> {
  const { data, error } = await supabase
    .from('driver_templates')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createDriverTemplate(template: Omit<DriverTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<DriverTemplate> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('driver_templates')
    .insert({
      ...template,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDriverInstances(forecastVersionId?: string): Promise<DriverInstance[]> {
  let query = supabase
    .from('driver_instances')
    .select('*, template:driver_templates(*)');

  if (forecastVersionId) {
    query = query.eq('forecast_version_id', forecastVersionId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createDriverInstance(
  instance: Omit<DriverInstance, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<DriverInstance> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('driver_instances')
    .insert({
      ...instance,
      user_id: user.id,
    })
    .select('*, template:driver_templates(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateDriverInstance(
  id: string,
  updates: Partial<Pick<DriverInstance, 'name' | 'inputs' | 'configuration'>>
): Promise<DriverInstance> {
  const { data, error } = await supabase
    .from('driver_instances')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, template:driver_templates(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDriverInstance(id: string): Promise<void> {
  const { error } = await supabase
    .from('driver_instances')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function calculateAndStoreResults(
  instanceId: string,
  startDate: Date,
  endDate: Date,
  periodType: 'month' | 'quarter' = 'month'
): Promise<DriverResult[]> {
  const { data: instance, error: instanceError } = await supabase
    .from('driver_instances')
    .select('*, template:driver_templates(*)')
    .eq('id', instanceId)
    .single();

  if (instanceError) throw instanceError;
  if (!instance) throw new Error('Instance not found');

  const results: DriverResult[] = [];
  let currentDate = startOfMonth(startDate);
  let monthIndex = 0;

  while (currentDate <= endDate) {
    const calculation = DriverCalculator.calculate(
      instance.template.type as DriverType,
      instance.inputs,
      monthIndex
    );

    const result = {
      instance_id: instanceId,
      period_type: periodType,
      period_date: format(currentDate, 'yyyy-MM-dd'),
      revenue: calculation.revenue,
      customers: calculation.customers,
      units: calculation.units,
      calculated_values: calculation.breakdown,
    };

    const { data, error } = await supabase
      .from('driver_results')
      .upsert(result, { onConflict: 'instance_id,period_type,period_date' })
      .select()
      .single();

    if (error) throw error;
    if (data) results.push(data);

    currentDate = addMonths(currentDate, 1);
    monthIndex++;
  }

  return results;
}

export async function getDriverResults(
  instanceId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DriverResult[]> {
  let query = supabase
    .from('driver_results')
    .select('*')
    .eq('instance_id', instanceId)
    .order('period_date');

  if (startDate) {
    query = query.gte('period_date', format(startDate, 'yyyy-MM-dd'));
  }
  if (endDate) {
    query = query.lte('period_date', format(endDate, 'yyyy-MM-dd'));
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createDriverDependency(
  parentInstanceId: string,
  childInstanceId: string,
  mapping: Record<string, string>
): Promise<DriverDependency> {
  const { data, error } = await supabase
    .from('driver_dependencies')
    .insert({
      parent_instance_id: parentInstanceId,
      child_instance_id: childInstanceId,
      mapping,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDriverDependencies(instanceId: string): Promise<DriverDependency[]> {
  const { data, error } = await supabase
    .from('driver_dependencies')
    .select('*')
    .or(`parent_instance_id.eq.${instanceId},child_instance_id.eq.${instanceId}`);

  if (error) throw error;
  return data || [];
}

export async function deleteDriverDependency(id: string): Promise<void> {
  const { error } = await supabase
    .from('driver_dependencies')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const DEFAULT_DRIVER_TEMPLATES: Omit<DriverTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Volume vs. Price Split',
    type: 'volume_price',
    description: 'Calculate revenue impact of volume and price changes',
    formula: '(Base_Units * (1 + Growth_Units_%)) * (Base_ASP * (1 + Price_Adjustment_%))',
    input_schema: [
      { name: 'base_units', label: 'Base Units', type: 'number', required: true, defaultValue: 1000 },
      { name: 'growth_units_pct', label: 'Units Growth %', type: 'percentage', required: true, defaultValue: 10 },
      { name: 'base_asp', label: 'Base ASP', type: 'currency', required: true, defaultValue: 100 },
      { name: 'price_adjustment_pct', label: 'Price Adjustment %', type: 'percentage', required: true, defaultValue: 5 },
    ],
  },
  {
    name: 'Customer Acquisition (CAC)',
    type: 'cac',
    description: 'Calculate revenue from marketing spend and CAC',
    formula: '(Marketing_Spend / CAC) * ARPU * Period_Months',
    input_schema: [
      { name: 'marketing_spend', label: 'Marketing Spend', type: 'currency', required: true, defaultValue: 50000 },
      { name: 'cac', label: 'CAC', type: 'currency', required: true, defaultValue: 500 },
      { name: 'arpu', label: 'ARPU', type: 'currency', required: true, defaultValue: 100 },
      { name: 'period_months', label: 'Period (Months)', type: 'number', required: true, defaultValue: 12 },
    ],
  },
  {
    name: 'Retention & Churn',
    type: 'retention',
    description: 'Calculate revenue impact of retention and churn',
    formula: 'Starting_Customers * (1 - Churn_Rate_%)^Period_Months * ARPU * Period_Months',
    input_schema: [
      { name: 'starting_customers', label: 'Starting Customers', type: 'number', required: true, defaultValue: 1000 },
      { name: 'churn_rate_pct', label: 'Churn Rate %', type: 'percentage', required: true, defaultValue: 5 },
      { name: 'arpu', label: 'ARPU', type: 'currency', required: true, defaultValue: 100 },
      { name: 'period_months', label: 'Period (Months)', type: 'number', required: true, defaultValue: 12 },
    ],
  },
  {
    name: 'Conversion Funnel',
    type: 'funnel',
    description: 'Calculate revenue from lead conversion funnel',
    formula: 'Leads * Lead_to_Opportunity_% * Opportunity_to_Close_% * ARPU',
    input_schema: [
      { name: 'leads', label: 'Leads', type: 'number', required: true, defaultValue: 10000 },
      { name: 'lead_to_opportunity_pct', label: 'Lead to Opp %', type: 'percentage', required: true, defaultValue: 20 },
      { name: 'opportunity_to_close_pct', label: 'Opp to Close %', type: 'percentage', required: true, defaultValue: 25 },
      { name: 'arpu', label: 'ARPU', type: 'currency', required: true, defaultValue: 1000 },
    ],
  },
  {
    name: 'Seasonality',
    type: 'seasonality',
    description: 'Apply seasonal adjustments to base revenue',
    formula: 'Base_Revenue * Seasonality_Index[Month]',
    input_schema: [
      { name: 'base_revenue', label: 'Base Revenue', type: 'currency', required: true, defaultValue: 100000 },
      {
        name: 'seasonality_indices',
        label: 'Monthly Indices (12 months)',
        type: 'array',
        required: true,
        defaultValue: [0.8, 0.85, 0.9, 1.0, 1.1, 1.2, 1.15, 1.1, 1.0, 0.95, 0.9, 1.3]
      },
    ],
  },
  {
    name: 'Contract Terms & Renewals',
    type: 'contract_terms',
    description: 'Calculate revenue from contracts and renewals',
    formula: '(New_Customers * ARPU * Contract_Length) + (New_Customers * Renewal_Rate_% * ARPU * Contract_Length)',
    input_schema: [
      { name: 'new_customers', label: 'New Customers', type: 'number', required: true, defaultValue: 100 },
      { name: 'contract_length_months', label: 'Contract Length (Months)', type: 'number', required: true, defaultValue: 12 },
      { name: 'renewal_rate_pct', label: 'Renewal Rate %', type: 'percentage', required: true, defaultValue: 80 },
      { name: 'arpu', label: 'ARPU', type: 'currency', required: true, defaultValue: 500 },
    ],
  },
  {
    name: 'Sales Rep Productivity',
    type: 'sales_productivity',
    description: 'Calculate revenue from sales team productivity',
    formula: 'Sales_Reps * Quota_Per_Rep * (1 - Ramp_Up_Discount)',
    input_schema: [
      { name: 'sales_reps', label: 'Sales Reps', type: 'number', required: true, defaultValue: 10 },
      { name: 'quota_per_rep', label: 'Quota Per Rep', type: 'currency', required: true, defaultValue: 500000 },
      { name: 'ramp_up_period', label: 'Ramp Up Period (Months)', type: 'number', required: true, defaultValue: 3 },
    ],
  },
  {
    name: 'Discounting & Promotions',
    type: 'discounting',
    description: 'Calculate revenue impact of discounts and volume elasticity',
    formula: '(Base_ASP * (1 - Discount_%)) * (Base_Units * (1 + Discount_% * Volume_Elasticity))',
    input_schema: [
      { name: 'base_asp', label: 'Base ASP', type: 'currency', required: true, defaultValue: 100 },
      { name: 'discount_pct', label: 'Discount %', type: 'percentage', required: true, defaultValue: 15 },
      { name: 'volume_elasticity', label: 'Volume Elasticity', type: 'number', required: true, defaultValue: 2 },
      { name: 'base_units', label: 'Base Units', type: 'number', required: true, defaultValue: 1000 },
    ],
  },
];
