import React, { useState } from 'react';
import MonthsView from '../../components/Forecasting/MonthsView';
import { Save, Download, RefreshCw, Filter, Calendar, ChevronDown } from 'lucide-react';
import Button from '../../components/UI/Button';

const MonthsViewDemo: React.FC = () => {
  const [revenueMonths, setRevenueMonths] = useState([
    { month: 'Jan', value: 125000, actualValue: 128000, percentage: 5.2, isActual: true, isSelected: false },
    { month: 'Feb', value: 132000, actualValue: 130000, percentage: 5.6, isActual: true, isSelected: false },
    { month: 'Mar', value: 145000, actualValue: 152000, percentage: 9.8, isActual: true, isSelected: false },
    { month: 'Apr', value: 138000, actualValue: 135000, percentage: -4.8, isActual: true, isSelected: false },
    { month: 'May', value: 150000, actualValue: 148000, percentage: 8.7, isActual: false, isSelected: false },
    { month: 'Jun', value: 165000, actualValue: 170000, percentage: 10.0, isActual: false, isSelected: false },
    { month: 'Jul', value: 172000, percentage: 4.2, isActual: false, isSelected: false },
    { month: 'Aug', value: 168000, percentage: -2.3, isActual: false, isSelected: false },
    { month: 'Sep', value: 175000, percentage: 4.2, isActual: false, isSelected: false },
    { month: 'Oct', value: 180000, percentage: 2.9, isActual: false, isSelected: false },
    { month: 'Nov', value: 185000, percentage: 2.8, isActual: false, isSelected: false },
    { month: 'Dec', value: 190000, percentage: 2.7, isActual: false, isSelected: false },
  ]);

  const [expenseMonths, setExpenseMonths] = useState([
    { month: 'Jan', value: 85000, actualValue: 87000, percentage: 3.2, isActual: true, isSelected: false },
    { month: 'Feb', value: 88000, actualValue: 86500, percentage: 3.5, isActual: true, isSelected: false },
    { month: 'Mar', value: 92000, actualValue: 94000, percentage: 4.5, isActual: true, isSelected: false },
    { month: 'Apr', value: 90000, actualValue: 89000, percentage: -2.2, isActual: true, isSelected: false },
    { month: 'May', value: 95000, actualValue: 96500, percentage: 5.6, isActual: false, isSelected: false },
    { month: 'Jun', value: 98000, actualValue: 99200, percentage: 3.2, isActual: false, isSelected: false },
    { month: 'Jul', value: 102000, percentage: 4.1, isActual: false, isSelected: false },
    { month: 'Aug', value: 105000, percentage: 2.9, isActual: false, isSelected: false },
    { month: 'Sep', value: 108000, percentage: 2.9, isActual: false, isSelected: false },
    { month: 'Oct', value: 110000, percentage: 1.9, isActual: false, isSelected: false },
    { month: 'Nov', value: 112000, percentage: 1.8, isActual: false, isSelected: false },
    { month: 'Dec', value: 115000, percentage: 2.7, isActual: false, isSelected: false },
  ]);

  const [selectedRevenueMonths, setSelectedRevenueMonths] = useState<string[]>([]);
  const [selectedExpenseMonths, setSelectedExpenseMonths] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedView, setSelectedView] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleRevenueUpdate = (updatedMonths: typeof revenueMonths) => {
    setRevenueMonths(updatedMonths);
  };

  const handleExpenseUpdate = (updatedMonths: typeof expenseMonths) => {
    setExpenseMonths(updatedMonths);
  };

  const calculateTotals = () => {
    const revenueTotal = revenueMonths.reduce((sum, m) => sum + m.value, 0);
    const expenseTotal = expenseMonths.reduce((sum, m) => sum + m.value, 0);
    const netIncome = revenueTotal - expenseTotal;

    return { revenueTotal, expenseTotal, netIncome };
  };

  const totals = calculateTotals();

  const viewOptions = [
    'All Data',
    'Actuals Only',
    'Forecast Only',
    'Q1 (Jan-Mar)',
    'Q2 (Apr-Jun)',
    'Q3 (Jul-Sep)',
    'Q4 (Oct-Dec)',
    'H1 (Jan-Jun)',
    'H2 (Jul-Dec)'
  ];

  const clearFilter = () => {
    setSelectedView('all');
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Forecasting - Months View
          </h1>
          <p className="text-gray-600">
            Interactive month-by-month forecast with actual vs. projected data. Select and edit non-actual months.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">2025 Financial Forecast</h2>
            <div className="flex gap-3 relative">
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  {selectedView !== 'all' && (
                    <span className="ml-2 px-1.5 py-0.5 bg-[#3AB7BF] text-white text-xs rounded-full">
                      1
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {showFilter && (
                  <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-[#101010]">Filter View</h4>
                        {selectedView !== 'all' && (
                          <button
                            onClick={clearFilter}
                            className="text-xs text-[#3AB7BF] hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {viewOptions.map(option => (
                        <label key={option} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="radio"
                            checked={selectedView === option.toLowerCase().replace(/\s+/g, '-')}
                            onChange={() => {
                              setSelectedView(option.toLowerCase().replace(/\s+/g, '-'));
                              setShowFilter(false);
                            }}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 focus:ring-[#3AB7BF] mr-3"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                  {(dateRange.startDate || dateRange.endDate) && (
                    <span className="ml-2 px-1.5 py-0.5 bg-[#3AB7BF] text-white text-xs rounded-full">
                      •
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {showDatePicker && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-[#101010]">Select Date Range</h4>
                        {(dateRange.startDate || dateRange.endDate) && (
                          <button
                            onClick={clearDateFilter}
                            className="text-xs text-[#3AB7BF] hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setShowDatePicker(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => setShowDatePicker(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleExport}
                className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-blue-900">
                ${totals.revenueTotal.toLocaleString()}
              </div>
            </div>
            <div className="bg-white border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-600 font-medium mb-1">Total Expenses</div>
              <div className="text-2xl font-bold text-red-900">
                ${totals.expenseTotal.toLocaleString()}
              </div>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium mb-1">Net Income</div>
              <div className="text-2xl font-bold text-green-900">
                ${totals.netIncome.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-800">Revenue</h3>
              </div>
              <MonthsView
                months={revenueMonths}
                onMonthsUpdate={handleRevenueUpdate}
                onSelectionChange={setSelectedRevenueMonths}
                rowLabel="Product Sales (4000)"
                format="currency"
              />
              {selectedRevenueMonths.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Bulk Actions Available for Selected Months:
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      Apply Growth Rate
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 text-sm rounded hover:bg-blue-50 transition-colors">
                      Set Fixed Amount
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 text-sm rounded hover:bg-blue-50 transition-colors">
                      Adjust by %
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-800">Operating Expenses</h3>
              </div>
              <MonthsView
                months={expenseMonths}
                onMonthsUpdate={handleExpenseUpdate}
                onSelectionChange={setSelectedExpenseMonths}
                rowLabel="Payroll & Benefits (6000)"
                format="currency"
              />
              {selectedExpenseMonths.length > 0 && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-900 mb-2">
                    Bulk Actions Available for Selected Months:
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors">
                      Apply Growth Rate
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-orange-300 text-orange-700 text-sm rounded hover:bg-orange-50 transition-colors">
                      Set Fixed Amount
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-orange-300 text-orange-700 text-sm rounded hover:bg-orange-50 transition-colors">
                      Adjust by %
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Guide</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-700">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Actual vs Forecast</h4>
                  <p className="text-sm text-gray-600">
                    Months marked with a lock icon contain actual historical data and cannot be edited.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-700">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Select Forecast Months</h4>
                  <p className="text-sm text-gray-600">
                    Click the checkbox on any forecast month to select it for bulk editing operations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-green-700">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Direct Cell Editing</h4>
                  <p className="text-sm text-gray-600">
                    Click on any value or percentage in forecast months to edit directly. Press Enter to save or Escape to cancel.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-yellow-700">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Two-Row Format</h4>
                  <p className="text-sm text-gray-600">
                    Each month displays the actual value on top and the percentage change below for easy comparison.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-purple-700">5</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Visual Indicators</h4>
                  <p className="text-sm text-gray-600">
                    Green percentages indicate growth, red indicates decline. Selected months are highlighted in blue.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-red-700">6</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Bulk Operations</h4>
                  <p className="text-sm text-gray-600">
                    Select multiple forecast months to apply growth rates, adjustments, or fixed amounts across them all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthsViewDemo;
