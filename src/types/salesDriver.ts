export type DriverType =
  | 'volume_price'
  | 'cac'
  | 'retention'
  | 'funnel'
  | 'seasonality'
  | 'contract_terms'
  | 'rep_productivity'
  | 'discounting';

export interface BaseSalesDriver {
  id: string;
  scenarioId: string;
  driverType: DriverType;
  driverName: string;
  isActive: boolean;
  startMonth: string;
  endMonth: string;
  sortOrder: number;
  createdAt: Date;
}

export interface VolumePriceParameters {
  volumeGrowthPercent: number;
  priceGrowthPercent: number;
  baseUnits: number;
  basePrice: number;
}

export interface CACParameters {
  marketingSpendMonthly: number;
  customersAcquired: number;
  averageRevenuePerCustomer: number;
  cacPaybackMonths: number;
}

export interface RetentionParameters {
  currentChurnRatePercent: number;
  targetChurnRatePercent: number;
  currentMRR: number;
  averageCustomerCount: number;
}

export interface FunnelParameters {
  stages: {
    name: string;
    conversionRate: number;
  }[];
  leadsPerMonth: number;
  averageDealSize: number;
  salesCycleMonths: number;
}

export interface SeasonalityParameters {
  monthlyMultipliers: {
    [month: string]: number;
  };
  baselineRevenue: number;
}

export interface ContractTermsParameters {
  averageContractLengthMonths: number;
  renewalRatePercent: number;
  expansionRevenuePercent: number;
  newARR: number;
}

export interface RepProductivityParameters {
  numberOfReps: number;
  quotaPerRepMonthly: number;
  attainmentPercent: number;
  rampTimeMonths: number;
  newHires: number;
}

export interface DiscountingParameters {
  discountPercent: number;
  volumeLiftPercent: number;
  affectedRevenuePercent: number;
  marginImpactPercent: number;
}

export type DriverParameters =
  | VolumePriceParameters
  | CACParameters
  | RetentionParameters
  | FunnelParameters
  | SeasonalityParameters
  | ContractTermsParameters
  | RepProductivityParameters
  | DiscountingParameters;

export interface SalesDriver extends BaseSalesDriver {
  parameters: DriverParameters;
}

export interface SalesDriverResult {
  id: string;
  driverId: string;
  month: string;
  year: number;
  revenueImpact: number;
  volumeImpact: number;
  priceImpact: number;
  customerImpact: number;
  calculatedAt: Date;
}

export interface SalesScenario {
  id: string;
  name: string;
  description?: string;
  scenarioType: 'revenue' | 'sales' | 'custom';
  baseRevenue: number;
  startMonth: string;
  endMonth: string;
  startYear: number;
  endYear: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  drivers?: SalesDriver[];
}

export interface CalculatedScenarioImpact {
  month: string;
  year: number;
  baseRevenue: number;
  totalImpact: number;
  driverBreakdown: {
    driverId: string;
    driverName: string;
    driverType: DriverType;
    impact: number;
  }[];
  finalRevenue: number;
}

export interface DriverTemplate {
  name: string;
  description: string;
  driverType: DriverType;
  defaultParameters: Partial<DriverParameters>;
  icon: string;
  category: 'acquisition' | 'retention' | 'expansion' | 'efficiency';
}

export const DRIVER_TEMPLATES: DriverTemplate[] = [
  {
    name: 'Volume vs Price Split',
    description: 'Separate growth from unit volume vs. average selling price (ASP)',
    driverType: 'volume_price',
    defaultParameters: {
      volumeGrowthPercent: 5,
      priceGrowthPercent: 3,
      baseUnits: 1000,
      basePrice: 100
    } as VolumePriceParameters,
    icon: 'TrendingUp',
    category: 'expansion'
  },
  {
    name: 'Customer Acquisition (CAC)',
    description: 'Tie sales to CAC and marketing spend for customer growth',
    driverType: 'cac',
    defaultParameters: {
      marketingSpendMonthly: 50000,
      customersAcquired: 100,
      averageRevenuePerCustomer: 1000,
      cacPaybackMonths: 12
    } as CACParameters,
    icon: 'Users',
    category: 'acquisition'
  },
  {
    name: 'Retention & Churn',
    description: 'Forecast revenue changes from retention rates or customer churn',
    driverType: 'retention',
    defaultParameters: {
      currentChurnRatePercent: 5,
      targetChurnRatePercent: 3,
      currentMRR: 100000,
      averageCustomerCount: 500
    } as RetentionParameters,
    icon: 'RefreshCw',
    category: 'retention'
  },
  {
    name: 'Conversion Funnel',
    description: 'Add levers for leads → opportunities → closed deals',
    driverType: 'funnel',
    defaultParameters: {
      stages: [
        { name: 'Leads', conversionRate: 100 },
        { name: 'MQLs', conversionRate: 40 },
        { name: 'SQLs', conversionRate: 50 },
        { name: 'Opportunities', conversionRate: 60 },
        { name: 'Closed-Won', conversionRate: 25 }
      ],
      leadsPerMonth: 1000,
      averageDealSize: 5000,
      salesCycleMonths: 3
    } as FunnelParameters,
    icon: 'Filter',
    category: 'efficiency'
  },
  {
    name: 'Seasonality',
    description: 'Adjust for seasonal patterns, quarters, or holiday periods',
    driverType: 'seasonality',
    defaultParameters: {
      monthlyMultipliers: {
        'Jan': 0.9, 'Feb': 0.95, 'Mar': 1.0, 'Apr': 1.05,
        'May': 1.1, 'Jun': 1.15, 'Jul': 1.1, 'Aug': 1.05,
        'Sep': 1.0, 'Oct': 0.95, 'Nov': 1.2, 'Dec': 1.3
      },
      baselineRevenue: 100000
    } as SeasonalityParameters,
    icon: 'Calendar',
    category: 'efficiency'
  },
  {
    name: 'Contract Terms & Renewals',
    description: 'Model contract length and renewal rates for recurring revenue',
    driverType: 'contract_terms',
    defaultParameters: {
      averageContractLengthMonths: 12,
      renewalRatePercent: 85,
      expansionRevenuePercent: 15,
      newARR: 500000
    } as ContractTermsParameters,
    icon: 'FileText',
    category: 'retention'
  },
  {
    name: 'Sales Rep Productivity',
    description: 'Tie sales to headcount with per-rep quotas',
    driverType: 'rep_productivity',
    defaultParameters: {
      numberOfReps: 10,
      quotaPerRepMonthly: 50000,
      attainmentPercent: 85,
      rampTimeMonths: 3,
      newHires: 2
    } as RepProductivityParameters,
    icon: 'Users',
    category: 'efficiency'
  },
  {
    name: 'Discounting & Promotions',
    description: 'Model how discounts affect sales volume vs. margins',
    driverType: 'discounting',
    defaultParameters: {
      discountPercent: 10,
      volumeLiftPercent: 20,
      affectedRevenuePercent: 30,
      marginImpactPercent: 8
    } as DiscountingParameters,
    icon: 'Percent',
    category: 'acquisition'
  }
];
