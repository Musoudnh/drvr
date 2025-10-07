export interface EmployeeData {
  employeeType: 'salary' | 'hourly';
  annualSalary?: number;
  hourlyRate?: number;
  weeklyHours?: number;
  state?: string;
  filingStatus?: 'single' | 'married' | 'head_of_household';
  allowances?: number;
  additionalWithholding?: number;
}

export interface PayPeriodConfig {
  type: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
  perYear: number;
  weeksPerPeriod: number;
}

export interface TaxCalculation {
  federalTax: number;
  stateTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  totalTaxes: number;
}

export interface PayrollResult {
  grossPay: number;
  taxes: TaxCalculation;
  otherDeductions: number;
  netPay: number;
}

const PAY_PERIOD_CONFIGS: Record<string, PayPeriodConfig> = {
  weekly: { type: 'weekly', perYear: 52, weeksPerPeriod: 1 },
  biweekly: { type: 'biweekly', perYear: 26, weeksPerPeriod: 2 },
  semimonthly: { type: 'semimonthly', perYear: 24, weeksPerPeriod: 2.17 },
  monthly: { type: 'monthly', perYear: 12, weeksPerPeriod: 4.33 }
};

const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const SOCIAL_SECURITY_WAGE_BASE = 168600;

const FEDERAL_TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 }
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 }
  ],
  head_of_household: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 }
  ]
};

const STATE_TAX_RATES: Record<string, number> = {
  CA: 0.093,
  NY: 0.0685,
  TX: 0,
  FL: 0,
  WA: 0,
  IL: 0.0495,
  PA: 0.0307,
  OH: 0.0399,
  GA: 0.0575,
  NC: 0.0499,
  MI: 0.0425,
  NJ: 0.0897,
  VA: 0.0575,
  MA: 0.05,
  AZ: 0.025
};

export function validateEmployeeData(data: EmployeeData): string[] {
  const errors: string[] = [];

  if (data.employeeType === 'salary') {
    if (!data.annualSalary || data.annualSalary <= 0) {
      errors.push('Annual salary must be greater than 0');
    }
    if (data.annualSalary && data.annualSalary > 10000000) {
      errors.push('Annual salary seems unreasonably high');
    }
  } else if (data.employeeType === 'hourly') {
    if (!data.hourlyRate || data.hourlyRate <= 0) {
      errors.push('Hourly rate must be greater than 0');
    }
    if (data.hourlyRate && data.hourlyRate > 500) {
      errors.push('Hourly rate seems unreasonably high');
    }
    if (!data.weeklyHours || data.weeklyHours <= 0) {
      errors.push('Weekly hours must be greater than 0');
    }
    if (data.weeklyHours && data.weeklyHours > 168) {
      errors.push('Weekly hours cannot exceed 168 hours');
    }
  }

  return errors;
}

export function calculateGrossPay(
  employee: EmployeeData,
  payPeriod: PayPeriodConfig
): number {
  if (employee.employeeType === 'salary' && employee.annualSalary) {
    return Number((employee.annualSalary / payPeriod.perYear).toFixed(2));
  } else if (
    employee.employeeType === 'hourly' &&
    employee.hourlyRate &&
    employee.weeklyHours
  ) {
    const payPeriodHours = employee.weeklyHours * payPeriod.weeksPerPeriod;
    return Number((employee.hourlyRate * payPeriodHours).toFixed(2));
  }
  return 0;
}

function calculateFederalTax(
  annualIncome: number,
  filingStatus: string = 'single',
  allowances: number = 0
): number {
  const standardDeduction =
    filingStatus === 'married' ? 29200 : filingStatus === 'head_of_household' ? 21900 : 14600;

  const allowanceAmount = allowances * 4700;
  const taxableIncome = Math.max(0, annualIncome - standardDeduction - allowanceAmount);

  const brackets = FEDERAL_TAX_BRACKETS_2024[filingStatus as keyof typeof FEDERAL_TAX_BRACKETS_2024] || FEDERAL_TAX_BRACKETS_2024.single;

  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableInBracket * bracket.rate;
      previousMax = bracket.max;

      if (taxableIncome <= bracket.max) break;
    }
  }

  return Number(tax.toFixed(2));
}

function calculateStateTax(annualIncome: number, state: string = 'CA'): number {
  const stateRate = STATE_TAX_RATES[state] || 0;
  return Number((annualIncome * stateRate).toFixed(2));
}

function calculateFICATaxes(grossPay: number, yearToDateGross: number = 0): {
  socialSecurity: number;
  medicare: number;
} {
  const newYTD = yearToDateGross + grossPay;

  let socialSecurity = 0;
  if (yearToDateGross < SOCIAL_SECURITY_WAGE_BASE) {
    const taxableAmount = Math.min(grossPay, SOCIAL_SECURITY_WAGE_BASE - yearToDateGross);
    socialSecurity = taxableAmount * SOCIAL_SECURITY_RATE;
  }

  const medicare = grossPay * MEDICARE_RATE;

  return {
    socialSecurity: Number(socialSecurity.toFixed(2)),
    medicare: Number(medicare.toFixed(2))
  };
}

export function calculatePayroll(
  employee: EmployeeData,
  payPeriodType: string = 'biweekly',
  calculateTaxes: boolean = true,
  yearToDateGross: number = 0
): PayrollResult {
  const payPeriod = PAY_PERIOD_CONFIGS[payPeriodType];
  const grossPay = calculateGrossPay(employee, payPeriod);

  if (!calculateTaxes) {
    return {
      grossPay,
      taxes: {
        federalTax: 0,
        stateTax: 0,
        socialSecurityTax: 0,
        medicareTax: 0,
        totalTaxes: 0
      },
      otherDeductions: 0,
      netPay: grossPay
    };
  }

  const annualGross = grossPay * payPeriod.perYear;

  const annualFederalTax = calculateFederalTax(
    annualGross,
    employee.filingStatus,
    employee.allowances
  );
  const federalTax = Number((annualFederalTax / payPeriod.perYear).toFixed(2));

  const annualStateTax = calculateStateTax(annualGross, employee.state);
  const stateTax = Number((annualStateTax / payPeriod.perYear).toFixed(2));

  const ficaTaxes = calculateFICATaxes(grossPay, yearToDateGross);

  const additionalWithholding = employee.additionalWithholding || 0;

  const totalTaxes =
    federalTax +
    stateTax +
    ficaTaxes.socialSecurity +
    ficaTaxes.medicare +
    additionalWithholding;

  const netPay = Number((grossPay - totalTaxes).toFixed(2));

  return {
    grossPay,
    taxes: {
      federalTax,
      stateTax,
      socialSecurityTax: ficaTaxes.socialSecurity,
      medicareTax: ficaTaxes.medicare,
      totalTaxes: Number(totalTaxes.toFixed(2))
    },
    otherDeductions: additionalWithholding,
    netPay: Math.max(0, netPay)
  };
}

export function getPayPeriodConfig(type: string): PayPeriodConfig {
  return PAY_PERIOD_CONFIGS[type] || PAY_PERIOD_CONFIGS.biweekly;
}

export function getAvailableStates(): Array<{ code: string; name: string }> {
  return [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ];
}
