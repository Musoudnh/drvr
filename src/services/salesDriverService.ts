import { supabase } from '../lib/supabase';
import type {
  SalesScenario,
  SalesDriver,
  DriverParameters,
  VolumePriceParameters,
  CACParameters,
  RetentionParameters,
  FunnelParameters,
  SeasonalityParameters,
  ContractTermsParameters,
  RepProductivityParameters,
  DiscountingParameters,
  CalculatedScenarioImpact,
  SalesDriverResult
} from '../types/salesDriver';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class SalesDriverService {
  private static getMonthIndex(month: string): number {
    return MONTHS.indexOf(month);
  }

  private static isMonthInRange(month: string, startMonth: string, endMonth: string): boolean {
    const monthIdx = this.getMonthIndex(month);
    const startIdx = this.getMonthIndex(startMonth);
    const endIdx = this.getMonthIndex(endMonth);

    if (startIdx <= endIdx) {
      return monthIdx >= startIdx && monthIdx <= endIdx;
    } else {
      return monthIdx >= startIdx || monthIdx <= endIdx;
    }
  }

  static calculateVolumePriceImpact(
    params: VolumePriceParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; volume: number; price: number } {
    const volumeMultiplier = 1 + (params.volumeGrowthPercent / 100) * (monthIndex / 12);
    const priceMultiplier = 1 + (params.priceGrowthPercent / 100) * (monthIndex / 12);

    const newUnits = params.baseUnits * volumeMultiplier;
    const newPrice = params.basePrice * priceMultiplier;
    const newRevenue = newUnits * newPrice;

    const baselineRevenue = params.baseUnits * params.basePrice;
    const revenueImpact = newRevenue - baselineRevenue;
    const volumeImpact = (newUnits - params.baseUnits) * params.basePrice;
    const priceImpact = params.baseUnits * (newPrice - params.basePrice);

    return {
      revenue: revenueImpact,
      volume: volumeImpact,
      price: priceImpact
    };
  }

  static calculateCACImpact(
    params: CACParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; customers: number } {
    const cac = params.marketingSpendMonthly / params.customersAcquired;
    const projectedCustomers = params.customersAcquired;
    const revenuePerCustomer = params.averageRevenuePerCustomer;

    const monthlyRevenue = projectedCustomers * revenuePerCustomer;
    const isPaybackComplete = monthIndex >= params.cacPaybackMonths;

    const adjustedRevenue = isPaybackComplete ? monthlyRevenue : monthlyRevenue * (monthIndex / params.cacPaybackMonths);

    return {
      revenue: adjustedRevenue,
      customers: projectedCustomers
    };
  }

  static calculateRetentionImpact(
    params: RetentionParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; churnReduction: number } {
    const churnImprovement = params.currentChurnRatePercent - params.targetChurnRatePercent;
    const monthlyChurnReduction = churnImprovement / 12;

    const customersRetained = params.averageCustomerCount * (monthlyChurnReduction / 100) * monthIndex;
    const revenuePerCustomer = params.currentMRR / params.averageCustomerCount;
    const additionalRevenue = customersRetained * revenuePerCustomer;

    return {
      revenue: additionalRevenue,
      churnReduction: churnImprovement
    };
  }

  static calculateFunnelImpact(
    params: FunnelParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; deals: number } {
    let currentVolume = params.leadsPerMonth;

    for (const stage of params.stages) {
      currentVolume = currentVolume * (stage.conversionRate / 100);
    }

    const dealsWon = currentVolume;
    const dealDelay = Math.max(0, monthIndex - params.salesCycleMonths);
    const recognizedDeals = dealDelay > 0 ? dealsWon : (dealsWon * monthIndex) / params.salesCycleMonths;
    const monthlyRevenue = recognizedDeals * params.averageDealSize;

    return {
      revenue: monthlyRevenue,
      deals: recognizedDeals
    };
  }

  static calculateSeasonalityImpact(
    params: SeasonalityParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; multiplier: number } {
    const multiplier = params.monthlyMultipliers[month] || 1.0;
    const baselineMultiplier = 1.0;
    const impact = params.baselineRevenue * (multiplier - baselineMultiplier);

    return {
      revenue: impact,
      multiplier: multiplier
    };
  }

  static calculateContractTermsImpact(
    params: ContractTermsParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; renewals: number; expansion: number } {
    const monthlyARR = params.newARR / 12;
    const renewalMonth = monthIndex % params.averageContractLengthMonths === 0 && monthIndex > 0;

    let renewalRevenue = 0;
    let expansionRevenue = 0;

    if (renewalMonth) {
      renewalRevenue = monthlyARR * (params.renewalRatePercent / 100);
      expansionRevenue = renewalRevenue * (params.expansionRevenuePercent / 100);
    }

    const baseContractRevenue = monthlyARR;
    const totalRevenue = baseContractRevenue + renewalRevenue + expansionRevenue;

    return {
      revenue: totalRevenue - baseContractRevenue,
      renewals: renewalRevenue,
      expansion: expansionRevenue
    };
  }

  static calculateRepProductivityImpact(
    params: RepProductivityParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; effectiveReps: number } {
    const rampedReps = Math.max(0, monthIndex - params.rampTimeMonths) * params.newHires;
    const effectiveReps = params.numberOfReps + Math.min(rampedReps, params.newHires);

    const quotaAttainment = params.attainmentPercent / 100;
    const monthlyRevenue = effectiveReps * params.quotaPerRepMonthly * quotaAttainment;
    const baselineRevenue = params.numberOfReps * params.quotaPerRepMonthly * quotaAttainment;

    return {
      revenue: monthlyRevenue - baselineRevenue,
      effectiveReps: effectiveReps
    };
  }

  static calculateDiscountingImpact(
    params: DiscountingParameters,
    baseRevenue: number,
    month: string,
    monthIndex: number
  ): { revenue: number; volumeIncrease: number; marginImpact: number } {
    const affectedRevenue = baseRevenue * (params.affectedRevenuePercent / 100);
    const volumeIncrease = affectedRevenue * (params.volumeLiftPercent / 100);
    const discountImpact = (affectedRevenue + volumeIncrease) * (params.discountPercent / 100);
    const netRevenueImpact = volumeIncrease - discountImpact;
    const marginImpact = netRevenueImpact * (params.marginImpactPercent / 100);

    return {
      revenue: netRevenueImpact,
      volumeIncrease: volumeIncrease,
      marginImpact: marginImpact
    };
  }

  static calculateDriverImpact(
    driver: SalesDriver,
    baseRevenue: number,
    month: string,
    year: number,
    monthIndex: number
  ): number {
    if (!driver.isActive || !this.isMonthInRange(month, driver.startMonth, driver.endMonth)) {
      return 0;
    }

    switch (driver.driverType) {
      case 'volume_price':
        return this.calculateVolumePriceImpact(
          driver.parameters as VolumePriceParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      case 'cac':
        return this.calculateCACImpact(
          driver.parameters as CACParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      case 'retention':
        return this.calculateRetentionImpact(
          driver.parameters as RetentionParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      case 'funnel':
        return this.calculateFunnelImpact(
          driver.parameters as FunnelParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      case 'seasonality':
        return this.calculateSeasonalityImpact(
          driver.parameters as SeasonalityParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      case 'contract_terms':
        return this.calculateContractTermsImpact(
          driver.parameters as ContractTermsParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      case 'rep_productivity':
        return this.calculateRepProductivityImpact(
          driver.parameters as RepProductivityParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      case 'discounting':
        return this.calculateDiscountingImpact(
          driver.parameters as DiscountingParameters,
          baseRevenue,
          month,
          monthIndex
        ).revenue;

      default:
        return 0;
    }
  }

  static calculateScenarioImpacts(scenario: SalesScenario): CalculatedScenarioImpact[] {
    const results: CalculatedScenarioImpact[] = [];
    const drivers = scenario.drivers || [];
    const baseRevenue = scenario.baseRevenue || 0;

    MONTHS.forEach((month, monthIndex) => {
      const year = scenario.startYear;
      let totalImpact = 0;
      const driverBreakdown: CalculatedScenarioImpact['driverBreakdown'] = [];

      drivers.forEach(driver => {
        const impact = this.calculateDriverImpact(
          driver,
          baseRevenue,
          month,
          year,
          monthIndex
        );

        totalImpact += impact;

        if (impact !== 0) {
          driverBreakdown.push({
            driverId: driver.id,
            driverName: driver.driverName,
            driverType: driver.driverType,
            impact: impact
          });
        }
      });

      results.push({
        month,
        year,
        baseRevenue: 0,
        totalImpact,
        driverBreakdown,
        finalRevenue: totalImpact
      });
    });

    return results;
  }

  static async saveScenario(scenario: Omit<SalesScenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<SalesScenario | null> {
    try {
      const { data, error } = await supabase
        .from('sales_scenarios')
        .insert({
          name: scenario.name,
          description: scenario.description,
          scenario_type: scenario.scenarioType,
          base_revenue: scenario.baseRevenue,
          start_month: scenario.startMonth,
          end_month: scenario.endMonth,
          start_year: scenario.startYear,
          end_year: scenario.endYear,
          created_by: scenario.createdBy,
          is_active: scenario.isActive
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        scenarioType: data.scenario_type,
        baseRevenue: data.base_revenue,
        startMonth: data.start_month,
        endMonth: data.end_month,
        startYear: data.start_year,
        endYear: data.end_year,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        isActive: data.is_active
      };
    } catch (error) {
      console.error('Error saving scenario:', error);
      return null;
    }
  }

  static async saveDriver(driver: Omit<SalesDriver, 'id' | 'createdAt'>): Promise<SalesDriver | null> {
    try {
      const { data, error } = await supabase
        .from('sales_drivers')
        .insert({
          scenario_id: driver.scenarioId,
          driver_type: driver.driverType,
          driver_name: driver.driverName,
          is_active: driver.isActive,
          start_month: driver.startMonth,
          end_month: driver.endMonth,
          parameters: driver.parameters,
          sort_order: driver.sortOrder
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        scenarioId: data.scenario_id,
        driverType: data.driver_type,
        driverName: data.driver_name,
        isActive: data.is_active,
        startMonth: data.start_month,
        endMonth: data.end_month,
        parameters: data.parameters,
        sortOrder: data.sort_order,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Error saving driver:', error);
      return null;
    }
  }

  static async getScenario(scenarioId: string): Promise<SalesScenario | null> {
    try {
      const { data: scenarioData, error: scenarioError } = await supabase
        .from('sales_scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (scenarioError) throw scenarioError;

      const { data: driversData, error: driversError } = await supabase
        .from('sales_drivers')
        .select('*')
        .eq('scenario_id', scenarioId)
        .order('sort_order');

      if (driversError) throw driversError;

      const drivers: SalesDriver[] = driversData.map(d => ({
        id: d.id,
        scenarioId: d.scenario_id,
        driverType: d.driver_type,
        driverName: d.driver_name,
        isActive: d.is_active,
        startMonth: d.start_month,
        endMonth: d.end_month,
        parameters: d.parameters,
        sortOrder: d.sort_order,
        createdAt: new Date(d.created_at)
      }));

      return {
        id: scenarioData.id,
        name: scenarioData.name,
        description: scenarioData.description,
        scenarioType: scenarioData.scenario_type,
        baseRevenue: scenarioData.base_revenue,
        startMonth: scenarioData.start_month,
        endMonth: scenarioData.end_month,
        startYear: scenarioData.start_year,
        endYear: scenarioData.end_year,
        createdBy: scenarioData.created_by,
        createdAt: new Date(scenarioData.created_at),
        updatedAt: new Date(scenarioData.updated_at),
        isActive: scenarioData.is_active,
        drivers
      };
    } catch (error) {
      console.error('Error getting scenario:', error);
      return null;
    }
  }

  static async getAllScenarios(): Promise<SalesScenario[]> {
    try {
      const { data, error } = await supabase
        .from('sales_scenarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        scenarioType: s.scenario_type,
        baseRevenue: s.base_revenue,
        startMonth: s.start_month,
        endMonth: s.end_month,
        startYear: s.start_year,
        endYear: s.end_year,
        createdBy: s.created_by,
        createdAt: new Date(s.created_at),
        updatedAt: new Date(s.updated_at),
        isActive: s.is_active
      }));
    } catch (error) {
      console.error('Error getting scenarios:', error);
      return [];
    }
  }

  static async updateDriver(driverId: string, updates: Partial<SalesDriver>): Promise<boolean> {
    try {
      const updateData: any = {};

      if (updates.driverName !== undefined) updateData.driver_name = updates.driverName;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.startMonth !== undefined) updateData.start_month = updates.startMonth;
      if (updates.endMonth !== undefined) updateData.end_month = updates.endMonth;
      if (updates.parameters !== undefined) updateData.parameters = updates.parameters;
      if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;

      const { error } = await supabase
        .from('sales_drivers')
        .update(updateData)
        .eq('id', driverId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating driver:', error);
      return false;
    }
  }

  static async deleteDriver(driverId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sales_drivers')
        .delete()
        .eq('id', driverId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting driver:', error);
      return false;
    }
  }
}

export default SalesDriverService;
