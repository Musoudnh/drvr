import React, { useState, useRef, useEffect } from 'react';
import { PieChart, TrendingUp, DollarSign, Building, Target, Download, Save, Bell, History, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/UI/Card';

interface BalanceSheetItem {
  code: string;
  name: string;
  category: 'Current Assets' | 'Non-Current Assets' | 'Current Liabilities' | 'Non-Current Liabilities' | 'Equity';
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
  percentOfTotal: number;
}

const BalanceSheet: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [quarterDropdownOpen, setQuarterDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const quarterDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quarterDropdownRef.current && !quarterDropdownRef.current.contains(event.target as Node)) {
        setQuarterDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const balanceSheetData: BalanceSheetItem[] = [
    { code: '1100', name: 'Cash & Cash Equivalents', category: 'Current Assets', q1: 485200, q2: 512300, q3: 548900, q4: 575400, total: 2121800, percentOfTotal: 17.0 },
    { code: '1200', name: 'Accounts Receivable', category: 'Current Assets', q1: 324800, q2: 342100, q3: 358700, q4: 376200, total: 1401800, percentOfTotal: 11.3 },
    { code: '1300', name: 'Inventory', category: 'Current Assets', q1: 156300, q2: 164800, q3: 173100, q4: 181600, total: 675800, percentOfTotal: 5.4 },
    { code: '1400', name: 'Prepaid Expenses', category: 'Current Assets', q1: 42100, q2: 44400, q3: 46600, q4: 48900, total: 182000, percentOfTotal: 1.5 },
    { code: '1500', name: 'Property, Plant & Equipment', category: 'Non-Current Assets', q1: 1245600, q2: 1312800, q3: 1378200, q4: 1445900, total: 5382500, percentOfTotal: 43.2 },
    { code: '1600', name: 'Intangible Assets', category: 'Non-Current Assets', q1: 425800, q2: 448900, q3: 471300, q4: 494200, total: 1840200, percentOfTotal: 14.8 },
    { code: '1700', name: 'Investments', category: 'Non-Current Assets', q1: 167700, q2: 176800, q3: 185700, q4: 194900, total: 725100, percentOfTotal: 5.8 },
    { code: '2100', name: 'Accounts Payable', category: 'Current Liabilities', q1: -245600, q2: -258700, q3: -271600, q4: -284900, total: -1060800, percentOfTotal: -8.5 },
    { code: '2200', name: 'Short-term Debt', category: 'Current Liabilities', q1: -125400, q2: -132200, q3: -138800, q4: -145600, total: -542000, percentOfTotal: -4.4 },
    { code: '2300', name: 'Accrued Expenses', category: 'Current Liabilities', q1: -89200, q2: -94000, q3: -98700, q4: -103500, total: -385400, percentOfTotal: -3.1 },
    { code: '2400', name: 'Long-term Debt', category: 'Non-Current Liabilities', q1: -685400, q2: -722500, q3: -758900, q4: -796200, total: -2963000, percentOfTotal: -23.8 },
    { code: '2500', name: 'Deferred Tax', category: 'Non-Current Liabilities', q1: -100200, q2: -105600, q3: -110900, q4: -116400, total: -433100, percentOfTotal: -3.5 },
    { code: '3100', name: 'Share Capital', category: 'Equity', q1: 500000, q2: 500000, q3: 500000, q4: 500000, total: 2000000, percentOfTotal: 16.1 },
    { code: '3200', name: 'Retained Earnings', category: 'Equity', q1: 1101700, q2: 1161800, q3: 1220400, q4: 1280700, total: 4764600, percentOfTotal: 38.3 },
  ];

  const getCategoryTotal = (category: string, quarter: 'q1' | 'q2' | 'q3' | 'q4' | 'total'): number => {
    return balanceSheetData
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item[quarter], 0);
  };

  const formatCurrency = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(2)}M`;
    }
    return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`;
  };

  const getQuarterData = (quarter: string): 'q1' | 'q2' | 'q3' | 'q4' => {
    const quarterMap: { [key: string]: 'q1' | 'q2' | 'q3' | 'q4' } = {
      'Q1': 'q1',
      'Q2': 'q2',
      'Q3': 'q3',
      'Q4': 'q4'
    };
    return quarterMap[quarter];
  };

  const currentQuarter = getQuarterData(selectedQuarter);
  const totalAssets = getCategoryTotal('Current Assets', currentQuarter) + getCategoryTotal('Non-Current Assets', currentQuarter);
  const totalLiabilities = getCategoryTotal('Current Liabilities', currentQuarter) + getCategoryTotal('Non-Current Liabilities', currentQuarter);
  const totalEquity = getCategoryTotal('Equity', currentQuarter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Left Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/forecasting')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/forecasting'
                ? 'bg-[#7B68EE] text-white'
                : 'bg-white text-[#7B68EE]'
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            Forecasting
          </button>
          <button
            onClick={() => navigate('/reports/balance-sheet')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/reports/balance-sheet'
                ? 'bg-[#7B68EE] text-white'
                : 'bg-white text-[#7B68EE]'
            }`}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Balance Sheet
          </button>
          <button
            onClick={() => navigate('/reports/cash-flow')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/reports/cash-flow'
                ? 'bg-[#7B68EE] text-white'
                : 'bg-white text-[#7B68EE]'
            }`}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Cash Flow
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Forecast
          </button>
          <button
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </button>
          <button
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <History className="w-4 h-4 mr-2" />
            Applied Scenarios
          </button>
          <button
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <History className="w-4 h-4 mr-2" />
            Version History
          </button>
          <button
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Time Period Selection Controls */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative" ref={quarterDropdownRef}>
              <button
                onClick={() => setQuarterDropdownOpen(!quarterDropdownOpen)}
                className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
              >
                <span>{selectedQuarter}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {quarterDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px]">
                  <div className="flex flex-col gap-1">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                      <button
                        key={quarter}
                        onClick={() => {
                          setSelectedQuarter(quarter);
                          setQuarterDropdownOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                          selectedQuarter === quarter
                            ? 'bg-[#7B68EE] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {quarter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={yearDropdownRef}>
              <button
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
              >
                <span>{selectedYear}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {yearDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px]">
                  <div className="flex flex-col gap-1">
                    {[2023, 2024, 2025, 2026, 2027].map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setYearDropdownOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                          selectedYear === year
                            ? 'bg-[#7B68EE] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* Balance Sheet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">{formatCurrency(totalAssets)}</p>
              <p className="text-sm text-[#4ADE80] mt-1">+8.3% from last quarter</p>
            </div>
            <Building className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">{formatCurrency(Math.abs(totalLiabilities))}</p>
              <p className="text-sm text-gray-600 mt-1">+2.1% from last quarter</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shareholders' Equity</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{formatCurrency(totalEquity)}</p>
              <p className="text-sm text-[#4ADE80] mt-1">+12.7% from last quarter</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>
      </div>

      {/* Detailed Balance Sheet Table */}
      <Card title={`Balance Sheet - ${selectedQuarter} ${selectedYear}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Account Name</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Q1</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Q2</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Q3</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Q4</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Current Assets */}
              <tr className="bg-gray-50">
                <td colSpan={8} className="py-2 px-4 font-bold text-[#101010]">ASSETS</td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={8} className="py-2 px-4 font-semibold text-[#101010]">Current Assets</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Current Assets').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q1)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q2)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q3)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q4)}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Current Assets</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Current Assets', 'q1'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Current Assets', 'q2'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Current Assets', 'q3'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Current Assets', 'q4'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Current Assets', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">35.2%</td>
              </tr>

              {/* Non-Current Assets */}
              <tr className="bg-gray-50">
                <td colSpan={8} className="py-2 px-4 font-semibold text-[#101010]">Non-Current Assets</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Non-Current Assets').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q1)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q2)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q3)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q4)}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Non-Current Assets</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Non-Current Assets', 'q1'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Non-Current Assets', 'q2'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Non-Current Assets', 'q3'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Non-Current Assets', 'q4'))}</td>
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Non-Current Assets', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">64.8%</td>
              </tr>
              <tr className="bg-[#4ADE80]/20 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">TOTAL ASSETS</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Assets', 'q1') + getCategoryTotal('Non-Current Assets', 'q1'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Assets', 'q2') + getCategoryTotal('Non-Current Assets', 'q2'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Assets', 'q3') + getCategoryTotal('Non-Current Assets', 'q3'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Assets', 'q4') + getCategoryTotal('Non-Current Assets', 'q4'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Assets', 'total') + getCategoryTotal('Non-Current Assets', 'total'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">100%</td>
              </tr>

              {/* Liabilities */}
              <tr className="bg-gray-50">
                <td colSpan={8} className="py-2 px-4 font-bold text-[#101010]">LIABILITIES</td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={8} className="py-2 px-4 font-semibold text-[#101010]">Current Liabilities</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Current Liabilities').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q1)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q2)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q3)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q4)}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Current Liabilities</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q1'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q2'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q3'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q4'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Current Liabilities', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">-16.0%</td>
              </tr>

              {/* Non-Current Liabilities */}
              <tr className="bg-gray-50">
                <td colSpan={8} className="py-2 px-4 font-semibold text-[#101010]">Non-Current Liabilities</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Non-Current Liabilities').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q1)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q2)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q3)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q4)}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Non-Current Liabilities</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Non-Current Liabilities', 'q1'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Non-Current Liabilities', 'q2'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Non-Current Liabilities', 'q3'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Non-Current Liabilities', 'q4'))}</td>
                <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Non-Current Liabilities', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">-27.3%</td>
              </tr>
              <tr className="bg-[#F87171]/20 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">TOTAL LIABILITIES</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q1') + getCategoryTotal('Non-Current Liabilities', 'q1'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q2') + getCategoryTotal('Non-Current Liabilities', 'q2'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q3') + getCategoryTotal('Non-Current Liabilities', 'q3'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Liabilities', 'q4') + getCategoryTotal('Non-Current Liabilities', 'q4'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Liabilities', 'total') + getCategoryTotal('Non-Current Liabilities', 'total'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">-43.3%</td>
              </tr>

              {/* Equity */}
              <tr className="bg-gray-50">
                <td colSpan={8} className="py-2 px-4 font-bold text-[#101010]">EQUITY</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Equity').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q1)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q2)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q3)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(item.q4)}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-[#3AB7BF]/20 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">TOTAL EQUITY</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Equity', 'q1'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Equity', 'q2'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Equity', 'q3'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Equity', 'q4'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Equity', 'total'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">54.4%</td>
              </tr>

              {/* Balance Check */}
              <tr className="bg-gray-200 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">LIABILITIES + EQUITY</td>
                <td className="py-3 px-4 text-right text-[#101010]">
                  {formatCurrency(getCategoryTotal('Current Liabilities', 'q1') + getCategoryTotal('Non-Current Liabilities', 'q1') + getCategoryTotal('Equity', 'q1'))}
                </td>
                <td className="py-3 px-4 text-right text-[#101010]">
                  {formatCurrency(getCategoryTotal('Current Liabilities', 'q2') + getCategoryTotal('Non-Current Liabilities', 'q2') + getCategoryTotal('Equity', 'q2'))}
                </td>
                <td className="py-3 px-4 text-right text-[#101010]">
                  {formatCurrency(getCategoryTotal('Current Liabilities', 'q3') + getCategoryTotal('Non-Current Liabilities', 'q3') + getCategoryTotal('Equity', 'q3'))}
                </td>
                <td className="py-3 px-4 text-right text-[#101010]">
                  {formatCurrency(getCategoryTotal('Current Liabilities', 'q4') + getCategoryTotal('Non-Current Liabilities', 'q4') + getCategoryTotal('Equity', 'q4'))}
                </td>
                <td className="py-3 px-4 text-right text-[#101010]">
                  {formatCurrency(getCategoryTotal('Current Liabilities', 'total') + getCategoryTotal('Non-Current Liabilities', 'total') + getCategoryTotal('Equity', 'total'))}
                </td>
                <td className="py-3 px-4 text-right text-[#101010]">11.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

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
