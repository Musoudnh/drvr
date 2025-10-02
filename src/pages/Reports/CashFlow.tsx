import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../../components/UI/Card';

interface WaterfallItem {
  label: string;
  value: number;
  type: 'starting' | 'increase' | 'decrease' | 'ending';
}

const CashFlow: React.FC = () => {
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

  const getWaterfallPosition = (index: number): number => {
    let position = 0;
    for (let i = 0; i < index; i++) {
      if (waterfallData[i].type === 'starting') {
        position = waterfallData[i].value;
      } else if (waterfallData[i].type === 'increase') {
        position += waterfallData[i].value;
      } else if (waterfallData[i].type === 'decrease') {
        position += waterfallData[i].value;
      }
    }
    return position;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#101010]">Cash Flow Analysis</h2>
        <p className="text-gray-600 mt-1">Track your cash inflows and outflows</p>
      </div>

      {/* Cash Flow Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Inflow</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">$847,500</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-[#4ADE80] mr-1" />
                <span className="text-sm text-[#4ADE80]">+12.5% vs last month</span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Outflow</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">$623,200</p>
              <div className="flex items-center mt-2">
                <ArrowDownRight className="w-4 h-4 text-[#F87171] mr-1" />
                <span className="text-sm text-[#F87171]">+8.3% vs last month</span>
              </div>
            </div>
            <TrendingDown className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">$224,300</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-[#4ADE80] mr-1" />
                <span className="text-sm text-[#4ADE80]">+18.7% vs last month</span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101010]">Cash Flow Waterfall</h2>
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
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-xs text-gray-600">Cash Received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-xs text-gray-600">Cash Spent</span>
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