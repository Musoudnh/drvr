import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../../components/UI/Card';

const CashFlow: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Cash Flow Analysis</h2>
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

      {/* Cash Flow Chart */}
      <Card title="Cash Flow Trend">
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Cash Flow Chart Visualization</p>
            <p className="text-gray-400 text-sm">Interactive chart showing monthly trends</p>
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
                  <p className="font-medium text-[#1E2A38]">{item.source}</p>
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
                  <p className="font-medium text-[#1E2A38]">{item.category}</p>
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