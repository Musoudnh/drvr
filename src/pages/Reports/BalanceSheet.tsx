import React from 'react';
import { PieChart, TrendingUp, DollarSign, Building } from 'lucide-react';
import Card from '../../components/UI/Card';

const BalanceSheet: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#101010]">Balance Sheet</h2>
        <p className="text-gray-600 mt-1">Assets, liabilities, and equity overview</p>
      </div>

      {/* Balance Sheet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">$2,847,500</p>
              <p className="text-sm text-[#4ADE80] mt-1">+8.3% from last quarter</p>
            </div>
            <Building className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">$1,245,800</p>
              <p className="text-sm text-gray-600 mt-1">+2.1% from last quarter</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shareholders' Equity</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">$1,601,700</p>
              <p className="text-sm text-[#4ADE80] mt-1">+12.7% from last quarter</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>
      </div>

      {/* Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Inflow Sources">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h4 className="font-semibold text-[#101010] mb-3">Current Assets</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash & Cash Equivalents</span>
                  <span className="font-medium text-[#101010]">$485,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accounts Receivable</span>
                  <span className="font-medium text-[#101010]">$324,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inventory</span>
                  <span className="font-medium text-[#101010]">$156,300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prepaid Expenses</span>
                  <span className="font-medium text-[#101010]">$42,100</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-[#101010]">Total Current Assets</span>
                  <span className="text-[#4ADE80]">$1,008,400</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#101010] mb-3">Non-Current Assets</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property, Plant & Equipment</span>
                  <span className="font-medium text-[#101010]">$1,245,600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Intangible Assets</span>
                  <span className="font-medium text-[#101010]">$425,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investments</span>
                  <span className="font-medium text-[#101010]">$167,700</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-[#101010]">Total Non-Current Assets</span>
                  <span className="text-[#4ADE80]">$1,839,100</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Liabilities & Equity">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h4 className="font-semibold text-[#101010] mb-3">Current Liabilities</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accounts Payable</span>
                  <span className="font-medium text-[#101010]">$245,600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Short-term Debt</span>
                  <span className="font-medium text-[#101010]">$125,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accrued Expenses</span>
                  <span className="font-medium text-[#101010]">$89,200</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-[#101010]">Total Current Liabilities</span>
                  <span className="text-[#F87171]">$460,200</span>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <h4 className="font-semibold text-[#101010] mb-3">Non-Current Liabilities</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Long-term Debt</span>
                  <span className="font-medium text-[#101010]">$685,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deferred Tax</span>
                  <span className="font-medium text-[#101010]">$100,200</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-[#101010]">Total Non-Current Liabilities</span>
                  <span className="text-[#F87171]">$785,600</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#101010] mb-3">Shareholders' Equity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Share Capital</span>
                  <span className="font-medium text-[#101010]">$500,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retained Earnings</span>
                  <span className="font-medium text-[#101010]">$1,101,700</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-[#101010]">Total Equity</span>
                  <span className="text-[#3AB7BF]">$1,601,700</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Ratios */}
      <Card title="Key Financial Ratios">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <p className="text-2xl font-bold text-[#4ADE80]">2.19</p>
            <p className="text-sm text-gray-600 mt-1">Current Ratio</p>
            <p className="text-xs text-gray-500">Industry avg: 1.85</p>
          </div>
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <p className="text-2xl font-bold text-[#3AB7BF]">0.44</p>
            <p className="text-sm text-gray-600 mt-1">Debt-to-Equity</p>
            <p className="text-xs text-gray-500">Industry avg: 0.65</p>
          </div>
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <p className="text-2xl font-bold text-[#F59E0B]">56.2%</p>
            <p className="text-sm text-gray-600 mt-1">Equity Ratio</p>
            <p className="text-xs text-gray-500">Industry avg: 48.3%</p>
          </div>
          <div className="text-center p-4 bg-[#8B5CF6]/10 rounded-lg">
            <p className="text-2xl font-bold text-[#8B5CF6]">15.8%</p>
            <p className="text-sm text-gray-600 mt-1">ROE</p>
            <p className="text-xs text-gray-500">Industry avg: 12.4%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BalanceSheet;