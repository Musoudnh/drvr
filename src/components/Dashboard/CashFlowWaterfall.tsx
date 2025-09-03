import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowRight, Calculator } from 'lucide-react';
import Card from '../UI/Card';

interface WaterfallItem {
  label: string;
  value: number;
  type: 'positive' | 'negative' | 'total';
  category: 'operating' | 'investing' | 'financing' | 'total';
}

const CashFlowWaterfall: React.FC = () => {
  const waterfallData: WaterfallItem[] = [
    { label: 'Revenue', value: 847500, type: 'positive', category: 'operating' },
    { label: 'Cost of Goods Sold', value: -263000, type: 'negative', category: 'operating' },
    { label: 'Expenses', value: -218000, type: 'negative', category: 'operating' },
    { label: 'Other Income', value: 25600, type: 'positive', category: 'operating' },
    { label: 'Cash Tax Paid', value: -76110, type: 'negative', category: 'operating' },
    { label: 'Change in AP', value: 45200, type: 'positive', category: 'operating' },
    { label: 'Change in Other Current Liabilities', value: 12800, type: 'positive', category: 'operating' },
    { label: 'Change in AR', value: -89400, type: 'negative', category: 'operating' },
    { label: 'Change in Inventory', value: -34500, type: 'negative', category: 'operating' },
    { label: 'Change in WIP', value: -18200, type: 'negative', category: 'operating' },
    { label: 'Change in Other Current Assets', value: -15600, type: 'negative', category: 'operating' },
    { label: 'Operating Cash Flow', value: 315990, type: 'total', category: 'total' },
    { label: 'Change in Fixed Assets', value: -285400, type: 'negative', category: 'investing' },
    { label: 'Change in Intangible Assets', value: -45200, type: 'negative', category: 'investing' },
    { label: 'Change in Investments', value: -120125, type: 'negative', category: 'investing' },
    { label: 'Free Cash Flow', value: -134735, type: 'total', category: 'total' },
    { label: 'Net Interest (after tax)', value: -24800, type: 'negative', category: 'financing' },
    { label: 'Change in Other Non-Current Liabilities', value: 18900, type: 'positive', category: 'financing' },
    { label: 'Dividends', value: -45000, type: 'negative', category: 'financing' },
    { label: 'Change in Retained Earnings & Other Equity', value: 26950, type: 'positive', category: 'financing' },
    { label: 'Adjustments', value: -12563, type: 'negative', category: 'financing' },
    { label: 'Net Cash Flow', value: -171248, type: 'total', category: 'total' }
  ];

  // Calculate running totals for waterfall positioning
  let runningTotal = 0;
  const waterfallWithPositions = waterfallData.map((item, index) => {
    const startValue = runningTotal;
    if (item.type === 'total') {
      // For totals, calculate the actual total up to this point
      const actualTotal = waterfallData.slice(0, index).reduce((sum, prevItem) => {
        return prevItem.type !== 'total' ? sum + prevItem.value : sum;
      }, 0);
      runningTotal = actualTotal;
      return { ...item, startValue: 0, endValue: actualTotal, value: actualTotal };
    } else {
      runningTotal += item.value;
      return { ...item, startValue, endValue: runningTotal };
    }
  });

  const maxValue = Math.max(...waterfallWithPositions.map(item => Math.abs(item.endValue)));
  const minValue = Math.min(...waterfallWithPositions.map(item => Math.abs(item.endValue)));
  const chartHeight = 300;
  const chartWidth = waterfallWithPositions.length * 80;

  const getBarColor = (item: WaterfallItem) => {
    if (item.type === 'total') {
      if (item.category === 'total') {
        return item.value >= 0 ? '#3AB7BF' : '#F87171';
      }
      return '#6B7280';
    }
    return item.type === 'positive' ? '#4ADE80' : '#F87171';
  };

  const getBarHeight = (value: number) => {
    return Math.abs(value) / maxValue * (chartHeight - 60);
  };

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`;
    }
    return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <Card title="Cash Flow Waterfall">
        <div className="space-y-6">
          {/* Waterfall Chart */}
          <div className="overflow-x-auto">
            <div className="min-w-full" style={{ width: `${chartWidth + 200}px` }}>
              <div className="relative h-80 bg-gray-50 rounded-lg p-6">
                {/* Horizontal Waterfall Chart */}
                <div className="flex items-end justify-between h-full space-x-2">
                  {waterfallWithPositions.map((item, index) => {
                    const barHeight = Math.abs(item.value) / maxValue * 200; // Max height 200px
                    const isPositive = item.value >= 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center min-w-[80px]">
                        {/* Value label above bar */}
                        <div className="mb-2 text-center">
                          <span className={`text-xs font-semibold ${
                            item.type === 'total' ? 'text-[#1E2A38]' : 
                            isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'
                          }`}>
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                        
                        {/* Bar */}
                        <div className="flex flex-col items-center justify-end h-48">
                          <div
                            className={`w-12 rounded-t transition-all duration-300 hover:opacity-80 ${
                              item.type === 'total' ? 'bg-[#3AB7BF]' :
                              isPositive ? 'bg-[#4ADE80]' : 'bg-[#F87171]'
                            }`}
                            style={{ height: `${barHeight}px` }}
                          />
                          
                          {/* Connecting arrow */}
                          {index < waterfallWithPositions.length - 1 && (
                            <div className="absolute" style={{ 
                              left: '50%', 
                              transform: 'translateX(50%)',
                              top: '50%'
                            }}>
                              <div className="w-6 h-0.5 bg-gray-400" />
                              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400 ml-auto" />
                            </div>
                          )}
                        </div>
                        
                        {/* Label below bar */}
                        <div className="mt-2 text-center">
                          <span className="text-xs text-gray-600 leading-tight block max-w-[70px]">
                            {item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Baseline */}
                <div className="absolute bottom-16 left-6 right-6 h-0.5 bg-gray-300" />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#4ADE80] rounded mr-2"></div>
              <span className="text-gray-600">Cash Inflows</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#F87171] rounded mr-2"></div>
              <span className="text-gray-600">Cash Outflows</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3AB7BF] rounded mr-2"></div>
              <span className="text-gray-600">Net Totals</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Reconciliation Section */}
      <Card title="Cash Flow Reconciliation">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Net Cash Flow Calculation */}
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Net Cash Flow Calculation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#4ADE80]/10 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Operating Cash Flow</span>
                <span className="font-bold text-[#4ADE80]">$315,990</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F87171]/10 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Investing Cash Flow</span>
                <span className="font-bold text-[#F87171]">-$450,725</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F59E0B]/10 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Financing Cash Flow</span>
                <span className="font-bold text-[#F59E0B]">-$36,513</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#1E2A38]/10 rounded-lg border-2 border-[#1E2A38]/20">
                <span className="font-bold text-[#1E2A38]">Net Cash Flow</span>
                <span className="font-bold text-[#F87171] text-lg">-$171,248</span>
              </div>
            </div>
          </div>

          {/* Balance Changes */}
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Balance Sheet Changes
            </h3>
            <div className="space-y-4">
              {/* Cash on Hand */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#1E2A38] mb-3">Change in Cash on Hand</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Opening Balance</span>
                  <span className="font-medium text-[#1E2A38]">$98,364</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Closing Balance</span>
                  <span className="font-medium text-[#1E2A38]">$56,399</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium text-[#1E2A38]">Net Change</span>
                  <span className="font-bold text-[#F87171]">-$41,965</span>
                </div>
              </div>

              {/* Debt */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#1E2A38] mb-3">Change in Debt</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Opening Balance</span>
                  <span className="font-medium text-[#1E2A38]">$99,482</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Closing Balance</span>
                  <span className="font-medium text-[#1E2A38]">$111,717</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium text-[#1E2A38]">Net Change</span>
                  <span className="font-bold text-[#4ADE80]">+$12,234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Insights */}
      <Card title="Cash Flow Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Strong Operations</h3>
            <p className="text-sm text-gray-600">Operating cash flow of $316K shows healthy core business performance</p>
          </div>
          
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <TrendingDown className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Investment Phase</h3>
            <p className="text-sm text-gray-600">Heavy capital investments of $451K indicate growth phase</p>
          </div>
          
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Financing Strategy</h3>
            <p className="text-sm text-gray-600">Modest debt increase helps fund growth while maintaining leverage ratios</p>
          </div>
        </div>
      </Card>

      {/* Detailed Breakdown */}
      <Card title="Cash Flow Components">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Component</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Revenue</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Impact</th>
              </tr>
            </thead>
            <tbody>
              {/* Operating Activities */}
              <tr className="bg-[#4ADE80]/10">
                <td colSpan={4} className="py-3 px-4 font-bold text-[#1E2A38] text-base">OPERATING ACTIVITIES</td>
              </tr>
              {waterfallData.filter(item => item.category === 'operating' && item.type !== 'total').map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-[#1E2A38]">{item.label}</td>
                  <td className={`py-2 px-4 text-right font-medium ${item.value >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {formatCurrency(item.value)}
                  </td>
                  <td className="py-2 px-4 text-right text-gray-600">
                    {((Math.abs(item.value) / 847500) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-4 text-center">
                    {item.value >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-[#4ADE80] mx-auto" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-[#F87171] mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 border-gray-300 bg-[#4ADE80]/5">
                <td className="py-3 px-4 font-bold text-[#1E2A38]">OPERATING CASH FLOW</td>
                <td className="py-3 px-4 text-right font-bold text-[#4ADE80]">$315,990</td>
                <td className="py-3 px-4 text-right font-bold text-gray-600">37.3%</td>
                <td className="py-3 px-4 text-center">
                  <TrendingUp className="w-4 h-4 text-[#4ADE80] mx-auto" />
                </td>
              </tr>

              {/* Investing Activities */}
              <tr className="bg-[#F87171]/10">
                <td colSpan={4} className="py-3 px-4 font-bold text-[#1E2A38] text-base">INVESTING ACTIVITIES</td>
              </tr>
              {waterfallData.filter(item => item.category === 'investing').map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-[#1E2A38]">{item.label}</td>
                  <td className="py-2 px-4 text-right font-medium text-[#F87171]">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="py-2 px-4 text-right text-gray-600">
                    {((Math.abs(item.value) / 847500) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-4 text-center">
                    <TrendingDown className="w-4 h-4 text-[#F87171] mx-auto" />
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 border-gray-300 bg-[#F87171]/5">
                <td className="py-3 px-4 font-bold text-[#1E2A38]">FREE CASH FLOW</td>
                <td className="py-3 px-4 text-right font-bold text-[#F87171]">-$134,735</td>
                <td className="py-3 px-4 text-right font-bold text-gray-600">-15.9%</td>
                <td className="py-3 px-4 text-center">
                  <TrendingDown className="w-4 h-4 text-[#F87171] mx-auto" />
                </td>
              </tr>

              {/* Financing Activities */}
              <tr className="bg-[#F59E0B]/10">
                <td colSpan={4} className="py-3 px-4 font-bold text-[#1E2A38] text-base">FINANCING ACTIVITIES</td>
              </tr>
              {waterfallData.filter(item => item.category === 'financing').map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-[#1E2A38]">{item.label}</td>
                  <td className={`py-2 px-4 text-right font-medium ${item.value >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {formatCurrency(item.value)}
                  </td>
                  <td className="py-2 px-4 text-right text-gray-600">
                    {((Math.abs(item.value) / 847500) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-4 text-center">
                    {item.value >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-[#4ADE80] mx-auto" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-[#F87171] mx-auto" />
                    )}
                  </td>
                </tr>
              ))}

              {/* Final Net Cash Flow */}
              <tr className="border-b-2 border-gray-500 bg-[#1E2A38]/5">
                <td className="py-4 px-4 font-bold text-[#1E2A38] text-lg">NET CASH FLOW</td>
                <td className="py-4 px-4 text-right font-bold text-[#F87171] text-lg">-$171,248</td>
                <td className="py-4 px-4 text-right font-bold text-gray-600">-20.2%</td>
                <td className="py-4 px-4 text-center">
                  <TrendingDown className="w-5 h-5 text-[#F87171] mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CashFlowWaterfall;