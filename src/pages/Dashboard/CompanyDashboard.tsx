import React from 'react';
import { TrendingUp, DollarSign, Users, AlertCircle, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../../components/UI/Card';

const CompanyDashboard: React.FC = () => {
  const metrics = [
    { label: 'Revenue (MTD vs Prior)', value: '$847,245', change: '+12.5% vs last month', positive: true, icon: DollarSign },
    { label: 'Gross Margin %', value: '62.1%', change: '+3.2% vs prior period', positive: true, icon: TrendingUp },
    { label: 'Operating Expenses % of Revenue', value: '31.4%', change: '-2.1% vs prior period', positive: true, icon: BarChart3 },
    { label: 'Cash Balance / Runway', value: '$485K', change: '8.2 months runway', positive: true, icon: AlertCircle }
  ];

  return (
    <div className="space-y-6 pt-2">
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4">
        <Card title="Revenue Analysis">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Monthly Revenue Growth</span>
              <span className="text-xs text-[#4ADE80] font-medium">+12.5% vs Prior Month</span>
            </div>
            <div className="relative h-48">
              {/* Chart Container */}
              <div className="h-64 relative">
                {/* Prior Year Line Graph (2024) - Light Grey */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  <polyline
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    points="30,220 90,210 150,200 210,190 270,180 330,170 390,160 450,150 510,140 570,130 630,120 690,110"
                  />
                  {/* Data points for prior year */}
                  {[220, 210, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110].map((y, index) => (
                    <circle key={index} cx={30 + index * 60} cy={y} r="3" fill="#94A3B8" />
                  ))}
                </svg>
                
                {/* Current Year Line Graph (2025) - Blue */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    points="30,180 90,0 150,0 210,0 270,0 330,0 390,0 450,0 510,0 570,0 630,0 690,0"
                    strokeDasharray="0,0"
                  />
                  {/* Data points for current year - only January has data */}
                  <circle cx="30" cy="180" r="4" fill="#3B82F6" />
                  {/* Placeholder points for future months (invisible) */}
                  {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((y, index) => (
                    <circle key={index} cx={90 + index * 60} cy={y} r="0" fill="#3B82F6" opacity="0" />
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
            <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#3AB7BF] rounded mr-1.5"></div>
                <span className="text-xs text-gray-600">FY 2025</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-[#94A3B8] mr-1.5" style={{ borderTop: '2px dashed #94A3B8' }}></div>
                <span className="text-xs text-gray-600">FY 2024</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-base font-bold text-[#3AB7BF]">$847K</p>
                <p className="text-xs text-gray-500">Current Month</p>
                <p className="text-xs text-[#4ADE80]">+12.5% vs Prior Month</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#4ADE80]">$847K</p>
                <p className="text-xs text-gray-500">YTD</p>
                <p className="text-xs text-[#4ADE80]">+15.4% vs Prior YTD</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#F59E0B]">$10.2M</p>
                <p className="text-xs text-gray-500">FY Projection</p>
                <p className="text-xs text-[#4ADE80]">+18.7% vs Prior FY</p>
              </div>
            </div>
          </div>
        </Card>
      </div>


      {/* Detailed Analytics */}
      <Card title="Monthly Performance">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Metric</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">Current</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">Previous</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">Budget</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">vs Previous</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">vs Budget</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Revenue', current: '$847,245', previous: '$753,200', budget: '$825,000', change: '+12.5%', vsBudget: '+2.7%', positive: true, budgetPositive: true },
                { metric: 'Gross Profit', current: '$526,272', previous: '$467,488', budget: '$512,250', change: '+12.6%', vsBudget: '+2.7%', positive: true, budgetPositive: true },
                { metric: 'Operational Expenses', current: '$265,890', previous: '$248,120', budget: '$275,000', change: '+7.2%', vsBudget: '-3.3%', positive: false, budgetPositive: true },
                { metric: 'Net Income', current: '$224,065', previous: '$185,340', budget: '$195,000', change: '+20.9%', vsBudget: '+14.9%', positive: true, budgetPositive: true },
                { metric: 'Net Margin', current: '26.4%', previous: '24.6%', budget: '23.6%', change: '+1.8%', vsBudget: '+2.8%', positive: true, budgetPositive: true }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-[#101010] text-sm">{row.metric}</td>
                  <td className="py-2 px-3 text-right font-medium text-[#101010] text-sm">{row.current}</td>
                  <td className="py-2 px-3 text-right text-gray-600 text-sm">{row.previous}</td>
                  <td className="py-2 px-3 text-right text-gray-600 text-sm">{row.budget}</td>
                  <td className={`py-2 px-3 text-right font-medium text-sm ${row.positive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {row.change}
                  </td>
                  <td className={`py-2 px-3 text-right font-medium text-sm ${row.budgetPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {row.vsBudget}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
    </div>
  );
};

export default CompanyDashboard;