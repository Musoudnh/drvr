import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Target, Download, Save, Bell, History, ChevronDown } from 'lucide-react';
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
  jan?: number;
  feb?: number;
  mar?: number;
  apr?: number;
  may?: number;
  jun?: number;
  jul?: number;
  aug?: number;
  sep?: number;
  oct?: number;
  nov?: number;
  dec?: number;
}

const BalanceSheet: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dateViewMode, setDateViewMode] = useState<'quarters' | 'years'>('quarters');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [quarterDropdownOpen, setQuarterDropdownOpen] = useState(false);
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
    {
      code: '1100', name: 'Cash & Cash Equivalents', category: 'Current Assets',
      q1: 485200, q2: 512300, q3: 548900, q4: 575400, total: 2121800, percentOfTotal: 17.0,
      jan: 450000, feb: 460000, mar: 485200, apr: 495000, may: 505000, jun: 512300,
      jul: 530000, aug: 540000, sep: 548900, oct: 560000, nov: 570000, dec: 575400
    },
    {
      code: '1200', name: 'Accounts Receivable', category: 'Current Assets',
      q1: 324800, q2: 342100, q3: 358700, q4: 376200, total: 1401800, percentOfTotal: 11.3,
      jan: 310000, feb: 315000, mar: 324800, apr: 330000, may: 336000, jun: 342100,
      jul: 348000, aug: 353000, sep: 358700, oct: 365000, nov: 371000, dec: 376200
    },
    {
      code: '1300', name: 'Inventory', category: 'Current Assets',
      q1: 156300, q2: 164800, q3: 173100, q4: 181600, total: 675800, percentOfTotal: 5.4,
      jan: 150000, feb: 153000, mar: 156300, apr: 160000, may: 162000, jun: 164800,
      jul: 168000, aug: 170500, sep: 173100, oct: 176000, nov: 179000, dec: 181600
    },
    {
      code: '1400', name: 'Prepaid Expenses', category: 'Current Assets',
      q1: 42100, q2: 44400, q3: 46600, q4: 48900, total: 182000, percentOfTotal: 1.5,
      jan: 40000, feb: 41000, mar: 42100, apr: 43000, may: 43700, jun: 44400,
      jul: 45200, aug: 46000, sep: 46600, oct: 47500, nov: 48200, dec: 48900
    },
    {
      code: '1500', name: 'Property, Plant & Equipment', category: 'Non-Current Assets',
      q1: 1245600, q2: 1312800, q3: 1378200, q4: 1445900, total: 5382500, percentOfTotal: 43.2,
      jan: 1200000, feb: 1220000, mar: 1245600, apr: 1270000, may: 1290000, jun: 1312800,
      jul: 1335000, aug: 1356000, sep: 1378200, oct: 1400000, nov: 1422000, dec: 1445900
    },
    {
      code: '1600', name: 'Intangible Assets', category: 'Non-Current Assets',
      q1: 425800, q2: 448900, q3: 471300, q4: 494200, total: 1840200, percentOfTotal: 14.8,
      jan: 410000, feb: 417000, mar: 425800, apr: 434000, may: 441000, jun: 448900,
      jul: 456000, aug: 463500, sep: 471300, oct: 479000, nov: 486500, dec: 494200
    },
    {
      code: '1700', name: 'Investments', category: 'Non-Current Assets',
      q1: 167700, q2: 176800, q3: 185700, q4: 194900, total: 725100, percentOfTotal: 5.8,
      jan: 162000, feb: 164500, mar: 167700, apr: 171000, may: 173800, jun: 176800,
      jul: 180000, aug: 182800, sep: 185700, oct: 189000, nov: 191900, dec: 194900
    },
    {
      code: '2100', name: 'Accounts Payable', category: 'Current Liabilities',
      q1: -245600, q2: -258700, q3: -271600, q4: -284900, total: -1060800, percentOfTotal: -8.5,
      jan: -235000, feb: -240000, mar: -245600, apr: -251000, may: -254500, jun: -258700,
      jul: -263000, aug: -267000, sep: -271600, oct: -276000, nov: -280500, dec: -284900
    },
    {
      code: '2200', name: 'Short-term Debt', category: 'Current Liabilities',
      q1: -125400, q2: -132200, q3: -138800, q4: -145600, total: -542000, percentOfTotal: -4.4,
      jan: -120000, feb: -122500, mar: -125400, apr: -128000, may: -130000, jun: -132200,
      jul: -134500, aug: -136500, sep: -138800, oct: -141500, nov: -143500, dec: -145600
    },
    {
      code: '2300', name: 'Accrued Expenses', category: 'Current Liabilities',
      q1: -89200, q2: -94000, q3: -98700, q4: -103500, total: -385400, percentOfTotal: -3.1,
      jan: -85000, feb: -87000, mar: -89200, apr: -91000, may: -92500, jun: -94000,
      jul: -95800, aug: -97200, sep: -98700, oct: -100500, nov: -102000, dec: -103500
    },
    {
      code: '2400', name: 'Long-term Debt', category: 'Non-Current Liabilities',
      q1: -685400, q2: -722500, q3: -758900, q4: -796200, total: -2963000, percentOfTotal: -23.8,
      jan: -660000, feb: -672000, mar: -685400, apr: -700000, may: -711000, jun: -722500,
      jul: -735000, aug: -746500, sep: -758900, oct: -772000, nov: -784000, dec: -796200
    },
    {
      code: '2500', name: 'Deferred Tax', category: 'Non-Current Liabilities',
      q1: -100200, q2: -105600, q3: -110900, q4: -116400, total: -433100, percentOfTotal: -3.5,
      jan: -96000, feb: -98000, mar: -100200, apr: -102000, may: -103800, jun: -105600,
      jul: -107500, aug: -109200, sep: -110900, oct: -113000, nov: -114700, dec: -116400
    },
    {
      code: '3100', name: 'Share Capital', category: 'Equity',
      q1: 500000, q2: 500000, q3: 500000, q4: 500000, total: 2000000, percentOfTotal: 16.1,
      jan: 500000, feb: 500000, mar: 500000, apr: 500000, may: 500000, jun: 500000,
      jul: 500000, aug: 500000, sep: 500000, oct: 500000, nov: 500000, dec: 500000
    },
    {
      code: '3200', name: 'Retained Earnings', category: 'Equity',
      q1: 1101700, q2: 1161800, q3: 1220400, q4: 1280700, total: 4764600, percentOfTotal: 38.3,
      jan: 1065000, feb: 1082000, mar: 1101700, apr: 1122000, may: 1141000, jun: 1161800,
      jul: 1182000, aug: 1201000, sep: 1220400, oct: 1242000, nov: 1261000, dec: 1280700
    },
  ];

  type MonthKey = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';
  type QuarterKey = 'q1' | 'q2' | 'q3' | 'q4';
  type DataKey = MonthKey | QuarterKey | 'total';

  const getMonthKey = (month: string): MonthKey => {
    const monthMap: { [key: string]: MonthKey } = {
      'Jan': 'jan', 'Feb': 'feb', 'Mar': 'mar', 'Apr': 'apr',
      'May': 'may', 'Jun': 'jun', 'Jul': 'jul', 'Aug': 'aug',
      'Sep': 'sep', 'Oct': 'oct', 'Nov': 'nov', 'Dec': 'dec'
    };
    return monthMap[month];
  };

  const getQuarterKey = (quarter: string): QuarterKey => {
    const quarterMap: { [key: string]: QuarterKey } = {
      'Q1': 'q1', 'Q2': 'q2', 'Q3': 'q3', 'Q4': 'q4'
    };
    return quarterMap[quarter];
  };

  const getCategoryTotal = (category: string, key: DataKey): number => {
    return balanceSheetData
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + (item[key] || 0), 0);
  };

  const formatCurrency = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(2)}M`;
    }
    return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`;
  };

  const getDisplayColumns = (): { key: DataKey; label: string }[] => {
    if (dateViewMode === 'quarters') {
      return [
        { key: 'q1', label: 'Q1' },
        { key: 'q2', label: 'Q2' },
        { key: 'q3', label: 'Q3' },
        { key: 'q4', label: 'Q4' }
      ];
    } else {
      return [
        { key: 'jan', label: 'Jan' },
        { key: 'feb', label: 'Feb' },
        { key: 'mar', label: 'Mar' },
        { key: 'apr', label: 'Apr' },
        { key: 'may', label: 'May' },
        { key: 'jun', label: 'Jun' },
        { key: 'jul', label: 'Jul' },
        { key: 'aug', label: 'Aug' },
        { key: 'sep', label: 'Sep' },
        { key: 'oct', label: 'Oct' },
        { key: 'nov', label: 'Nov' },
        { key: 'dec', label: 'Dec' }
      ];
    }
  };

  const getCurrentPeriodKey = (): DataKey => {
    if (dateViewMode === 'quarters') {
      return getQuarterKey(selectedQuarter);
    } else {
      return 'total';
    }
  };

  const displayColumns = getDisplayColumns();
  const currentPeriodKey = getCurrentPeriodKey();
  const totalAssets = getCategoryTotal('Current Assets', currentPeriodKey) + getCategoryTotal('Non-Current Assets', currentPeriodKey);
  const totalLiabilities = getCategoryTotal('Current Liabilities', currentPeriodKey) + getCategoryTotal('Non-Current Liabilities', currentPeriodKey);
  const totalEquity = getCategoryTotal('Equity', currentPeriodKey);

  const getTitle = (): string => {
    if (dateViewMode === 'quarters') {
      return `Balance Sheet - ${selectedQuarter} ${selectedYear}`;
    } else {
      return `Balance Sheet - ${selectedYear} (Year to Date)`;
    }
  };

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
            onClick={() => navigate('/reports/balance')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/reports/balance'
                ? 'bg-[#7B68EE] text-white'
                : 'bg-white text-[#7B68EE]'
            }`}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Balance Sheet
          </button>
          <button
            onClick={() => navigate('/reports/cashflow')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/reports/cashflow'
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
        <div className="flex items-center gap-3">
          {dateViewMode === 'quarters' && (
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
          )}

          {dateViewMode === 'years' && (
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
          )}

          <div className="h-6 w-px bg-gray-300 mx-1" />

          <button
            onClick={() => setDateViewMode('quarters')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              dateViewMode === 'quarters'
                ? 'bg-[#7B68EE] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setDateViewMode('years')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              dateViewMode === 'years'
                ? 'bg-[#7B68EE] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Year
          </button>
        </div>
      </Card>

      {/* Balance Sheet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Assets</p>
            <p className="text-lg font-bold text-[#4ADE80] mt-2">{formatCurrency(totalAssets)}</p>
            <p className="text-xs text-[#4ADE80] mt-1">+8.3% from last period</p>
          </div>
        </Card>

        <Card>
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Liabilities</p>
            <p className="text-lg font-bold text-[#F87171] mt-2">{formatCurrency(Math.abs(totalLiabilities))}</p>
            <p className="text-xs text-gray-500 mt-1">+2.1% from last period</p>
          </div>
        </Card>

        <Card>
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shareholders' Equity</p>
            <p className="text-lg font-bold text-[#3AB7BF] mt-2">{formatCurrency(totalEquity)}</p>
            <p className="text-xs text-[#4ADE80] mt-1">+12.7% from last period</p>
          </div>
        </Card>
      </div>

      {/* Detailed Balance Sheet Table */}
      <Card title={getTitle()}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Account Name</th>
                {displayColumns.map(col => (
                  <th key={col.key} className="text-right py-3 px-4 font-semibold text-gray-700">{col.label}</th>
                ))}
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Current Assets */}
              <tr className="bg-gray-50">
                <td colSpan={displayColumns.length + 4} className="py-2 px-4 font-bold text-[#101010]">ASSETS</td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={displayColumns.length + 4} className="py-2 px-4 font-semibold text-[#101010]">Current Assets</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Current Assets').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  {displayColumns.map(col => (
                    <td key={col.key} className="py-3 px-4 text-sm text-right text-gray-600">
                      {formatCurrency(item[col.key] || 0)}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Current Assets</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#4ADE80]">
                    {formatCurrency(getCategoryTotal('Current Assets', col.key))}
                  </td>
                ))}
                <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Current Assets', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">35.2%</td>
              </tr>

              {/* Non-Current Assets */}
              <tr className="bg-gray-50">
                <td colSpan={displayColumns.length + 4} className="py-2 px-4 font-semibold text-[#101010]">Non-Current Assets</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Non-Current Assets').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  {displayColumns.map(col => (
                    <td key={col.key} className="py-3 px-4 text-sm text-right text-gray-600">
                      {formatCurrency(item[col.key] || 0)}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Non-Current Assets</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#4ADE80]">
                    {formatCurrency(getCategoryTotal('Non-Current Assets', col.key))}
                  </td>
                ))}
                  <td className="py-3 px-4 text-right text-[#4ADE80]">{formatCurrency(getCategoryTotal('Non-Current Assets', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">64.8%</td>
              </tr>
              <tr className="bg-[#4ADE80]/20 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">TOTAL ASSETS</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#101010]">
                    {formatCurrency(getCategoryTotal('Current Assets', col.key) + getCategoryTotal('Non-Current Assets', col.key))}
                  </td>
                ))}
                  <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Assets', 'total') + getCategoryTotal('Non-Current Assets', 'total'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">100%</td>
              </tr>

              {/* Liabilities */}
              <tr className="bg-gray-50">
                <td colSpan={displayColumns.length + 4} className="py-2 px-4 font-bold text-[#101010]">LIABILITIES</td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={displayColumns.length + 4} className="py-2 px-4 font-semibold text-[#101010]">Current Liabilities</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Current Liabilities').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  {displayColumns.map(col => (
                    <td key={col.key} className="py-3 px-4 text-sm text-right text-gray-600">
                      {formatCurrency(item[col.key] || 0)}
                    </td>
                  ))}
                    <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Current Liabilities</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#F87171]">
                    {formatCurrency(getCategoryTotal('Current Liabilities', col.key))}
                  </td>
                ))}
                  <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Current Liabilities', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">-16.0%</td>
              </tr>

              {/* Non-Current Liabilities */}
              <tr className="bg-gray-50">
                <td colSpan={displayColumns.length + 4} className="py-2 px-4 font-semibold text-[#101010]">Non-Current Liabilities</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Non-Current Liabilities').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  {displayColumns.map(col => (
                    <td key={col.key} className="py-3 px-4 text-sm text-right text-gray-600">
                      {formatCurrency(item[col.key] || 0)}
                    </td>
                  ))}
                    <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">Total Non-Current Liabilities</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#F87171]">
                    {formatCurrency(getCategoryTotal('Non-Current Liabilities', col.key))}
                  </td>
                ))}
                  <td className="py-3 px-4 text-right text-[#F87171]">{formatCurrency(getCategoryTotal('Non-Current Liabilities', 'total'))}</td>
                <td className="py-3 px-4 text-right text-gray-600">-27.3%</td>
              </tr>
              <tr className="bg-[#F87171]/20 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">TOTAL LIABILITIES</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#101010]">
                    {formatCurrency(getCategoryTotal('Current Liabilities', col.key) + getCategoryTotal('Non-Current Liabilities', col.key))}
                  </td>
                ))}
                  <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Current Liabilities', 'total') + getCategoryTotal('Non-Current Liabilities', 'total'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">-43.3%</td>
              </tr>

              {/* Equity */}
              <tr className="bg-gray-50">
                <td colSpan={displayColumns.length + 4} className="py-2 px-4 font-bold text-[#101010]">EQUITY</td>
              </tr>
              {balanceSheetData.filter(item => item.category === 'Equity').map((item) => (
                <tr key={item.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-[#101010]">{item.name}</td>
                  {displayColumns.map(col => (
                    <td key={col.key} className="py-3 px-4 text-sm text-right text-gray-600">
                      {formatCurrency(item[col.key] || 0)}
                    </td>
                  ))}
                    <td className="py-3 px-4 text-sm text-right font-medium text-[#101010]">{formatCurrency(item.total)}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{item.percentOfTotal}%</td>
                </tr>
              ))}
              <tr className="bg-[#3AB7BF]/20 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">TOTAL EQUITY</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#101010]">
                    {formatCurrency(getCategoryTotal('Equity', col.key))}
                  </td>
                ))}
                  <td className="py-3 px-4 text-right text-[#101010]">{formatCurrency(getCategoryTotal('Equity', 'total'))}</td>
                <td className="py-3 px-4 text-right text-[#101010]">54.4%</td>
              </tr>

              {/* Balance Check */}
              <tr className="bg-gray-200 font-bold">
                <td colSpan={2} className="py-3 px-4 text-[#101010]">LIABILITIES + EQUITY</td>
                {displayColumns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-right text-[#101010]">
                    {formatCurrency(getCategoryTotal('Current Liabilities', col.key) + getCategoryTotal('Non-Current Liabilities', col.key) + getCategoryTotal('Equity', col.key))}
                  </td>
                ))}
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
