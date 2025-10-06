import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, AlertCircle, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../../components/UI/Card';
import FinancialPerformanceDashboard from '../../components/Dashboard/FinancialPerformanceDashboard';

const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis'>('overview');

  const metrics = [
    { label: 'Revenue (MTD vs Prior)', value: '$847,245', change: '+12.5% vs last month', positive: true, icon: DollarSign },
    { label: 'Gross Margin %', value: '62.1%', change: '+3.2% vs prior period', positive: true, icon: TrendingUp },
    { label: 'Operating Expenses % of Revenue', value: '31.4%', change: '-2.1% vs prior period', positive: true, icon: BarChart3 },
    { label: 'Cash Balance / Runway', value: '$485K', change: '8.2 months runway', positive: true, icon: AlertCircle }
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-[#3AB7BF] text-[#3AB7BF]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analysis'
                ? 'border-[#3AB7BF] text-[#3AB7BF]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analysis
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 leading-tight">{metric.label}</p>
                    <p className="text-lg font-bold text-[#101010] mt-0.5">{metric.value}</p>
                    <p className={`text-xs mt-1 ${metric.positive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                      {metric.change} from last month
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${metric.positive ? 'bg-[#4ADE80]/10' : 'bg-[#F87171]/10'}`}>
                    <metric.icon className={`w-5 h-5 ${metric.positive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Performance Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Actual vs Budget (YTD)">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Revenue</p>
                    <p className="text-sm text-gray-600">Actual: $3,670K</p>
                    <p className="text-sm text-gray-600">Budget: $3,400K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      +7.9%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Gross Profit</p>
                    <p className="text-sm text-gray-600">Actual: $2,080K</p>
                    <p className="text-sm text-gray-600">Budget: $1,950K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      +6.7%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Operating Expenses</p>
                    <p className="text-sm text-gray-600">Actual: $1,246K</p>
                    <p className="text-sm text-gray-600">Budget: $1,300K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                      <ArrowDown className="w-4 h-4 mr-1" />
                      -4.2%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Net Income</p>
                    <p className="text-sm text-gray-600">Actual: $834K</p>
                    <p className="text-sm text-gray-600">Budget: $650K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      +28.3%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Actual vs Prior Year (YTD)">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Revenue</p>
                    <p className="text-sm text-gray-600">2025: $3,670K</p>
                    <p className="text-sm text-gray-600">2024: $3,180K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      +15.4%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Gross Profit</p>
                    <p className="text-sm text-gray-600">2025: $2,080K</p>
                    <p className="text-sm text-gray-600">2024: $1,850K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      +12.4%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Operating Expenses</p>
                    <p className="text-sm text-gray-600">2025: $1,246K</p>
                    <p className="text-sm text-gray-600">2024: $1,200K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#F87171] flex items-center justify-end">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      +3.8%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">Net Income</p>
                    <p className="text-sm text-gray-600">2025: $834K</p>
                    <p className="text-sm text-gray-600">2024: $650K</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      +28.3%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-4">
            <Card title="AI Financial Summary">
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-gradient-to-r from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-lg border border-[#3AB7BF]/20">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#101010] mb-1 text-sm">January 2025 Performance Insights</h4>
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">
                      Your January performance shows strong momentum with revenue exceeding targets by 12.5%.
                      Cash flow remains healthy at $224K positive, and profit margins improved to 26.4% -
                      above industry average of 22.3%.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full mr-1.5"></div>
                        <span className="text-gray-600">Revenue growth accelerating</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full mr-1.5"></div>
                        <span className="text-gray-600">Margins expanding consistently</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full mr-1.5"></div>
                        <span className="text-gray-600">Watch Q2 seasonal trends</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-[#3AB7BF] rounded-full mr-1.5"></div>
                        <span className="text-gray-600">Cash position strengthening</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-[#101010] rounded flex items-center justify-center mr-4">
                      <span className="text-white font-medium text-sm">P</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#101010]">Performance vs Targets</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#101010]">+2.7%</span>
                        <span className="text-sm text-gray-600">vs budget</span>
                        <span className="text-lg font-bold text-[#4ADE80]">+12.5%</span>
                        <span className="text-sm text-gray-600">vs prior</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">On Track</span>
                    <span className="px-2 py-1 bg-[#3AB7BF]/20 text-[#3AB7BF] rounded-full text-xs">Exceeding</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
                    <h5 className="font-medium text-[#101010] mb-0.5 text-xs">Key Strength</h5>
                    <p className="text-xs text-gray-600">Revenue diversification across product lines reducing risk</p>
                  </div>
                  <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                    <h5 className="font-medium text-[#101010] mb-0.5 text-xs">Watch Area</h5>
                    <p className="text-xs text-gray-600">Marketing spend up 23% - monitor ROI closely</p>
                  </div>
                  <div className="p-2 bg-[#3AB7BF]/10 rounded-lg">
                    <h5 className="font-medium text-[#101010] mb-0.5 text-xs">Opportunity</h5>
                    <p className="text-xs text-gray-600">Consider pricing optimization for 5-8% margin boost</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Last updated: 2 hours ago</p>
                  <button className="text-xs text-[#3AB7BF] hover:underline">Ask AI →</button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'analysis' && (
        <>
          {/* Financial Performance Dashboard - Moved from Overview */}
          <FinancialPerformanceDashboard />
        </>
      )}
    </div>
  );
};

export default CompanyDashboard;