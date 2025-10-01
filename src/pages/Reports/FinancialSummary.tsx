import React from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const FinancialSummary: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#101010]">Financial Summary</h2>
          <p className="text-gray-600 mt-1">Overview of financial data for the current period</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-[#4ADE80]">$1,247,850</p>
            <p className="text-sm text-gray-500 mt-1">+15.3% from last quarter</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-[#F87171]">$847,200</p>
            <p className="text-sm text-gray-500 mt-1">+8.7% from last quarter</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Net Profit</p>
            <p className="text-3xl font-bold text-[#3AB7BF]">$400,650</p>
            <p className="text-sm text-gray-500 mt-1">+28.4% from last quarter</p>
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card title="Monthly Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Expenses</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Profit</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Margin</th>
              </tr>
            </thead>
            <tbody>
              {[
                { month: 'January 2025', revenue: 425000, expenses: 285000, profit: 140000, margin: 32.9 },
                { month: 'December 2024', revenue: 398000, expenses: 272000, profit: 126000, margin: 31.7 },
                { month: 'November 2024', revenue: 367000, expenses: 251000, profit: 116000, margin: 31.6 },
                { month: 'October 2024', revenue: 342000, expenses: 239000, profit: 103000, margin: 30.1 }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-[#101010]">{row.month}</td>
                  <td className="py-3 px-4 text-right text-[#4ADE80] font-medium">${row.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[#F87171] font-medium">${row.expenses.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[#3AB7BF] font-medium">${row.profit.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">{row.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FinancialSummary;