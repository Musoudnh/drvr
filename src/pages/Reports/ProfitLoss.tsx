import React, { useState } from 'react';
import { LineChart, TrendingUp, DollarSign, Percent, MoreHorizontal, User, Clock, CreditCard as Edit3 } from 'lucide-react';
import Card from '../../components/UI/Card';

const ProfitLoss: React.FC = () => {
  const [showActivity, setShowActivity] = useState<{ [key: string]: boolean }>({});
  const [activityData] = useState({
    'total-revenue': [
      { user: 'Sarah Johnson', action: 'Updated Q4 revenue figures', date: '2 hours ago', amount: '$6,595,000', previousAmount: '$6,450,000' },
      { user: 'Michael Chen', action: 'Added service revenue adjustment', date: '1 day ago', amount: '$6,450,000', previousAmount: '$6,380,000' },
      { user: 'Emily Rodriguez', action: 'Initial data entry', date: '3 days ago', amount: '$6,380,000', previousAmount: '$0' }
    ],
    'total-cogs': [
      { user: 'David Kim', action: 'Updated material costs', date: '4 hours ago', amount: '$3,073,000', previousAmount: '$3,120,000' },
      { user: 'Sarah Johnson', action: 'Adjusted labor costs', date: '1 day ago', amount: '$3,120,000', previousAmount: '$3,050,000' }
    ],
    'gross-profit': [
      { user: 'System', action: 'Auto-calculated from revenue and COGS', date: '4 hours ago', amount: '$3,522,000', previousAmount: '$3,330,000' }
    ],
    'total-opex': [
      { user: 'Michael Chen', action: 'Added Q4 marketing expenses', date: '6 hours ago', amount: '$2,021,400', previousAmount: '$1,980,000' },
      { user: 'Lisa Thompson', action: 'Updated payroll figures', date: '2 days ago', amount: '$1,980,000', previousAmount: '$1,950,000' }
    ],
    'operating-income': [
      { user: 'System', action: 'Auto-calculated from gross profit and expenses', date: '6 hours ago', amount: '$1,500,600', previousAmount: '$1,350,000' }
    ],
    'income-before-tax': [
      { user: 'David Kim', action: 'Added interest expense adjustment', date: '1 day ago', amount: '$1,486,600', previousAmount: '$1,520,000' }
    ],
    'net-income': [
      { user: 'Sarah Johnson', action: 'Updated tax calculations', date: '3 hours ago', amount: '$975,000', previousAmount: '$988,000' },
      { user: 'System', action: 'Auto-calculated final net income', date: '3 hours ago', amount: '$988,000', previousAmount: '$950,000' }
    ]
  });

  const toggleActivity = (key: string) => {
    setShowActivity(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderActivityButton = (key: string) => (
    <button
      onClick={() => toggleActivity(key)}
      className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
      title="View activity"
    >
      <MoreHorizontal className="w-4 h-4 text-gray-400" />
    </button>
  );

  const renderActivityPanel = (key: string) => {
    if (!showActivity[key] || !activityData[key as keyof typeof activityData]) return null;

    return (
      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h5 className="font-medium text-[#101010] mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Recent Activity
        </h5>
        <div className="space-y-3">
          {activityData[key as keyof typeof activityData].map((activity, index) => (
            <div key={index} className="flex items-start justify-between p-3 bg-white rounded border border-gray-100">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {activity.user === 'System' ? (
                    <Edit3 className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#101010]">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#101010]">{activity.amount}</p>
                {activity.previousAmount !== '$0' && (
                  <p className="text-xs text-gray-500">was {activity.previousAmount}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const monthlyData = [
    // Actuals (Jan-Jun 2025)
    { month: 'January 2025', revenue: 425000, expenses: 285000, profit: 140000, margin: 32.9, type: 'Actual' },
    { month: 'February 2025', revenue: 445000, expenses: 295000, profit: 150000, margin: 33.7, type: 'Actual' },
    { month: 'March 2025', revenue: 465000, expenses: 305000, profit: 160000, margin: 34.4, type: 'Actual' },
    { month: 'April 2025', revenue: 485000, expenses: 315000, profit: 170000, margin: 35.1, type: 'Actual' },
    { month: 'May 2025', revenue: 505000, expenses: 325000, profit: 180000, margin: 35.6, type: 'Actual' },
    { month: 'June 2025', revenue: 525000, expenses: 335000, profit: 190000, margin: 36.2, type: 'Actual' },
    // Forecasts (Jul-Dec 2025)
    { month: 'July 2025', revenue: 545000, expenses: 345000, profit: 200000, margin: 36.7, type: 'Forecast' },
    { month: 'August 2025', revenue: 565000, expenses: 355000, profit: 210000, margin: 37.2, type: 'Forecast' },
    { month: 'September 2025', revenue: 585000, expenses: 365000, profit: 220000, margin: 37.6, type: 'Forecast' },
    { month: 'October 2025', revenue: 605000, expenses: 375000, profit: 230000, margin: 38.0, type: 'Forecast' },
    { month: 'November 2025', revenue: 625000, expenses: 385000, profit: 240000, margin: 38.4, type: 'Forecast' },
    { month: 'December 2025', revenue: 645000, expenses: 395000, profit: 250000, margin: 38.8, type: 'Forecast' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#101010]">Profit & Loss Statement</h2>
        <p className="text-gray-600 mt-1">Revenue and expense breakdown</p>
      </div>

      {/* P&L Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">$6,595,000</p>
              <p className="text-sm text-[#4ADE80] mt-1">+15.3% YoY</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">$4,620,000</p>
              <p className="text-sm text-gray-600 mt-1">+8.7% YoY</p>
            </div>
            <LineChart className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">$1,975,000</p>
              <p className="text-sm text-[#4ADE80] mt-1">+28.4% YoY</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">29.9%</p>
              <p className="text-sm text-[#4ADE80] mt-1">+2.8% YoY</p>
            </div>
            <Percent className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>
      </div>

      {/* Monthly Breakdown - ALL 12 MONTHS */}
      <Card title="Monthly Breakdown - 2025 (All 12 Months)">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Expenses</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Profit</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Margin</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    row.type === 'Forecast' ? 'bg-purple-50/30' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-[#101010]">{row.month}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    row.type === 'Forecast' ? 'text-[#4ADE80]/70' : 'text-[#4ADE80]'
                  }`}>
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    row.type === 'Forecast' ? 'text-[#F87171]/70' : 'text-[#F87171]'
                  }`}>
                    ${row.expenses.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    row.type === 'Forecast' ? 'text-[#3AB7BF]/70' : 'text-[#3AB7BF]'
                  }`}>
                    ${row.profit.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{row.margin}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.type === 'Actual' 
                        ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                        : 'bg-[#3AB7BF]/20 text-[#3AB7BF]'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed P&L Statement */}
      <Card title="Profit & Loss Statement - Year to Date">
        <div className="space-y-6">
          {/* Revenue Section */}
          <div>
            <h3 className="font-semibold text-[#101010] mb-4 text-lg">Revenue</h3>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Sales</span>
                <span className="font-medium text-[#101010]">$5,076,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Revenue</span>
                <span className="font-medium text-[#101010]">$1,124,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Income</span>
                <span className="font-medium text-[#101010]">$394,500</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 text-lg">
                <div className="flex items-center">
                  <span className="text-[#101010]">Total Revenue</span>
                  {renderActivityButton('total-revenue')}
                </div>
                <span className="text-[#4ADE80]">$6,595,000</span>
              </div>
              {renderActivityPanel('total-revenue')}
            </div>
          </div>

          {/* Cost of Goods Sold */}
          <div>
            <h3 className="font-semibold text-[#101010] mb-4 text-lg">Cost of Goods Sold</h3>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Materials & Supplies</span>
                <span className="font-medium text-[#101010]">$1,690,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Direct Labor</span>
                <span className="font-medium text-[#101010]">$913,600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Manufacturing Overhead</span>
                <span className="font-medium text-[#101010]">$469,000</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <div className="flex items-center">
                  <span className="text-[#101010]">Total COGS</span>
                  {renderActivityButton('total-cogs')}
                </div>
                <span className="text-[#F87171]">($3,073,000)</span>
              </div>
              {renderActivityPanel('total-cogs')}
            </div>
          </div>

          {/* Gross Profit */}
          <div className="bg-[#4ADE80]/10 p-4 rounded-lg">
            <div className="flex justify-between font-bold text-lg">
              <div className="flex items-center">
                <span className="text-[#101010]">Gross Profit</span>
                {renderActivityButton('gross-profit')}
              </div>
              <span className="text-[#4ADE80]">$3,522,000</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Gross Margin: 53.4%</p>
            {renderActivityPanel('gross-profit')}
          </div>

          {/* Operating Expenses */}
          <div>
            <h3 className="font-semibold text-[#101010] mb-4 text-lg">Operating Expenses</h3>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Salaries & Benefits</span>
                <span className="font-medium text-[#101010]">$970,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marketing & Advertising</span>
                <span className="font-medium text-[#101010]">$313,600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rent & Utilities</span>
                <span className="font-medium text-[#101010]">$249,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Technology & Software</span>
                <span className="font-medium text-[#101010]">$178,600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professional Services</span>
                <span className="font-medium text-[#101010]">$134,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Operating Expenses</span>
                <span className="font-medium text-[#101010]">$175,400</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <div className="flex items-center">
                  <span className="text-[#101010]">Total Operating Expenses</span>
                  {renderActivityButton('total-opex')}
                </div>
                <span className="text-[#F87171]">($2,021,400)</span>
              </div>
              {renderActivityPanel('total-opex')}
            </div>
          </div>

          {/* Operating Income */}
          <div className="bg-[#3AB7BF]/10 p-4 rounded-lg">
            <div className="flex justify-between font-bold text-lg">
              <div className="flex items-center">
                <span className="text-[#101010]">Operating Income</span>
                {renderActivityButton('operating-income')}
              </div>
              <span className="text-[#3AB7BF]">$1,500,600</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Operating Margin: 22.8%</p>
            {renderActivityPanel('operating-income')}
          </div>

          {/* Other Income/Expenses */}
          <div>
            <h3 className="font-semibold text-[#101010] mb-4 text-lg">Other Income & Expenses</h3>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Income</span>
                <span className="font-medium text-[#4ADE80]">$50,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Expense</span>
                <span className="font-medium text-[#F87171]">($90,400)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Income</span>
                <span className="font-medium text-[#4ADE80]">$25,600</span>
              </div>
            </div>
          </div>

          {/* Income Before Tax */}
          <div className="bg-[#F59E0B]/10 p-4 rounded-lg">
            <div className="flex justify-between font-bold text-lg">
              <div className="flex items-center">
                <span className="text-[#101010]">Income Before Tax</span>
                {renderActivityButton('income-before-tax')}
              </div>
              <span className="text-[#F59E0B]">$1,486,600</span>
            </div>
            {renderActivityPanel('income-before-tax')}
          </div>

          {/* Tax and Net Income */}
          <div className="space-y-2 ml-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Income Tax Expense</span>
              <span className="font-medium text-[#F87171]">($511,600)</span>
            </div>
          </div>

          {/* Net Income */}
          <div className="bg-[#4ADE80]/20 p-6 rounded-lg border-2 border-[#4ADE80]/30">
            <div className="flex justify-between font-bold text-xl">
              <div className="flex items-center">
                <span className="text-[#101010]">Net Income</span>
                {renderActivityButton('net-income')}
              </div>
              <span className="text-[#4ADE80]">$975,000</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Net Profit Margin: 29.9%</p>
            {renderActivityPanel('net-income')}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfitLoss;