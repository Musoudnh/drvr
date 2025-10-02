import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar, Filter, Download, Settings, BarChart3, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface KPIMetric {
  name: string;
  value: string;
  change: number;
  changeLabel: string;
  benchmark?: string;
  status: 'good' | 'warning' | 'critical';
}

interface VarianceItem {
  category: string;
  budget: number;
  actual: number;
  forecast: number;
  variance: number;
  variancePercent: number;
  status: 'positive' | 'negative' | 'neutral';
}

interface WaterfallItem {
  label: string;
  value: number;
  type: 'starting' | 'increase' | 'decrease' | 'ending' | 'subtotal';
}

interface MarginAnalysis {
  segment: string;
  revenue: number;
  costs: number;
  margin: number;
  marginPercent: number;
}

const Insights: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedKPIView, setSelectedKPIView] = useState<'all' | 'revenue' | 'efficiency'>('all');

  const allKpiMetrics: KPIMetric[] = [
    {
      name: 'ARR',
      value: '$12.4M',
      change: 18.2,
      changeLabel: 'vs last year',
      benchmark: '$11.2M',
      status: 'good'
    },
    {
      name: 'MRR',
      value: '$1.03M',
      change: 5.3,
      changeLabel: 'vs last month',
      benchmark: '$980K',
      status: 'good'
    },
    {
      name: 'Churn Rate',
      value: '3.2%',
      change: -0.8,
      changeLabel: 'vs last month',
      benchmark: '4.0%',
      status: 'good'
    },
    {
      name: 'CAC',
      value: '$4,250',
      change: 12.5,
      changeLabel: 'vs last quarter',
      benchmark: '$3,800',
      status: 'warning'
    },
    {
      name: 'LTV',
      value: '$68,400',
      change: 8.7,
      changeLabel: 'vs last quarter',
      benchmark: '$62,000',
      status: 'good'
    },
    {
      name: 'LTV:CAC Ratio',
      value: '16.1x',
      change: -2.1,
      changeLabel: 'vs last quarter',
      benchmark: '16.0x',
      status: 'good'
    },
    {
      name: 'Burn Multiple',
      value: '1.2x',
      change: -15.3,
      changeLabel: 'vs last quarter',
      benchmark: '1.5x',
      status: 'good'
    },
    {
      name: 'Cash Runway',
      value: '18 mo',
      change: -2,
      changeLabel: 'vs last quarter',
      benchmark: '18 mo',
      status: 'warning'
    }
  ];

  const varianceData: VarianceItem[] = [
    {
      category: 'Total Revenue',
      budget: 1200000,
      actual: 1285000,
      forecast: 1250000,
      variance: 85000,
      variancePercent: 7.08,
      status: 'positive'
    },
    {
      category: 'Subscription Revenue',
      budget: 950000,
      actual: 1020000,
      forecast: 980000,
      variance: 70000,
      variancePercent: 7.37,
      status: 'positive'
    },
    {
      category: 'Professional Services',
      budget: 250000,
      actual: 265000,
      forecast: 270000,
      variance: 15000,
      variancePercent: 6.0,
      status: 'positive'
    },
    {
      category: 'Total COGS',
      budget: 180000,
      actual: 195000,
      forecast: 185000,
      variance: -15000,
      variancePercent: -8.33,
      status: 'negative'
    },
    {
      category: 'Sales & Marketing',
      budget: 420000,
      actual: 465000,
      forecast: 440000,
      variance: -45000,
      variancePercent: -10.71,
      status: 'negative'
    },
    {
      category: 'R&D',
      budget: 380000,
      actual: 375000,
      forecast: 385000,
      variance: 5000,
      variancePercent: 1.32,
      status: 'positive'
    },
    {
      category: 'G&A',
      budget: 220000,
      actual: 228000,
      forecast: 225000,
      variance: -8000,
      variancePercent: -3.64,
      status: 'negative'
    }
  ];

  const waterfallData: WaterfallItem[] = [
    { label: 'Revenue', value: 1483550, type: 'starting' },
    { label: 'Cost of Goods Sold', value: -788324, type: 'decrease' },
    { label: 'Expenses', value: -477590, type: 'decrease' },
    { label: 'Other Income', value: 0, type: 'increase' },
    { label: 'Cash Tax Paid', value: -11863, type: 'decrease' },
    { label: 'Change in Accounts Payable', value: 17489, type: 'increase' },
    { label: 'Change in Other Current Liabilities', value: 66459, type: 'increase' },
    { label: 'Change in Accounts Receivable', value: -211966, type: 'decrease' },
    { label: 'Change in Inventory', value: 31220, type: 'increase' },
    { label: 'Change in Work in Progress', value: 0, type: 'decrease' },
    { label: 'Change in Other Current Assets', value: 0, type: 'decrease' },
    { label: 'Change in Fixed Assets (ex. Depreciation and Amortization)', value: -34246, type: 'decrease' },
    { label: 'Change in Intangible Assets', value: 0, type: 'decrease' },
    { label: 'Change in Investments or Other Non-Current Assets', value: 4227, type: 'increase' },
    { label: 'Net Interest (after tax)', value: -27680, type: 'decrease' },
    { label: 'Change in Other Non-Current Liabilities', value: 0, type: 'increase' },
    { label: 'Dividends', value: 0, type: 'decrease' },
    { label: 'Change in Retained Earnings and Other Equity', value: 0, type: 'increase' },
    { label: 'Adjustments', value: 0, type: 'decrease' }
  ];

  const marginAnalysis: MarginAnalysis[] = [
    {
      segment: 'Enterprise',
      revenue: 680000,
      costs: 170000,
      margin: 510000,
      marginPercent: 75.0
    },
    {
      segment: 'Mid-Market',
      revenue: 425000,
      costs: 127500,
      margin: 297500,
      marginPercent: 70.0
    },
    {
      segment: 'SMB',
      revenue: 180000,
      costs: 63000,
      margin: 117000,
      marginPercent: 65.0
    },
    {
      segment: 'North America',
      revenue: 770000,
      costs: 215600,
      margin: 554400,
      marginPercent: 72.0
    },
    {
      segment: 'EMEA',
      revenue: 385000,
      costs: 115500,
      margin: 269500,
      marginPercent: 70.0
    },
    {
      segment: 'APAC',
      revenue: 130000,
      costs: 29900,
      margin: 100100,
      marginPercent: 77.0
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const kpiMetrics = selectedKPIView === 'all'
    ? allKpiMetrics
    : selectedKPIView === 'revenue'
    ? allKpiMetrics.filter(m => ['ARR', 'MRR', 'Churn Rate'].includes(m.name))
    : allKpiMetrics.filter(m => ['CAC', 'LTV', 'LTV:CAC Ratio', 'Burn Multiple', 'Cash Runway'].includes(m.name));

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101010] mb-2">Business Insights</h1>
          <p className="text-gray-600">Analyze performance, track KPIs, and identify trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'monthly' | 'quarterly' | 'yearly')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="secondary">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-0.5 gap-1 w-fit">
        <button
          onClick={() => setSelectedKPIView('all')}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            selectedKPIView === 'all'
              ? 'bg-white text-[#7B68EE] shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Metrics
        </button>
        <button
          onClick={() => setSelectedKPIView('revenue')}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            selectedKPIView === 'revenue'
              ? 'bg-white text-[#7B68EE] shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Revenue
        </button>
        <button
          onClick={() => setSelectedKPIView('efficiency')}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            selectedKPIView === 'efficiency'
              ? 'bg-white text-[#7B68EE] shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Efficiency
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric) => (
          <Card key={metric.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metric.name}</span>
              {metric.status === 'good' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {metric.status === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              {metric.status === 'critical' && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="text-2xl font-bold text-[#101010] mb-1">{metric.value}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {metric.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatPercent(metric.change)}
                </span>
              </div>
              <span className="text-xs text-gray-500">{metric.changeLabel}</span>
            </div>
            {metric.benchmark && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Benchmark: <span className="font-medium text-gray-700">{metric.benchmark}</span>
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101010]">Variance Analysis</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Budget vs Actual vs Forecast</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Budget</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actual</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Forecast</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Variance ($)</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Variance (%)</th>
              </tr>
            </thead>
            <tbody>
              {varianceData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index === 0 || index === 3 ? 'font-semibold bg-gray-50' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-gray-900">{item.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {formatCurrency(item.budget)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.actual)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {formatCurrency(item.forecast)}
                  </td>
                  <td
                    className={`py-3 px-4 text-sm text-right font-medium ${
                      item.status === 'positive'
                        ? 'text-green-600'
                        : item.status === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {formatCurrency(item.variance)}
                  </td>
                  <td
                    className={`py-3 px-4 text-sm text-right font-medium ${
                      item.status === 'positive'
                        ? 'text-green-600'
                        : item.status === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {formatPercent(item.variancePercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101010]">Variance Waterfall</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Budget to Actual Bridge</span>
          </div>
        </div>
        <div className="space-y-1">
          {waterfallData.map((item, index) => {
            const position = getWaterfallPosition(index);
            const maxValue = 1600000;
            const startPercent = (position / maxValue) * 100;
            const valuePercent = (Math.abs(item.value) / maxValue) * 100;
            const isTotal = item.type === 'starting' || item.type === 'ending';

            return (
              <div key={index} className={`flex items-center gap-4 ${isTotal ? 'py-2' : 'py-1'}`}>
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
                      className={`h-8 rounded flex items-center justify-center ${
                        item.type === 'starting' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{
                        width: `${(item.value / maxValue) * 100}%`,
                        minWidth: '60px'
                      }}
                    >
                      <span className="text-xs font-bold text-white">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div
                        className="h-8 bg-transparent"
                        style={{
                          width: `${startPercent}%`,
                          minWidth: startPercent > 0 ? '1px' : '0'
                        }}
                      />
                      <div
                        className={`h-8 rounded flex items-center justify-center ${
                          item.type === 'increase' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${valuePercent}%`,
                          minWidth: '50px'
                        }}
                      >
                        <span className="text-xs font-bold text-white">
                          {item.value !== 0 ? (item.type === 'increase' ? '+' : '') + formatCurrency(item.value) : formatCurrency(0)}
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
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[#101010] mb-6">Margin Analysis by Segment</h2>
          <div className="space-y-4">
            {marginAnalysis.slice(0, 3).map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{item.segment}</span>
                  <span className="text-sm font-semibold text-[#3AB7BF]">
                    {item.marginPercent}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Revenue</div>
                    <div className="font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Costs</div>
                    <div className="font-medium text-gray-900">{formatCurrency(item.costs)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Margin</div>
                    <div className="font-medium text-green-600">{formatCurrency(item.margin)}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#3AB7BF] to-[#2A9AA1] h-2 rounded-full"
                      style={{ width: `${item.marginPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-[#101010] mb-6">Margin Analysis by Region</h2>
          <div className="space-y-4">
            {marginAnalysis.slice(3).map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{item.segment}</span>
                  <span className="text-sm font-semibold text-[#3AB7BF]">
                    {item.marginPercent}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Revenue</div>
                    <div className="font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Costs</div>
                    <div className="font-medium text-gray-900">{formatCurrency(item.costs)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Margin</div>
                    <div className="font-medium text-green-600">{formatCurrency(item.margin)}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#3AB7BF] to-[#2A9AA1] h-2 rounded-full"
                      style={{ width: `${item.marginPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101010]">Trend Analysis & Heatmap</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 12 Months
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-2 text-sm font-medium text-gray-700">Category</div>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
            (month) => (
              <div key={month} className="text-xs text-center text-gray-600 font-medium">
                {month}
              </div>
            )
          )}

          {['Revenue', 'COGS', 'Sales', 'Marketing', 'R&D', 'G&A'].map((category) => {
            const values = Array.from({ length: 12 }, () => Math.random() * 100 - 50);
            return (
              <React.Fragment key={category}>
                <div className="col-span-2 text-sm text-gray-700 py-2">{category}</div>
                {values.map((value, index) => {
                  const intensity = Math.abs(value) / 50;
                  const color =
                    value > 0
                      ? `rgba(34, 197, 94, ${intensity})`
                      : `rgba(239, 68, 68, ${intensity})`;
                  return (
                    <div
                      key={index}
                      className="aspect-square rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all"
                      style={{ backgroundColor: color }}
                      title={`${category} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}: ${value.toFixed(1)}%`}
                    >
                      {Math.abs(value) > 20 && (
                        <span className={value > 0 ? 'text-green-900' : 'text-red-900'}>
                          {value.toFixed(0)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-xs text-gray-600">Negative Variance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <span className="text-xs text-gray-600">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-xs text-gray-600">Positive Variance</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Insights;
