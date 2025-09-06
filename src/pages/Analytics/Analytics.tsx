import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Eye, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Main Analytics Section */}
      <Card title="Key Performance Metrics" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Trends */}
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#4ADE80]">+15.4%</p>
            <p className="text-sm text-gray-600">Overall Growth</p>
            <p className="text-xs text-gray-500 mt-1">vs last quarter</p>
          </div>

          {/* Revenue */}
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#3AB7BF]">$847,245</p>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-xs text-gray-500 mt-1">+12.5% from last month</p>
          </div>

          {/* Net Profit */}
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <BarChart3 className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#4ADE80]">$224,300</p>
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-xs text-gray-500 mt-1">26.5% margin</p>
          </div>

          {/* Margins */}
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <PieChart className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#F59E0B]">26.5%</p>
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="text-xs text-gray-500 mt-1">Above industry avg</p>
          </div>
        </div>
      </Card>

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Actual vs Budget (YTD)">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Revenue</p>
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
                <p className="font-medium text-[#1E2A38]">Gross Profit</p>
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
                <p className="font-medium text-[#1E2A38]">Operating Expenses</p>
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
                <p className="font-medium text-[#1E2A38]">Net Income</p>
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
                <p className="font-medium text-[#1E2A38]">Revenue</p>
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
                <p className="font-medium text-[#1E2A38]">Gross Profit</p>
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
                <p className="font-medium text-[#1E2A38]">Operating Expenses</p>
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
                <p className="font-medium text-[#1E2A38]">Net Income</p>
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

      {/* 12-Month Revenue Trend Chart */}
      <Card title="12-Month Revenue Trend">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Monthly Revenue Performance</span>
            <span className="text-sm text-[#4ADE80] font-medium">+15.4% YoY Growth</span>
          </div>
          <div className="relative h-64">
            {/* Chart Container */}
            <div className="h-48 relative">
              {/* Prior Year Line Graph (2024) - Light Grey */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <polyline
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  points="30,140 90,130 150,125 210,120 270,115 330,110 390,105 450,100 510,95 570,90 630,85 690,80"
                />
                {/* Data points for prior year */}
                {[140, 130, 125, 120, 115, 110, 105, 100, 95, 90, 85, 80].map((y, index) => (
                  <circle key={index} cx={30 + index * 60} cy={y} r="3" fill="#94A3B8" />
                ))}
              </svg>
              
              {/* Current Year Line Graph (2025) - Blue */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points="30,120 90,110 150,105 210,100 270,95 330,90 390,85 450,80 510,75 570,70 630,65 690,60"
                />
                {/* Data points for current year */}
                {[120, 110, 105, 100, 95, 90, 85, 80, 75, 70, 65, 60].map((y, index) => (
                  <circle key={index} cx={30 + index * 60} cy={y} r="4" fill="#3B82F6" />
                ))}
              </svg>
            </div>
            
            {/* Month Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <span key={index} className="flex-1 text-center">{month}</span>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3B82F6] rounded mr-2"></div>
              <span className="text-sm text-gray-600">2025</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-[#94A3B8] mr-2" style={{ borderTop: '2px dashed #94A3B8' }}></div>
              <span className="text-sm text-gray-600">2024</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#3AB7BF]">$847K</p>
              <p className="text-xs text-gray-500">Current Month</p>
              <p className="text-xs text-[#4ADE80]">+12.5% vs Prior Month</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#4ADE80]">$3.67M</p>
              <p className="text-xs text-gray-500">YTD</p>
              <p className="text-xs text-[#4ADE80]">+15.4% vs Prior YTD</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#F59E0B]">$10.2M</p>
              <p className="text-xs text-gray-500">FY Projection</p>
              <p className="text-xs text-[#4ADE80]">+18.7% vs Prior FY</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Profitability & Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profitability Metrics">
          <div className="space-y-6">
            {/* Sales vs Target */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Sales vs Target</span>
                <span className="text-sm font-bold text-[#4ADE80]">112.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#4ADE80] h-3 rounded-full relative" style={{ width: '112.5%', maxWidth: '100%' }}>
                  <div className="absolute right-0 top-0 h-full w-2 bg-[#4ADE80] opacity-75"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: $753K</span>
                <span>Actual: $847K</span>
              </div>
            </div>

            {/* Accounts Receivable Days */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Accounts Receivable Days</span>
                <span className="text-sm font-bold text-[#4ADE80]">32 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#4ADE80] h-3 rounded-full" style={{ width: '73%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: ≤ 45 days</span>
                <span>13 days better</span>
              </div>
            </div>

            {/* Accounts Payable Days */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Accounts Payable Days</span>
                <span className="text-sm font-bold text-[#3AB7BF]">28 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#3AB7BF] h-3 rounded-full" style={{ width: '93%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: 30 days</span>
                <span>2 days early</span>
              </div>
            </div>

            {/* Cash on Hand */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Cash on Hand</span>
                <span className="text-sm font-bold text-[#3AB7BF]">$485,200</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#3AB7BF] h-3 rounded-full" style={{ width: '81%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: $600K</span>
                <span>8.2 months runway</span>
              </div>
            </div>

            {/* Cash Flow Margin */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Cash Flow Margin</span>
                <span className="text-sm font-bold text-[#4ADE80]">26.4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#4ADE80] h-3 rounded-full" style={{ width: '88%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: 30%</span>
                <span>Above industry avg</span>
              </div>
            </div>

            {/* Net Variable Cash Flow */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Net Variable Cash Flow</span>
                <span className="text-sm font-bold text-[#4ADE80]">$224,300</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#4ADE80] h-3 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: $235K</span>
                <span>Strong performance</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Growth Metrics">
          <div className="space-y-6">
            {/* Revenue Growth */}
            <div className="flex items-center justify-between p-4 bg-[#4ADE80]/10 rounded-lg">
              <div>
                <p className="font-medium text-[#1E2A38]">Revenue Growth</p>
                <p className="text-sm text-gray-600">YoY growth rate</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#4ADE80]">+15.4%</p>
                <p className="text-xs text-gray-500">vs 12.1% target</p>
              </div>
            </div>

            {/* Margin Growth */}
            <div className="flex items-center justify-between p-4 bg-[#3AB7BF]/10 rounded-lg">
              <div>
                <p className="font-medium text-[#1E2A38]">Margin Growth</p>
                <p className="text-sm text-gray-600">Profit margin expansion</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#3AB7BF]">+3.2%</p>
                <p className="text-xs text-gray-500">vs 2.5% target</p>
              </div>
            </div>

            {/* EBITDA Growth */}
            <div className="flex items-center justify-between p-4 bg-[#F59E0B]/10 rounded-lg">
              <div>
                <p className="font-medium text-[#1E2A38]">EBITDA Growth</p>
                <p className="text-sm text-gray-600">Earnings growth rate</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#F59E0B]">+18.7%</p>
                <p className="text-xs text-gray-500">vs 15.0% target</p>
              </div>
            </div>

            {/* Equity Change */}
            <div className="flex items-center justify-between p-4 bg-[#8B5CF6]/10 rounded-lg">
              <div>
                <p className="font-medium text-[#1E2A38]">Equity Change</p>
                <p className="text-sm text-gray-600">Shareholders' equity growth</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#8B5CF6]">+12.7%</p>
                <p className="text-xs text-gray-500">vs 10.0% target</p>
              </div>
            </div>

            {/* Asset Change */}
            <div className="flex items-center justify-between p-4 bg-[#EC4899]/10 rounded-lg">
              <div>
                <p className="font-medium text-[#1E2A38]">Asset Change</p>
                <p className="text-sm text-gray-600">Total asset growth</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#EC4899]">+8.3%</p>
                <p className="text-xs text-gray-500">vs 7.5% target</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;