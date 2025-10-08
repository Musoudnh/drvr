import React, { useState, useEffect } from 'react';
import { Users, Building2, TrendingUp, Award, ChevronRight } from 'lucide-react';
import Card from '../UI/Card';
import { cashFlowService } from '../../services/cashFlowService';
import type { TopCustomerVendor } from '../../types/cashFlow';

interface TopCustomersVendorsProps {
  className?: string;
}

const TopCustomersVendors: React.FC<TopCustomersVendorsProps> = ({ className = '' }) => {
  const [topCustomers, setTopCustomers] = useState<TopCustomerVendor[]>([]);
  const [topVendors, setTopVendors] = useState<TopCustomerVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'customers' | 'vendors'>('customers');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customers, vendors] = await Promise.all([
        cashFlowService.getTopCustomers(10),
        cashFlowService.getTopVendors(10),
      ]);
      setTopCustomers(customers);
      setTopVendors(vendors);
    } catch (error) {
      console.error('Error loading top customers/vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRankBadge = (index: number) => {
    const colors = [
      'bg-yellow-100 text-yellow-700 border-yellow-300',
      'bg-gray-200 text-gray-700 border-gray-400',
      'bg-orange-100 text-orange-700 border-orange-300',
    ];
    return colors[index] || 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const activeData = activeTab === 'customers' ? topCustomers : topVendors;
  const totalAmount = activeData.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Top 10 {activeTab === 'customers' ? 'Customers' : 'Vendors'}</h2>
          <p className="text-sm text-gray-500 mt-1">Ranked by total amount</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Customers
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'vendors'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Vendors
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          Loading data...
        </div>
      ) : activeData.length === 0 ? (
        <div className="py-12 text-center">
          {activeTab === 'customers' ? (
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          ) : (
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          )}
          <p className="text-gray-500">No {activeTab} data available</p>
          <p className="text-sm text-gray-400 mt-1">
            Add {activeTab === 'customers' ? 'receivables' : 'payables'} to see rankings
          </p>
        </div>
      ) : (
        <>
          <div className={`${activeTab === 'customers' ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-4 mb-6 border ${activeTab === 'customers' ? 'border-green-200' : 'border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${activeTab === 'customers' ? 'text-green-600' : 'text-red-600'}`}>
                  Total from Top 10
                </p>
                <p className={`text-2xl font-bold ${activeTab === 'customers' ? 'text-green-900' : 'text-red-900'} mt-1`}>
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${activeTab === 'customers' ? 'text-green-600' : 'text-red-600'}`}>
                  Total Transactions
                </p>
                <p className={`text-2xl font-bold ${activeTab === 'customers' ? 'text-green-900' : 'text-red-900'}`}>
                  {activeData.reduce((sum, item) => sum + item.transactionCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {activeData.map((item, index) => {
              const percentage = (item.totalAmount / totalAmount) * 100;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getRankBadge(index)}`}>
                      {index < 3 ? <Award className="w-5 h-5" /> : index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.transactionCount} transaction{item.transactionCount !== 1 ? 's' : ''} • Avg: {formatCurrency(item.averageAmount)}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(item.totalAmount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {percentage.toFixed(1)}% of total
                          </p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${activeTab === 'customers' ? 'bg-green-500' : 'bg-red-500'} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Highest Transaction</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(Math.max(...activeData.map((d) => d.totalAmount)))}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Average Transaction</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(totalAmount / activeData.reduce((sum, item) => sum + item.transactionCount, 0))}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Top 3 Share</p>
              <p className="text-lg font-bold text-gray-900">
                {((activeData.slice(0, 3).reduce((sum, item) => sum + item.totalAmount, 0) / totalAmount) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default TopCustomersVendors;
