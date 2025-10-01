import { supabase } from '../lib/supabase';
import { StateTaxRate, TaxBreakdown } from '../types/hiring';

export interface TaxCalculation {
  baseCompensation: number;
  taxes: Array<{
    type: string;
    rate: number;
    amount: number;
  }>;
  totalLoadedCost: number;
}

const FEDERAL_TAX_RATES = {
  socialSecurity: 0.062,
  medicare: 0.0145,
  futa: 0.006,
};

export const taxCalculationService = {
  async calculateFullyLoadedCost(
    employmentType: 'hourly' | 'salary',
    workerClassification: 'w2' | '1099',
    hourlyRate: number,
    hoursPerWeek: number,
    annualSalary: number,
    locationState: string
  ): Promise<TaxCalculation> {
    let baseCompensation = 0;

    if (employmentType === 'hourly') {
      baseCompensation = hourlyRate * hoursPerWeek * 52;
    } else {
      baseCompensation = annualSalary;
    }

    const taxes: Array<{ type: string; rate: number; amount: number }> = [];

    if (workerClassification === 'w2') {
      taxes.push({
        type: 'Social Security',
        rate: FEDERAL_TAX_RATES.socialSecurity,
        amount: baseCompensation * FEDERAL_TAX_RATES.socialSecurity,
      });

      taxes.push({
        type: 'Medicare',
        rate: FEDERAL_TAX_RATES.medicare,
        amount: baseCompensation * FEDERAL_TAX_RATES.medicare,
      });

      const futaBase = Math.min(baseCompensation, 7000);
      taxes.push({
        type: 'FUTA',
        rate: FEDERAL_TAX_RATES.futa,
        amount: futaBase * FEDERAL_TAX_RATES.futa,
      });

      const stateTaxRate = await this.getStateTaxRate(locationState);
      if (stateTaxRate) {
        taxes.push({
          type: 'State Unemployment (SUI)',
          rate: stateTaxRate.sui_rate,
          amount: baseCompensation * stateTaxRate.sui_rate,
        });

        taxes.push({
          type: "Workers' Compensation",
          rate: stateTaxRate.workers_comp_rate,
          amount: baseCompensation * stateTaxRate.workers_comp_rate,
        });
      }
    }

    const totalTaxes = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalLoadedCost = baseCompensation + totalTaxes;

    return {
      baseCompensation,
      taxes,
      totalLoadedCost,
    };
  },

  async getStateTaxRate(stateCode: string): Promise<StateTaxRate | null> {
    const { data, error } = await supabase
      .from('state_tax_rates')
      .select('*')
      .eq('state_code', stateCode)
      .maybeSingle();

    if (error) {
      console.error('Error fetching state tax rate:', error);
      return null;
    }

    return data;
  },

  async getAllStates(): Promise<StateTaxRate[]> {
    const { data, error } = await supabase
      .from('state_tax_rates')
      .select('*')
      .order('state_name');

    if (error) {
      console.error('Error fetching states:', error);
      return [];
    }

    return data || [];
  },

  async saveTaxBreakdown(
    roleId: string,
    taxes: Array<{ type: string; rate: number; amount: number }>
  ): Promise<void> {
    const taxBreakdowns = taxes.map((tax) => ({
      role_id: roleId,
      tax_type: tax.type,
      tax_rate: tax.rate,
      tax_amount: tax.amount,
    }));

    const { error } = await supabase
      .from('hiring_role_tax_breakdown')
      .insert(taxBreakdowns);

    if (error) {
      console.error('Error saving tax breakdown:', error);
      throw error;
    }
  },

  async getTaxBreakdown(roleId: string): Promise<TaxBreakdown[]> {
    const { data, error } = await supabase
      .from('hiring_role_tax_breakdown')
      .select('*')
      .eq('role_id', roleId)
      .order('created_at');

    if (error) {
      console.error('Error fetching tax breakdown:', error);
      return [];
    }

    return data || [];
  },
};
