import React, { useState, useEffect } from 'react';
import { AlertCircle, Mail, Calendar, Clock, DollarSign, ArrowUpDown } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { cashFlowService } from '../../services/cashFlowService';
import type { OverdueItem } from '../../types/cashFlow';

interface OverdueSummaryProps {
  className?: string;
}

type SortField = 'daysOverdue' | 'amountDue' | 'name' | 'dueDate';
type SortDirection = 'asc' | 'desc';

const OverdueSummary: React.FC<OverdueSummaryProps> = ({ className = '' }) => {
  const [overdueItems, setOverdueItems] = useState<OverdueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('daysOverdue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<'all' | 'receivable' | 'payable'>('all');

  useEffect(() => {
    loadOverdueItems();
  }, []);

  const loadOverdueItems = async () => {
    try {
      setLoading(true);
      const items = await cashFlowService.getOverdueItems();
      setOverdueItems(items);
    } catch (error) {
      console.error('Error loading overdue items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSendReminder = async (item: OverdueItem) => {
    if (item.type === 'receivable') {
      try {
        await cashFlowService.sendReminder(item.id);
        alert(`Reminder sent to ${item.name}`);
        await loadOverdueItems();
      } catch (error) {
        console.error('Error sending reminder:', error);
        alert('Failed to send reminder');
      }
    }
  };

  const handleSchedulePayment = async (item: OverdueItem) => {
    if (item.type === 'payable') {
      const date = prompt('Enter payment date (YYYY-MM-DD):');
      if (date) {
        try {
          await cashFlowService.schedulePayment(item.id, date);
          alert(`Payment scheduled for ${date}`);
          await loadOverdueItems();
        } catch (error) {
          console.error('Error scheduling payment:', error);
          alert('Failed to schedule payment');
        }
      }
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredItems = overdueItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'daysOverdue':
        aValue = a.daysOverdue;
        bValue = b.daysOverdue;
        break;
      case 'amountDue':
        aValue = a.amountDue;
        bValue = b.amountDue;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'dueDate':
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalOverdue = filteredItems.reduce((sum, item) => sum + item.amountDue, 0);
  const overdueReceivables = filteredItems.filter((i) => i.type === 'receivable').length;
  const overduePayables = filteredItems.filter((i) => i.type === 'payable').length;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            Overdue Summary
          </h2>
          <p className="text-sm text-gray-500 mt-1">Items requiring immediate attention</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({overdueItems.length})
          </button>
          <button
            onClick={() => setFilterType('receivable')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'receivable'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Receivables ({overdueReceivables})
          </button>
          <button
            onClick={() => setFilterType('payable')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'payable'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payables ({overduePayables})
          </button>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Overdue Amount</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(totalOverdue)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-orange-600">Items Overdue</p>
            <p className="text-2xl font-bold text-orange-900">{filteredItems.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          Loading overdue items...
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="py-12 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No overdue items</p>
          <p className="text-sm text-gray-400 mt-1">All payments are up to date</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Name <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reference
                </th>
                <th
                  onClick={() => handleSort('dueDate')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Due Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('daysOverdue')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Days Overdue <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('amountDue')}
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.type === 'receivable'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.type === 'receivable' ? 'Receivable' : 'Payable'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.contactEmail && (
                      <div className="text-xs text-gray-500">{item.contactEmail}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.referenceNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(item.dueDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        item.daysOverdue > 30
                          ? 'bg-red-100 text-red-700'
                          : item.daysOverdue > 14
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.daysOverdue} days
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.amountDue)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.type === 'receivable' ? (
                        <Button
                          onClick={() => handleSendReminder(item)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Send Reminder
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSchedulePayment(item)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule Payment
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default OverdueSummary;
