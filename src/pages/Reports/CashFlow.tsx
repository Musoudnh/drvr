import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../../components/UI/Card';

interface WaterfallItem {
  label: string;
  value: number;
  type: 'starting' | 'increase' | 'decrease' | 'ending' | 'subtotal';
}

interface CashFlowData {
  revenue: number;
  cogs: number;
  expenses: number;
  otherIncome: number;
  cashTaxPaid: number;
  changeInAccountsPayable: number;
  changeInOtherCurrentLiabilities: number;
  changeInAccountsReceivable: number;
  changeInInventory: number;
  changeInWorkInProgress: number;
  changeInOtherCurrentAssets: number;
  changeInFixedAssets: number;
  changeInIntangibleAssets: number;
  changeInInvestments: number;
  netInterest: number;
  changeInOtherNonCurrentLiabilities: number;
  dividends: number;
  changeInRetainedEarnings: number;
  adjustments: number;
}

const CashFlow: React.FC = () => {
  const [dateViewMode, setDateViewMode] = useState<'months' | 'quarters' | 'years'>('months');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState<string>('Jan');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1');

  const monthlyData: Record<number, Record<string, CashFlowData>> = {
    2023: {
      'Jan': { revenue: 115000, cogs: -58000, expenses: -35000, otherIncome: 0, cashTaxPaid: -800, changeInAccountsPayable: 1200, changeInOtherCurrentLiabilities: 4500, changeInAccountsReceivable: -15000, changeInInventory: 2200, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2500, changeInIntangibleAssets: 0, changeInInvestments: 300, netInterest: -2000, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Feb': { revenue: 118000, cogs: -59000, expenses: -36000, otherIncome: 0, cashTaxPaid: -850, changeInAccountsPayable: 1300, changeInOtherCurrentLiabilities: 4800, changeInAccountsReceivable: -16000, changeInInventory: 2300, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2600, changeInIntangibleAssets: 0, changeInInvestments: 320, netInterest: -2100, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Mar': { revenue: 121000, cogs: -60000, expenses: -37000, otherIncome: 0, cashTaxPaid: -900, changeInAccountsPayable: 1400, changeInOtherCurrentLiabilities: 5100, changeInAccountsReceivable: -17000, changeInInventory: 2400, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2700, changeInIntangibleAssets: 0, changeInInvestments: 340, netInterest: -2200, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Apr': { revenue: 119000, cogs: -59500, expenses: -36500, otherIncome: 0, cashTaxPaid: -870, changeInAccountsPayable: 1350, changeInOtherCurrentLiabilities: 4900, changeInAccountsReceivable: -16500, changeInInventory: 2350, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2650, changeInIntangibleAssets: 0, changeInInvestments: 330, netInterest: -2150, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'May': { revenue: 122000, cogs: -61000, expenses: -37500, otherIncome: 0, cashTaxPaid: -920, changeInAccountsPayable: 1420, changeInOtherCurrentLiabilities: 5200, changeInAccountsReceivable: -17500, changeInInventory: 2450, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2750, changeInIntangibleAssets: 0, changeInInvestments: 350, netInterest: -2250, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jun': { revenue: 125000, cogs: -62500, expenses: -38000, otherIncome: 0, cashTaxPaid: -950, changeInAccountsPayable: 1450, changeInOtherCurrentLiabilities: 5300, changeInAccountsReceivable: -18000, changeInInventory: 2500, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2800, changeInIntangibleAssets: 0, changeInInvestments: 360, netInterest: -2300, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jul': { revenue: 123000, cogs: -61500, expenses: -37800, otherIncome: 0, cashTaxPaid: -930, changeInAccountsPayable: 1430, changeInOtherCurrentLiabilities: 5250, changeInAccountsReceivable: -17800, changeInInventory: 2470, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2780, changeInIntangibleAssets: 0, changeInInvestments: 355, netInterest: -2280, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Aug': { revenue: 126000, cogs: -63000, expenses: -38500, otherIncome: 0, cashTaxPaid: -970, changeInAccountsPayable: 1470, changeInOtherCurrentLiabilities: 5400, changeInAccountsReceivable: -18500, changeInInventory: 2550, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2850, changeInIntangibleAssets: 0, changeInInvestments: 370, netInterest: -2350, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Sep': { revenue: 128000, cogs: -64000, expenses: -39000, otherIncome: 0, cashTaxPaid: -990, changeInAccountsPayable: 1490, changeInOtherCurrentLiabilities: 5500, changeInAccountsReceivable: -19000, changeInInventory: 2600, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2900, changeInIntangibleAssets: 0, changeInInvestments: 380, netInterest: -2400, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Oct': { revenue: 127000, cogs: -63500, expenses: -38700, otherIncome: 0, cashTaxPaid: -980, changeInAccountsPayable: 1480, changeInOtherCurrentLiabilities: 5450, changeInAccountsReceivable: -18700, changeInInventory: 2580, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2880, changeInIntangibleAssets: 0, changeInInvestments: 375, netInterest: -2380, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Nov': { revenue: 130000, cogs: -65000, expenses: -39500, otherIncome: 0, cashTaxPaid: -1010, changeInAccountsPayable: 1510, changeInOtherCurrentLiabilities: 5600, changeInAccountsReceivable: -19500, changeInInventory: 2650, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2950, changeInIntangibleAssets: 0, changeInInvestments: 390, netInterest: -2450, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Dec': { revenue: 132000, cogs: -66000, expenses: -40000, otherIncome: 0, cashTaxPaid: -1030, changeInAccountsPayable: 1530, changeInOtherCurrentLiabilities: 5700, changeInAccountsReceivable: -20000, changeInInventory: 2700, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3000, changeInIntangibleAssets: 0, changeInInvestments: 400, netInterest: -2500, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 }
    },
    2024: {
      'Jan': { revenue: 120000, cogs: -62000, expenses: -38000, otherIncome: 0, cashTaxPaid: -900, changeInAccountsPayable: 1400, changeInOtherCurrentLiabilities: 5200, changeInAccountsReceivable: -17000, changeInInventory: 2500, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2800, changeInIntangibleAssets: 0, changeInInvestments: 350, netInterest: -2200, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Feb': { revenue: 123000, cogs: -63000, expenses: -39000, otherIncome: 0, cashTaxPaid: -930, changeInAccountsPayable: 1430, changeInOtherCurrentLiabilities: 5350, changeInAccountsReceivable: -17500, changeInInventory: 2550, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2850, changeInIntangibleAssets: 0, changeInInvestments: 360, netInterest: -2250, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Mar': { revenue: 126000, cogs: -64000, expenses: -40000, otherIncome: 0, cashTaxPaid: -960, changeInAccountsPayable: 1460, changeInOtherCurrentLiabilities: 5500, changeInAccountsReceivable: -18000, changeInInventory: 2600, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2900, changeInIntangibleAssets: 0, changeInInvestments: 370, netInterest: -2300, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Apr': { revenue: 124000, cogs: -63500, expenses: -39500, otherIncome: 0, cashTaxPaid: -940, changeInAccountsPayable: 1440, changeInOtherCurrentLiabilities: 5400, changeInAccountsReceivable: -17800, changeInInventory: 2570, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2870, changeInIntangibleAssets: 0, changeInInvestments: 365, netInterest: -2270, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'May': { revenue: 127000, cogs: -65000, expenses: -40500, otherIncome: 0, cashTaxPaid: -980, changeInAccountsPayable: 1480, changeInOtherCurrentLiabilities: 5600, changeInAccountsReceivable: -18500, changeInInventory: 2650, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2950, changeInIntangibleAssets: 0, changeInInvestments: 380, netInterest: -2350, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jun': { revenue: 130000, cogs: -66000, expenses: -41000, otherIncome: 0, cashTaxPaid: -1000, changeInAccountsPayable: 1500, changeInOtherCurrentLiabilities: 5700, changeInAccountsReceivable: -19000, changeInInventory: 2700, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3000, changeInIntangibleAssets: 0, changeInInvestments: 390, netInterest: -2400, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jul': { revenue: 128000, cogs: -65500, expenses: -40700, otherIncome: 0, cashTaxPaid: -990, changeInAccountsPayable: 1490, changeInOtherCurrentLiabilities: 5650, changeInAccountsReceivable: -18700, changeInInventory: 2680, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2980, changeInIntangibleAssets: 0, changeInInvestments: 385, netInterest: -2380, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Aug': { revenue: 131000, cogs: -67000, expenses: -41500, otherIncome: 0, cashTaxPaid: -1020, changeInAccountsPayable: 1520, changeInOtherCurrentLiabilities: 5800, changeInAccountsReceivable: -19500, changeInInventory: 2750, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3050, changeInIntangibleAssets: 0, changeInInvestments: 400, netInterest: -2450, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Sep': { revenue: 133000, cogs: -68000, expenses: -42000, otherIncome: 0, cashTaxPaid: -1040, changeInAccountsPayable: 1540, changeInOtherCurrentLiabilities: 5900, changeInAccountsReceivable: -20000, changeInInventory: 2800, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3100, changeInIntangibleAssets: 0, changeInInvestments: 410, netInterest: -2500, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Oct': { revenue: 132000, cogs: -67500, expenses: -41700, otherIncome: 0, cashTaxPaid: -1030, changeInAccountsPayable: 1530, changeInOtherCurrentLiabilities: 5850, changeInAccountsReceivable: -19700, changeInInventory: 2780, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3080, changeInIntangibleAssets: 0, changeInInvestments: 405, netInterest: -2480, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Nov': { revenue: 135000, cogs: -69000, expenses: -42500, otherIncome: 0, cashTaxPaid: -1060, changeInAccountsPayable: 1560, changeInOtherCurrentLiabilities: 6000, changeInAccountsReceivable: -20500, changeInInventory: 2850, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3150, changeInIntangibleAssets: 0, changeInInvestments: 420, netInterest: -2550, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Dec': { revenue: 137000, cogs: -70000, expenses: -43000, otherIncome: 0, cashTaxPaid: -1080, changeInAccountsPayable: 1580, changeInOtherCurrentLiabilities: 6100, changeInAccountsReceivable: -21000, changeInInventory: 2900, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3200, changeInIntangibleAssets: 0, changeInInvestments: 430, netInterest: -2600, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 }
    },
    2025: {
      'Jan': { revenue: 125000, cogs: -65000, expenses: -40000, otherIncome: 0, cashTaxPaid: -950, changeInAccountsPayable: 1450, changeInOtherCurrentLiabilities: 5500, changeInAccountsReceivable: -18000, changeInInventory: 2600, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2900, changeInIntangibleAssets: 0, changeInInvestments: 360, netInterest: -2300, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Feb': { revenue: 128000, cogs: -66000, expenses: -41000, otherIncome: 0, cashTaxPaid: -980, changeInAccountsPayable: 1480, changeInOtherCurrentLiabilities: 5650, changeInAccountsReceivable: -18500, changeInInventory: 2650, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2950, changeInIntangibleAssets: 0, changeInInvestments: 370, netInterest: -2350, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Mar': { revenue: 131000, cogs: -67000, expenses: -42000, otherIncome: 0, cashTaxPaid: -1010, changeInAccountsPayable: 1510, changeInOtherCurrentLiabilities: 5800, changeInAccountsReceivable: -19000, changeInInventory: 2700, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3000, changeInIntangibleAssets: 0, changeInInvestments: 380, netInterest: -2400, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Apr': { revenue: 129000, cogs: -66500, expenses: -41500, otherIncome: 0, cashTaxPaid: -990, changeInAccountsPayable: 1490, changeInOtherCurrentLiabilities: 5700, changeInAccountsReceivable: -18700, changeInInventory: 2670, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -2970, changeInIntangibleAssets: 0, changeInInvestments: 375, netInterest: -2370, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'May': { revenue: 132000, cogs: -68000, expenses: -42500, otherIncome: 0, cashTaxPaid: -1030, changeInAccountsPayable: 1530, changeInOtherCurrentLiabilities: 5900, changeInAccountsReceivable: -19500, changeInInventory: 2750, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3050, changeInIntangibleAssets: 0, changeInInvestments: 390, netInterest: -2450, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jun': { revenue: 135000, cogs: -69000, expenses: -43000, otherIncome: 0, cashTaxPaid: -1050, changeInAccountsPayable: 1550, changeInOtherCurrentLiabilities: 6000, changeInAccountsReceivable: -20000, changeInInventory: 2800, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3100, changeInIntangibleAssets: 0, changeInInvestments: 400, netInterest: -2500, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jul': { revenue: 133000, cogs: -68500, expenses: -42700, otherIncome: 0, cashTaxPaid: -1040, changeInAccountsPayable: 1540, changeInOtherCurrentLiabilities: 5950, changeInAccountsReceivable: -19700, changeInInventory: 2780, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3080, changeInIntangibleAssets: 0, changeInInvestments: 395, netInterest: -2480, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Aug': { revenue: 136000, cogs: -70000, expenses: -43500, otherIncome: 0, cashTaxPaid: -1070, changeInAccountsPayable: 1570, changeInOtherCurrentLiabilities: 6100, changeInAccountsReceivable: -20500, changeInInventory: 2850, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3150, changeInIntangibleAssets: 0, changeInInvestments: 410, netInterest: -2550, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Sep': { revenue: 138000, cogs: -71000, expenses: -44000, otherIncome: 0, cashTaxPaid: -1090, changeInAccountsPayable: 1590, changeInOtherCurrentLiabilities: 6200, changeInAccountsReceivable: -21000, changeInInventory: 2900, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3200, changeInIntangibleAssets: 0, changeInInvestments: 420, netInterest: -2600, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Oct': { revenue: 137000, cogs: -70500, expenses: -43700, otherIncome: 0, cashTaxPaid: -1080, changeInAccountsPayable: 1580, changeInOtherCurrentLiabilities: 6150, changeInAccountsReceivable: -20700, changeInInventory: 2880, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3180, changeInIntangibleAssets: 0, changeInInvestments: 415, netInterest: -2580, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Nov': { revenue: 140000, cogs: -72000, expenses: -44500, otherIncome: 0, cashTaxPaid: -1110, changeInAccountsPayable: 1610, changeInOtherCurrentLiabilities: 6300, changeInAccountsReceivable: -21500, changeInInventory: 2950, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3250, changeInIntangibleAssets: 0, changeInInvestments: 430, netInterest: -2650, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Dec': { revenue: 142000, cogs: -73000, expenses: -45000, otherIncome: 0, cashTaxPaid: -1130, changeInAccountsPayable: 1630, changeInOtherCurrentLiabilities: 6400, changeInAccountsReceivable: -22000, changeInInventory: 3000, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3300, changeInIntangibleAssets: 0, changeInInvestments: 440, netInterest: -2700, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 }
    },
    2026: {
      'Jan': { revenue: 130000, cogs: -68000, expenses: -42000, otherIncome: 0, cashTaxPaid: -1000, changeInAccountsPayable: 1500, changeInOtherCurrentLiabilities: 5800, changeInAccountsReceivable: -19000, changeInInventory: 2700, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3000, changeInIntangibleAssets: 0, changeInInvestments: 370, netInterest: -2400, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Feb': { revenue: 133000, cogs: -69000, expenses: -43000, otherIncome: 0, cashTaxPaid: -1030, changeInAccountsPayable: 1530, changeInOtherCurrentLiabilities: 5950, changeInAccountsReceivable: -19500, changeInInventory: 2750, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3050, changeInIntangibleAssets: 0, changeInInvestments: 380, netInterest: -2450, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Mar': { revenue: 136000, cogs: -70000, expenses: -44000, otherIncome: 0, cashTaxPaid: -1060, changeInAccountsPayable: 1560, changeInOtherCurrentLiabilities: 6100, changeInAccountsReceivable: -20000, changeInInventory: 2800, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3100, changeInIntangibleAssets: 0, changeInInvestments: 390, netInterest: -2500, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Apr': { revenue: 134000, cogs: -69500, expenses: -43500, otherIncome: 0, cashTaxPaid: -1040, changeInAccountsPayable: 1540, changeInOtherCurrentLiabilities: 6000, changeInAccountsReceivable: -19700, changeInInventory: 2770, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3070, changeInIntangibleAssets: 0, changeInInvestments: 385, netInterest: -2470, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'May': { revenue: 137000, cogs: -71000, expenses: -44500, otherIncome: 0, cashTaxPaid: -1080, changeInAccountsPayable: 1580, changeInOtherCurrentLiabilities: 6200, changeInAccountsReceivable: -20500, changeInInventory: 2850, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3150, changeInIntangibleAssets: 0, changeInInvestments: 400, netInterest: -2550, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jun': { revenue: 140000, cogs: -72000, expenses: -45000, otherIncome: 0, cashTaxPaid: -1100, changeInAccountsPayable: 1600, changeInOtherCurrentLiabilities: 6300, changeInAccountsReceivable: -21000, changeInInventory: 2900, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3200, changeInIntangibleAssets: 0, changeInInvestments: 410, netInterest: -2600, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jul': { revenue: 138000, cogs: -71500, expenses: -44700, otherIncome: 0, cashTaxPaid: -1090, changeInAccountsPayable: 1590, changeInOtherCurrentLiabilities: 6250, changeInAccountsReceivable: -20700, changeInInventory: 2880, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3180, changeInIntangibleAssets: 0, changeInInvestments: 405, netInterest: -2580, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Aug': { revenue: 141000, cogs: -73000, expenses: -45500, otherIncome: 0, cashTaxPaid: -1120, changeInAccountsPayable: 1620, changeInOtherCurrentLiabilities: 6400, changeInAccountsReceivable: -21500, changeInInventory: 2950, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3250, changeInIntangibleAssets: 0, changeInInvestments: 420, netInterest: -2650, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Sep': { revenue: 143000, cogs: -74000, expenses: -46000, otherIncome: 0, cashTaxPaid: -1140, changeInAccountsPayable: 1640, changeInOtherCurrentLiabilities: 6500, changeInAccountsReceivable: -22000, changeInInventory: 3000, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3300, changeInIntangibleAssets: 0, changeInInvestments: 430, netInterest: -2700, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Oct': { revenue: 142000, cogs: -73500, expenses: -45700, otherIncome: 0, cashTaxPaid: -1130, changeInAccountsPayable: 1630, changeInOtherCurrentLiabilities: 6450, changeInAccountsReceivable: -21700, changeInInventory: 2980, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3280, changeInIntangibleAssets: 0, changeInInvestments: 425, netInterest: -2680, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Nov': { revenue: 145000, cogs: -75000, expenses: -46500, otherIncome: 0, cashTaxPaid: -1160, changeInAccountsPayable: 1660, changeInOtherCurrentLiabilities: 6600, changeInAccountsReceivable: -22500, changeInInventory: 3050, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3350, changeInIntangibleAssets: 0, changeInInvestments: 440, netInterest: -2750, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Dec': { revenue: 147000, cogs: -76000, expenses: -47000, otherIncome: 0, cashTaxPaid: -1180, changeInAccountsPayable: 1680, changeInOtherCurrentLiabilities: 6700, changeInAccountsReceivable: -23000, changeInInventory: 3100, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3400, changeInIntangibleAssets: 0, changeInInvestments: 450, netInterest: -2800, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 }
    },
    2027: {
      'Jan': { revenue: 135000, cogs: -71000, expenses: -44000, otherIncome: 0, cashTaxPaid: -1050, changeInAccountsPayable: 1550, changeInOtherCurrentLiabilities: 6100, changeInAccountsReceivable: -20000, changeInInventory: 2800, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3100, changeInIntangibleAssets: 0, changeInInvestments: 380, netInterest: -2500, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Feb': { revenue: 138000, cogs: -72000, expenses: -45000, otherIncome: 0, cashTaxPaid: -1080, changeInAccountsPayable: 1580, changeInOtherCurrentLiabilities: 6250, changeInAccountsReceivable: -20500, changeInInventory: 2850, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3150, changeInIntangibleAssets: 0, changeInInvestments: 390, netInterest: -2550, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Mar': { revenue: 141000, cogs: -73000, expenses: -46000, otherIncome: 0, cashTaxPaid: -1110, changeInAccountsPayable: 1610, changeInOtherCurrentLiabilities: 6400, changeInAccountsReceivable: -21000, changeInInventory: 2900, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3200, changeInIntangibleAssets: 0, changeInInvestments: 400, netInterest: -2600, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Apr': { revenue: 139000, cogs: -72500, expenses: -45500, otherIncome: 0, cashTaxPaid: -1090, changeInAccountsPayable: 1590, changeInOtherCurrentLiabilities: 6300, changeInAccountsReceivable: -20700, changeInInventory: 2870, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3170, changeInIntangibleAssets: 0, changeInInvestments: 395, netInterest: -2570, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'May': { revenue: 142000, cogs: -74000, expenses: -46500, otherIncome: 0, cashTaxPaid: -1130, changeInAccountsPayable: 1630, changeInOtherCurrentLiabilities: 6500, changeInAccountsReceivable: -21500, changeInInventory: 2950, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3250, changeInIntangibleAssets: 0, changeInInvestments: 410, netInterest: -2650, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jun': { revenue: 145000, cogs: -75000, expenses: -47000, otherIncome: 0, cashTaxPaid: -1150, changeInAccountsPayable: 1650, changeInOtherCurrentLiabilities: 6600, changeInAccountsReceivable: -22000, changeInInventory: 3000, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3300, changeInIntangibleAssets: 0, changeInInvestments: 420, netInterest: -2700, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Jul': { revenue: 143000, cogs: -74500, expenses: -46700, otherIncome: 0, cashTaxPaid: -1140, changeInAccountsPayable: 1640, changeInOtherCurrentLiabilities: 6550, changeInAccountsReceivable: -21700, changeInInventory: 2980, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3280, changeInIntangibleAssets: 0, changeInInvestments: 415, netInterest: -2680, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Aug': { revenue: 146000, cogs: -76000, expenses: -47500, otherIncome: 0, cashTaxPaid: -1170, changeInAccountsPayable: 1670, changeInOtherCurrentLiabilities: 6700, changeInAccountsReceivable: -22500, changeInInventory: 3050, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3350, changeInIntangibleAssets: 0, changeInInvestments: 430, netInterest: -2750, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Sep': { revenue: 148000, cogs: -77000, expenses: -48000, otherIncome: 0, cashTaxPaid: -1190, changeInAccountsPayable: 1690, changeInOtherCurrentLiabilities: 6800, changeInAccountsReceivable: -23000, changeInInventory: 3100, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3400, changeInIntangibleAssets: 0, changeInInvestments: 440, netInterest: -2800, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Oct': { revenue: 147000, cogs: -76500, expenses: -47700, otherIncome: 0, cashTaxPaid: -1180, changeInAccountsPayable: 1680, changeInOtherCurrentLiabilities: 6750, changeInAccountsReceivable: -22700, changeInInventory: 3080, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3380, changeInIntangibleAssets: 0, changeInInvestments: 435, netInterest: -2780, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Nov': { revenue: 150000, cogs: -78000, expenses: -48500, otherIncome: 0, cashTaxPaid: -1210, changeInAccountsPayable: 1710, changeInOtherCurrentLiabilities: 6900, changeInAccountsReceivable: -23500, changeInInventory: 3150, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3450, changeInIntangibleAssets: 0, changeInInvestments: 450, netInterest: -2850, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 },
      'Dec': { revenue: 152000, cogs: -79000, expenses: -49000, otherIncome: 0, cashTaxPaid: -1230, changeInAccountsPayable: 1730, changeInOtherCurrentLiabilities: 7000, changeInAccountsReceivable: -24000, changeInInventory: 3200, changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0, changeInFixedAssets: -3500, changeInIntangibleAssets: 0, changeInInvestments: 460, netInterest: -2900, changeInOtherNonCurrentLiabilities: 0, dividends: 0, changeInRetainedEarnings: 0, adjustments: 0 }
    }
  };

  const currentPeriodData = useMemo(() => {
    const yearData = monthlyData[selectedYear];
    if (!yearData) return null;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (dateViewMode === 'months') {
      return yearData[selectedMonth];
    } else if (dateViewMode === 'quarters') {
      const quarterMonths: Record<string, string[]> = {
        'Q1': ['Jan', 'Feb', 'Mar'],
        'Q2': ['Apr', 'May', 'Jun'],
        'Q3': ['Jul', 'Aug', 'Sep'],
        'Q4': ['Oct', 'Nov', 'Dec']
      };

      const aggregated: CashFlowData = {
        revenue: 0, cogs: 0, expenses: 0, otherIncome: 0, cashTaxPaid: 0,
        changeInAccountsPayable: 0, changeInOtherCurrentLiabilities: 0,
        changeInAccountsReceivable: 0, changeInInventory: 0,
        changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0,
        changeInFixedAssets: 0, changeInIntangibleAssets: 0,
        changeInInvestments: 0, netInterest: 0,
        changeInOtherNonCurrentLiabilities: 0, dividends: 0,
        changeInRetainedEarnings: 0, adjustments: 0
      };

      quarterMonths[selectedQuarter].forEach(month => {
        const monthData = yearData[month];
        if (monthData) {
          Object.keys(aggregated).forEach(key => {
            aggregated[key as keyof CashFlowData] += monthData[key as keyof CashFlowData];
          });
        }
      });

      return aggregated;
    } else {
      const aggregated: CashFlowData = {
        revenue: 0, cogs: 0, expenses: 0, otherIncome: 0, cashTaxPaid: 0,
        changeInAccountsPayable: 0, changeInOtherCurrentLiabilities: 0,
        changeInAccountsReceivable: 0, changeInInventory: 0,
        changeInWorkInProgress: 0, changeInOtherCurrentAssets: 0,
        changeInFixedAssets: 0, changeInIntangibleAssets: 0,
        changeInInvestments: 0, netInterest: 0,
        changeInOtherNonCurrentLiabilities: 0, dividends: 0,
        changeInRetainedEarnings: 0, adjustments: 0
      };

      months.forEach(month => {
        const monthData = yearData[month];
        if (monthData) {
          Object.keys(aggregated).forEach(key => {
            aggregated[key as keyof CashFlowData] += monthData[key as keyof CashFlowData];
          });
        }
      });

      return aggregated;
    }
  }, [dateViewMode, selectedYear, selectedMonth, selectedQuarter]);

  const waterfallData: WaterfallItem[] = useMemo(() => {
    if (!currentPeriodData) {
      return [
        { label: 'Revenue', value: 0, type: 'starting' },
        { label: 'Cost of Goods Sold', value: 0, type: 'decrease' },
        { label: 'Expenses', value: 0, type: 'decrease' },
        { label: 'Other Income', value: 0, type: 'increase' },
        { label: 'Cash Tax Paid', value: 0, type: 'decrease' },
        { label: 'Change in Accounts Payable', value: 0, type: 'increase' },
        { label: 'Change in Other Current Liabilities', value: 0, type: 'increase' },
        { label: 'Change in Accounts Receivable', value: 0, type: 'decrease' },
        { label: 'Change in Inventory', value: 0, type: 'increase' },
        { label: 'Change in Work in Progress', value: 0, type: 'decrease' },
        { label: 'Change in Other Current Assets', value: 0, type: 'decrease' },
        { label: 'OPERATING CASH FLOW', value: 0, type: 'subtotal' },
        { label: 'Change in Fixed Assets (ex. Depreciation and Amortization)', value: 0, type: 'decrease' },
        { label: 'Change in Intangible Assets', value: 0, type: 'decrease' },
        { label: 'Change in Investments or Other Non-Current Assets', value: 0, type: 'increase' },
        { label: 'FREE CASH FLOW', value: 0, type: 'subtotal' },
        { label: 'Net Interest (after tax)', value: 0, type: 'decrease' },
        { label: 'Change in Other Non-Current Liabilities', value: 0, type: 'increase' },
        { label: 'Dividends', value: 0, type: 'decrease' },
        { label: 'Change in Retained Earnings and Other Equity', value: 0, type: 'increase' },
        { label: 'Adjustments', value: 0, type: 'decrease' },
        { label: 'NET CASH FLOW', value: 0, type: 'ending' }
      ];
    }

    return [
      { label: 'Revenue', value: currentPeriodData.revenue, type: 'starting' },
      { label: 'Cost of Goods Sold', value: currentPeriodData.cogs, type: 'decrease' },
      { label: 'Expenses', value: currentPeriodData.expenses, type: 'decrease' },
      { label: 'Other Income', value: currentPeriodData.otherIncome, type: 'increase' },
      { label: 'Cash Tax Paid', value: currentPeriodData.cashTaxPaid, type: 'decrease' },
      { label: 'Change in Accounts Payable', value: currentPeriodData.changeInAccountsPayable, type: 'increase' },
      { label: 'Change in Other Current Liabilities', value: currentPeriodData.changeInOtherCurrentLiabilities, type: 'increase' },
      { label: 'Change in Accounts Receivable', value: currentPeriodData.changeInAccountsReceivable, type: 'decrease' },
      { label: 'Change in Inventory', value: currentPeriodData.changeInInventory, type: 'increase' },
      { label: 'Change in Work in Progress', value: currentPeriodData.changeInWorkInProgress, type: 'decrease' },
      { label: 'Change in Other Current Assets', value: currentPeriodData.changeInOtherCurrentAssets, type: 'decrease' },
      { label: 'OPERATING CASH FLOW', value: 0, type: 'subtotal' },
      { label: 'Change in Fixed Assets (ex. Depreciation and Amortization)', value: currentPeriodData.changeInFixedAssets, type: 'decrease' },
      { label: 'Change in Intangible Assets', value: currentPeriodData.changeInIntangibleAssets, type: 'decrease' },
      { label: 'Change in Investments or Other Non-Current Assets', value: currentPeriodData.changeInInvestments, type: 'increase' },
      { label: 'FREE CASH FLOW', value: 0, type: 'subtotal' },
      { label: 'Net Interest (after tax)', value: currentPeriodData.netInterest, type: 'decrease' },
      { label: 'Change in Other Non-Current Liabilities', value: currentPeriodData.changeInOtherNonCurrentLiabilities, type: 'increase' },
      { label: 'Dividends', value: currentPeriodData.dividends, type: 'decrease' },
      { label: 'Change in Retained Earnings and Other Equity', value: currentPeriodData.changeInRetainedEarnings, type: 'increase' },
      { label: 'Adjustments', value: currentPeriodData.adjustments, type: 'decrease' },
      { label: 'NET CASH FLOW', value: 0, type: 'ending' }
    ];
  }, [currentPeriodData]);

  const getWaterfallPosition = (index: number): number => {
    let position = 0;
    for (let i = 0; i < index; i++) {
      if (waterfallData[i].type === 'starting') {
        position = waterfallData[i].value;
      } else if (waterfallData[i].type === 'increase') {
        position += waterfallData[i].value;
      } else if (waterfallData[i].type === 'decrease') {
        position += waterfallData[i].value;
      } else if (waterfallData[i].type === 'subtotal' || waterfallData[i].type === 'ending') {
        // Subtotals and ending don't move the position
      }
    }
    return position;
  };

  const getCalculatedValue = (index: number): number => {
    return getWaterfallPosition(index + 1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const maxRevenueForScale = useMemo(() => {
    let maxRevenue = 0;
    Object.values(monthlyData).forEach(yearData => {
      let yearTotal = 0;
      Object.values(yearData).forEach(monthData => {
        yearTotal += monthData.revenue;
      });
      if (yearTotal > maxRevenue) {
        maxRevenue = yearTotal;
      }
    });
    return maxRevenue;
  }, []);

  const summaryMetrics = useMemo(() => {
    if (!currentPeriodData) {
      return { cashInflow: 0, cashOutflow: 0, netCashFlow: 0 };
    }

    const cashInflow = currentPeriodData.revenue +
                       currentPeriodData.otherIncome +
                       Math.max(0, currentPeriodData.changeInAccountsPayable) +
                       Math.max(0, currentPeriodData.changeInOtherCurrentLiabilities) +
                       Math.max(0, currentPeriodData.changeInInventory) +
                       Math.max(0, currentPeriodData.changeInInvestments) +
                       Math.max(0, currentPeriodData.changeInOtherNonCurrentLiabilities) +
                       Math.max(0, currentPeriodData.changeInRetainedEarnings);

    const cashOutflow = Math.abs(currentPeriodData.cogs) +
                        Math.abs(currentPeriodData.expenses) +
                        Math.abs(currentPeriodData.cashTaxPaid) +
                        Math.abs(Math.min(0, currentPeriodData.changeInAccountsPayable)) +
                        Math.abs(Math.min(0, currentPeriodData.changeInOtherCurrentLiabilities)) +
                        Math.abs(currentPeriodData.changeInAccountsReceivable) +
                        Math.abs(Math.min(0, currentPeriodData.changeInInventory)) +
                        Math.abs(currentPeriodData.changeInWorkInProgress) +
                        Math.abs(currentPeriodData.changeInOtherCurrentAssets) +
                        Math.abs(currentPeriodData.changeInFixedAssets) +
                        Math.abs(currentPeriodData.changeInIntangibleAssets) +
                        Math.abs(Math.min(0, currentPeriodData.changeInInvestments)) +
                        Math.abs(currentPeriodData.netInterest) +
                        Math.abs(currentPeriodData.dividends) +
                        Math.abs(currentPeriodData.adjustments);

    const netCashFlow = cashInflow - cashOutflow;

    return { cashInflow, cashOutflow, netCashFlow };
  }, [currentPeriodData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#101010]">Cash Flow Analysis</h2>
        <p className="text-gray-600 mt-1">Track your cash inflows and outflows</p>
      </div>

      {/* Time Period Selection Controls */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-1">
                <button
                  onClick={() => setDateViewMode('months')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    dateViewMode === 'months'
                      ? 'bg-white text-[#7B68EE] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setDateViewMode('quarters')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    dateViewMode === 'quarters'
                      ? 'bg-white text-[#7B68EE] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setDateViewMode('years')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    dateViewMode === 'years'
                      ? 'bg-white text-[#7B68EE] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-1">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedMonth === month
                        ? 'bg-white text-[#7B68EE] shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-1">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                  <button
                    key={quarter}
                    onClick={() => setSelectedQuarter(quarter)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedQuarter === quarter
                        ? 'bg-white text-[#7B68EE] shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {quarter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-1">
                {[2023, 2024, 2025, 2026, 2027].map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedYear === year
                        ? 'bg-white text-[#7B68EE] shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Viewing: <span className="font-semibold text-[#101010]">
              {dateViewMode === 'months' && `${selectedMonth} ${selectedYear}`}
              {dateViewMode === 'quarters' && `${selectedQuarter} ${selectedYear}`}
              {dateViewMode === 'years' && `FY ${selectedYear}`}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101010]">Cash Flow Waterfall</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Budget to Actual Bridge</span>
          </div>
        </div>
        <div className="space-y-1">
          {waterfallData.map((item, index) => {
            const startPosition = getWaterfallPosition(index);
            const endPosition = getCalculatedValue(index);
            const displayValue = item.type === 'subtotal' || item.type === 'ending' ? endPosition : item.value;
            const maxValue = maxRevenueForScale;
            const minValue = 0;
            const range = maxValue - minValue;

            const isTotal = item.type === 'starting' || item.type === 'ending' || item.type === 'subtotal';
            const isSubtotal = item.type === 'subtotal';

            return (
              <div key={index} className={`flex items-center gap-4 ${isTotal ? 'py-2 border-t border-gray-200' : 'py-1'}`}>
                <div className="w-80 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {!isTotal && (
                      <span className="text-xs text-gray-500 uppercase font-medium">
                        {item.type === 'increase' ? 'ADD' : 'LESS'}
                      </span>
                    )}
                    <span className={`text-sm ${isTotal ? 'font-bold text-[#101010]' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </div>
                </div>
                <div className="flex-1 relative h-10 flex items-center">
                  {isTotal ? (
                    <div
                      className={`h-8 flex items-center justify-center ${
                        item.type === 'starting' ? 'bg-[#10B981] rounded' :
                        isSubtotal ? 'bg-[#3B82F6] rounded' :
                        'bg-[#10B981] rounded'
                      }`}
                      style={{
                        width: `${(endPosition / range) * 100}%`,
                        minWidth: '80px'
                      }}
                    >
                      <span className="text-xs font-bold text-white">
                        {formatCurrency(displayValue)}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div
                        className="h-8 bg-transparent"
                        style={{
                          width: `${(Math.min(startPosition, endPosition) / range) * 100}%`
                        }}
                      />
                      <div
                        className={`h-8 flex items-center justify-center ${
                          item.type === 'increase' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                        }`}
                        style={{
                          width: `${(Math.abs(item.value) / range) * 100}%`,
                          minWidth: '60px'
                        }}
                      >
                        <span className="text-xs font-bold text-white">
                          {item.value !== 0 ? (item.type === 'increase' ? '+' : '') + formatCurrency(item.value) : '$0'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#10B981] rounded" />
              <span className="text-xs text-gray-600">Cash Received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#EF4444] rounded" />
              <span className="text-xs text-gray-600">Cash Spent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#3B82F6] rounded" />
              <span className="text-xs text-gray-600">Subtotals</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Cash Flow Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Inflow Sources">
          <div className="space-y-3">
            {[
              { source: 'Product Sales', amount: 485000, percentage: 57.2 },
              { source: 'Service Revenue', amount: 245000, percentage: 28.9 },
              { source: 'Licensing', amount: 87500, percentage: 10.3 },
              { source: 'Other Income', amount: 30000, percentage: 3.6 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-[#101010]">{item.source}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-[#4ADE80] h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-[#4ADE80]">${item.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Expense Categories">
          <div className="space-y-3">
            {[
              { category: 'Salaries & Benefits', amount: 285000, percentage: 45.7 },
              { category: 'Operating Expenses', amount: 156000, percentage: 25.0 },
              { category: 'Technology & Software', amount: 98500, percentage: 15.8 },
              { category: 'Marketing', amount: 83700, percentage: 13.4 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-[#101010]">{item.category}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-[#F87171] h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-[#F87171]">${item.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CashFlow;