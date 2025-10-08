import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, BarChart3, Table as TableIcon, TrendingUp, TrendingDown, DollarSign, AlertCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AccountsReceivable {
  id: string;
  customer_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount_due: number;
  status: string;
}

interface AccountsPayable {
  id: string;
  vendor_name: string;
  bill_number: string;
  bill_date: string;
  due_date: string;
  amount_due: number;
  status: string;
}

interface AgingSummary {
  current: number;
  days30to60: number;
  days60to90: number;
  days90plus: number;
}

const CashFlowManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [receivables, setReceivables] = useState<AccountsReceivable[]>([]);
  const [payables, setPayables] = useState<AccountsPayable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedMonth) {
      const today = new Date();
      setSelectedMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
    }
  }, [selectedMonth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setMonthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [arResponse, apResponse] = await Promise.all([
        supabase.from('accounts_receivable').select('*').eq('user_id', user.id).order('due_date', { ascending: true }),
        supabase.from('accounts_payable').select('*').eq('user_id', user.id).order('due_date', { ascending: true })
      ]);

      if (arResponse.data) setReceivables(arResponse.data);
      if (apResponse.data) setPayables(apResponse.data);
    } catch (error) {
      console.error('Error loading cash flow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysOutstanding = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getReceivableRowColor = (daysOutstanding: number): string => {
    if (daysOutstanding < 0) return '#d4edda';
    if (daysOutstanding <= 30) return '#fff3cd';
    if (daysOutstanding <= 60) return '#ffeaa7';
    return '#f8d7da';
  };

  const getPayableRowColor = (daysUntilDue: number): string => {
    if (daysUntilDue > 30) return '#cce5ff';
    if (daysUntilDue > 0) return '#e6ccff';
    if (daysUntilDue >= -30) return '#ffeaa7';
    return '#f8d7da';
  };

  const calculateAgingSummary = (items: AccountsReceivable[], isReceivable: boolean): AgingSummary => {
    const summary: AgingSummary = {
      current: 0,
      days30to60: 0,
      days60to90: 0,
      days90plus: 0
    };

    items.forEach(item => {
      const days = isReceivable ? calculateDaysOutstanding(item.due_date) : -calculateDaysUntilDue(item.due_date);

      if (days < 30) {
        summary.current += item.amount_due;
      } else if (days < 60) {
        summary.days30to60 += item.amount_due;
      } else if (days < 90) {
        summary.days60to90 += item.amount_due;
      } else {
        summary.days90plus += item.amount_due;
      }
    });

    return summary;
  };

  const generateAIRecommendation = (): string => {
    const next30DaysReceivables = receivables
      .filter(r => {
        const daysOut = calculateDaysOutstanding(r.due_date);
        return daysOut <= 30 && daysOut >= -30;
      })
      .reduce((sum, r) => sum + r.amount_due, 0);

    const next30DaysPayables = payables
      .filter(p => {
        const daysUntil = calculateDaysUntilDue(p.due_date);
        return daysUntil <= 30 && daysUntil >= 0;
      })
      .reduce((sum, p) => sum + p.amount_due, 0);

    const urgentPayables = payables
      .filter(p => calculateDaysUntilDue(p.due_date) <= 7 && calculateDaysUntilDue(p.due_date) >= 0)
      .sort((a, b) => calculateDaysUntilDue(a.due_date) - calculateDaysUntilDue(b.due_date));

    const deferablePayables = payables
      .filter(p => calculateDaysUntilDue(p.due_date) > 15)
      .sort((a, b) => calculateDaysUntilDue(b.due_date) - calculateDaysUntilDue(a.due_date));

    const cashPosition = next30DaysReceivables > next30DaysPayables ? 'Cash Positive' : 'Cash Strain';

    let recommendation = `Your cash position is ${cashPosition}. You have $${next30DaysReceivables.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} expected in the next 30 days and $${next30DaysPayables.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in upcoming bills. `;

    if (urgentPayables.length > 0) {
      const urgent = urgentPayables[0];
      const daysUntil = calculateDaysUntilDue(urgent.due_date);
      recommendation += `Focus on paying ${urgent.vendor_name} ($${urgent.amount_due.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} due in ${daysUntil} days). `;
    }

    if (deferablePayables.length > 0 && cashPosition === 'Cash Strain') {
      const deferable = deferablePayables[0];
      const daysUntil = calculateDaysUntilDue(deferable.due_date);
      recommendation += `Consider delaying ${deferable.vendor_name} ($${deferable.amount_due.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} due in ${daysUntil} days) if possible.`;
    }

    return recommendation;
  };

  const prepareChartData = () => {
    if (!selectedMonth) return [];

    const [year, month] = selectedMonth.split('-').map(Number);
    const weeklyData: { [key: string]: { week: string; inflows: number; outflows: number } } = {};

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const weeksInMonth = Math.ceil((monthEnd.getDate() - monthStart.getDate() + 1) / 7);

    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(year, month - 1, 1 + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      if (weekEnd > monthEnd) weekEnd.setTime(monthEnd.getTime());

      const weekKey = `Week ${i + 1}`;
      weeklyData[weekKey] = { week: weekKey, inflows: 0, outflows: 0 };

      receivables.forEach(r => {
        const dueDate = new Date(r.due_date);
        if (dueDate >= weekStart && dueDate <= weekEnd) {
          weeklyData[weekKey].inflows += r.amount_due;
        }
      });

      payables.forEach(p => {
        const dueDate = new Date(p.due_date);
        if (dueDate >= weekStart && dueDate <= weekEnd) {
          weeklyData[weekKey].outflows += p.amount_due;
        }
      });
    }

    return Object.values(weeklyData);
  };

  const getAvailableMonths = () => {
    const months: string[] = [];
    const allDates = [
      ...receivables.map(r => r.due_date),
      ...payables.map(p => p.due_date)
    ];

    const uniqueMonths = new Set<string>();
    allDates.forEach(dateStr => {
      const date = new Date(dateStr);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      uniqueMonths.add(monthKey);
    });

    const sortedMonths = Array.from(uniqueMonths).sort();

    if (sortedMonths.length === 0) {
      const today = new Date();
      for (let i = -2; i <= 3; i++) {
        const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
        months.push(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`);
      }
    } else {
      return sortedMonths;
    }

    return months;
  };

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const receivablesAgingSummary = calculateAgingSummary(receivables, true);
  const payablesAgingSummary = calculateAgingSummary(payables as any, false);
  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <TableIcon className="w-4 h-4 mr-2" />
                Table
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'chart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Chart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'table' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <div className="border-b border-gray-200 p-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Accounts Receivable
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">Money owed to you by customers</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">Current</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(receivablesAgingSummary.current)}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">30-60 Days</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(receivablesAgingSummary.days30to60)}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">60-90 Days</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(receivablesAgingSummary.days60to90)}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">90+ Days</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(receivablesAgingSummary.days90plus)}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Days Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivables.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No receivables found.
                        </td>
                      </tr>
                    ) : (
                      receivables.map(item => {
                        const daysOut = calculateDaysOutstanding(item.due_date);
                        return (
                          <tr
                            key={item.id}
                            style={{ backgroundColor: getReceivableRowColor(daysOut) }}
                            className="border-t border-gray-200 hover:opacity-80 transition-opacity"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900">{item.customer_name}</td>
                            <td className="py-3 px-4 text-gray-700">{item.invoice_number}</td>
                            <td className="py-3 px-4 text-gray-700">{formatDate(item.invoice_date)}</td>
                            <td className="py-3 px-4 text-gray-700">{formatDate(item.due_date)}</td>
                            <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(item.amount_due)}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center px-2 py-1 bg-white bg-opacity-60 rounded text-xs font-medium">
                                {daysOut > 0 ? `+${daysOut}` : daysOut}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <div className="border-b border-gray-200 p-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                    Accounts Payable
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">Money you owe to vendors</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">Current</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(payablesAgingSummary.current)}</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">30-60 Days</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(payablesAgingSummary.days30to60)}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">60-90 Days</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(payablesAgingSummary.days60to90)}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">90+ Days</div>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(payablesAgingSummary.days90plus)}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Vendor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Bill #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Bill Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Days Until</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payables.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No payables found.
                        </td>
                      </tr>
                    ) : (
                      payables.map(item => {
                        const daysUntil = calculateDaysUntilDue(item.due_date);
                        return (
                          <tr
                            key={item.id}
                            style={{ backgroundColor: getPayableRowColor(daysUntil) }}
                            className="border-t border-gray-200 hover:opacity-80 transition-opacity"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900">{item.vendor_name}</td>
                            <td className="py-3 px-4 text-gray-700">{item.bill_number}</td>
                            <td className="py-3 px-4 text-gray-700">{formatDate(item.bill_date)}</td>
                            <td className="py-3 px-4 text-gray-700">{formatDate(item.due_date)}</td>
                            <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(item.amount_due)}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center px-2 py-1 bg-white bg-opacity-60 rounded text-xs font-medium">
                                {daysUntil}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Cash Flow Timeline</h2>
                <p className="text-sm text-gray-600 mt-1">Expected inflows (green) and outflows (red) by week</p>
              </div>
              <div className="relative" ref={monthDropdownRef}>
                <button
                  onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                  className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
                >
                  <span>{formatMonthLabel(selectedMonth)}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {monthDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[180px]">
                    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                      {getAvailableMonths().map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            setSelectedMonth(month);
                            setMonthDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                            selectedMonth === month
                              ? 'bg-[#7B68EE] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {formatMonthLabel(month)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="inflows" fill="#10b981" name="Expected Inflows" />
                <Bar dataKey="outflows" fill="#ef4444" name="Expected Outflows" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Payment Recommendation</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {receivables.length === 0 && payables.length === 0
                  ? 'No receivables or payables found. Import data to get intelligent payment recommendations based on your cash flow position.'
                  : generateAIRecommendation()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowManager;
