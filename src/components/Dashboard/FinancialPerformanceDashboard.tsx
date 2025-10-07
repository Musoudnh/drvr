import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Settings, ChevronDown } from 'lucide-react';
import { useForecastingData } from '../../context/ForecastingContext';
import { useSettings } from '../../context/SettingsContext';
import { getViewSettings } from '../../utils/viewSettings';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyData {
  month: string;
  Budget: number;
  Actual: number;
  PY: number;
  hasActual: boolean;
}

const FinancialPerformanceDashboard: React.FC = () => {
  const [selectedYear] = useState(new Date().getFullYear());
  const [showColorSettings, setShowColorSettings] = useState(false);
  const [barColor, setBarColor] = useState('#4ade80');
  const [budgetLineColor, setBudgetLineColor] = useState('#7B68EE');
  const [pyLineColor, setPyLineColor] = useState('#3B82F6');

  const colorOptions = [
    { name: 'Green', value: '#4ade80' },
    { name: 'Purple', value: '#7B68EE' },
    { name: 'Red', value: '#F87171' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Orange', value: '#FB923C' },
    { name: 'Grey', value: '#9CA3AF' },
    { name: 'Black', value: '#1F2937' }
  ];
  const [selectedMonth, setSelectedMonth] = useState('Jul');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3');
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [quarterDropdownOpen, setQuarterDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const quarterDropdownRef = useRef<HTMLDivElement>(null);
  const { getMonthlyTotals, getMonthlyExpenseTotals, forecastData } = useForecastingData();
  const { fontSize } = useSettings();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [numberFormat, setNumberFormat] = useState<'actual' | 'thousands' | 'millions'>(() => getViewSettings().numberFormat);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const getQuarterMonths = (quarter: string): string[] => {
    switch (quarter) {
      case 'Q1': return ['Jan', 'Feb', 'Mar'];
      case 'Q2': return ['Apr', 'May', 'Jun'];
      case 'Q3': return ['Jul', 'Aug', 'Sep'];
      case 'Q4': return ['Oct', 'Nov', 'Dec'];
      default: return [];
    }
  };

  const calculateMTDMetrics = () => {
    const monthIndex = months.indexOf(selectedMonth);
    if (monthIndex === -1 || monthlyData.length === 0) return { actual: 0, budget: 0, py: 0 };

    const monthData = monthlyData[monthIndex];
    return {
      actual: monthData.Actual,
      budget: monthData.Budget,
      py: monthData.PY
    };
  };

  const calculateQuarterlyMetrics = () => {
    const quarterMonths = getQuarterMonths(selectedQuarter);
    const quarterData = monthlyData.filter(d => quarterMonths.includes(d.month));

    return {
      actual: quarterData.reduce((sum, d) => sum + d.Actual, 0),
      budget: quarterData.reduce((sum, d) => sum + d.Budget, 0),
      py: quarterData.reduce((sum, d) => sum + d.PY, 0)
    };
  };

  const mtdMetrics = calculateMTDMetrics();
  const mtdVsBudget = mtdMetrics.actual - mtdMetrics.budget;
  const mtdVsBudgetPct = mtdMetrics.budget > 0 ? ((mtdVsBudget / mtdMetrics.budget) * 100).toFixed(1) : '0.0';
  const mtdVsPY = mtdMetrics.actual - mtdMetrics.py;
  const mtdVsPYPct = mtdMetrics.py > 0 ? ((mtdVsPY / mtdMetrics.py) * 100).toFixed(1) : '0.0';

  const quarterlyMetrics = calculateQuarterlyMetrics();
  const qtrVsBudget = quarterlyMetrics.actual - quarterlyMetrics.budget;
  const qtrVsBudgetPct = quarterlyMetrics.budget > 0 ? ((qtrVsBudget / quarterlyMetrics.budget) * 100).toFixed(1) : '0.0';
  const qtrVsPY = quarterlyMetrics.actual - quarterlyMetrics.py;
  const qtrVsPYPct = quarterlyMetrics.py > 0 ? ((qtrVsPY / quarterlyMetrics.py) * 100).toFixed(1) : '0.0';

  useEffect(() => {
    if (forecastData.length === 0) {
      setMonthlyData([
        { month: 'Jan', Budget: 450000, Actual: 485000, PY: 420000, hasActual: true },
        { month: 'Feb', Budget: 460000, Actual: 472000, PY: 435000, hasActual: true },
        { month: 'Mar', Budget: 475000, Actual: 495000, PY: 445000, hasActual: true },
        { month: 'Apr', Budget: 480000, Actual: 490000, PY: 455000, hasActual: true },
        { month: 'May', Budget: 490000, Actual: 505000, PY: 470000, hasActual: true },
        { month: 'Jun', Budget: 500000, Actual: 515000, PY: 480000, hasActual: true },
        { month: 'Jul', Budget: 510000, Actual: 525000, PY: 490000, hasActual: true },
        { month: 'Aug', Budget: 520000, Actual: 535000, PY: 500000, hasActual: true },
        { month: 'Sep', Budget: 530000, Actual: 545000, PY: 510000, hasActual: true },
        { month: 'Oct', Budget: 540000, Actual: 554000, PY: 520000, hasActual: true },
        { month: 'Nov', Budget: 550000, Actual: 565000, PY: 530000, hasActual: false },
        { month: 'Dec', Budget: 560000, Actual: 575000, PY: 540000, hasActual: false }
      ]);
      return;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: MonthlyData[] = months.map(month => {
      const totals = getMonthlyTotals(`${month} ${selectedYear}`);
      return {
        month,
        Budget: totals.budget,
        Actual: totals.actual,
        PY: totals.py,
        hasActual: totals.hasActual
      };
    });
    setMonthlyData(data);
  }, [forecastData, selectedYear, getMonthlyTotals]);

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.Budget, d.Actual, d.PY)));
  const scale = 100 / maxValue;

  useEffect(() => {
    const checkFormatChange = () => {
      const currentFormat = getViewSettings().numberFormat;
      if (currentFormat !== numberFormat) {
        setNumberFormat(currentFormat);
      }
    };

    const interval = setInterval(checkFormatChange, 500);
    return () => clearInterval(interval);
  }, [numberFormat]);

  const formatCurrency = (value: number): string => {
    if (numberFormat === 'thousands') {
      return `$${(value / 1000).toFixed(0)}K`;
    } else if (numberFormat === 'millions') {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const totalBudget = monthlyData.reduce((sum, d) => sum + d.Budget, 0);
  const totalActual = monthlyData.reduce((sum, d) => sum + d.Actual, 0);
  const variance = totalActual - totalBudget;
  const variancePercent = ((variance / totalBudget) * 100).toFixed(1);
  const yoyGrowth = ((totalActual - monthlyData.reduce((sum, d) => sum + d.PY, 0)) / monthlyData.reduce((sum, d) => sum + d.PY, 0) * 100).toFixed(1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setMonthDropdownOpen(false);
      }
      if (quarterDropdownRef.current && !quarterDropdownRef.current.contains(event.target as Node)) {
        setQuarterDropdownOpen(false);
      }
      if (expenseMonthDropdownRef.current && !expenseMonthDropdownRef.current.contains(event.target as Node)) {
        setExpenseMonthDropdownOpen(false);
      }
      if (expenseQuarterDropdownRef.current && !expenseQuarterDropdownRef.current.contains(event.target as Node)) {
        setExpenseQuarterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const [expenseMonthlyData, setExpenseMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedExpenseMonth, setSelectedExpenseMonth] = useState('Jul');
  const [selectedExpenseQuarter, setSelectedExpenseQuarter] = useState('Q3');
  const [expenseMonthDropdownOpen, setExpenseMonthDropdownOpen] = useState(false);
  const [expenseQuarterDropdownOpen, setExpenseQuarterDropdownOpen] = useState(false);
  const expenseMonthDropdownRef = useRef<HTMLDivElement>(null);
  const expenseQuarterDropdownRef = useRef<HTMLDivElement>(null);
  const [showExpenseColorSettings, setShowExpenseColorSettings] = useState(false);
  const [expenseBarColor, setExpenseBarColor] = useState('#F87171');
  const [expenseBudgetLineColor, setExpenseBudgetLineColor] = useState('#7B68EE');
  const [expensePyLineColor, setExpensePyLineColor] = useState('#3B82F6');

  const calculateExpenseMTDMetrics = () => {
    const monthIndex = months.indexOf(selectedExpenseMonth);
    if (monthIndex === -1 || expenseMonthlyData.length === 0) return { actual: 0, budget: 0, py: 0 };

    const monthData = expenseMonthlyData[monthIndex];
    return {
      actual: monthData.Actual,
      budget: monthData.Budget,
      py: monthData.PY
    };
  };

  const calculateExpenseQuarterlyMetrics = () => {
    const quarterMonths = getQuarterMonths(selectedExpenseQuarter);
    const quarterData = expenseMonthlyData.filter(d => quarterMonths.includes(d.month));

    return {
      actual: quarterData.reduce((sum, d) => sum + d.Actual, 0),
      budget: quarterData.reduce((sum, d) => sum + d.Budget, 0),
      py: quarterData.reduce((sum, d) => sum + d.PY, 0)
    };
  };

  const expenseMtdMetrics = calculateExpenseMTDMetrics();
  const expenseMtdVsBudget = expenseMtdMetrics.actual - expenseMtdMetrics.budget;
  const expenseMtdVsBudgetPct = expenseMtdMetrics.budget > 0 ? ((expenseMtdVsBudget / expenseMtdMetrics.budget) * 100).toFixed(1) : '0.0';
  const expenseMtdVsPY = expenseMtdMetrics.actual - expenseMtdMetrics.py;
  const expenseMtdVsPYPct = expenseMtdMetrics.py > 0 ? ((expenseMtdVsPY / expenseMtdMetrics.py) * 100).toFixed(1) : '0.0';

  const expenseQuarterlyMetrics = calculateExpenseQuarterlyMetrics();
  const expenseQtrVsBudget = expenseQuarterlyMetrics.actual - expenseQuarterlyMetrics.budget;
  const expenseQtrVsBudgetPct = expenseQuarterlyMetrics.budget > 0 ? ((expenseQtrVsBudget / expenseQuarterlyMetrics.budget) * 100).toFixed(1) : '0.0';
  const expenseQtrVsPY = expenseQuarterlyMetrics.actual - expenseQuarterlyMetrics.py;
  const expenseQtrVsPYPct = expenseQuarterlyMetrics.py > 0 ? ((expenseQtrVsPY / expenseQuarterlyMetrics.py) * 100).toFixed(1) : '0.0';

  const totalExpenseBudget = expenseMonthlyData.reduce((sum, d) => sum + d.Budget, 0);
  const totalExpenseActual = expenseMonthlyData.reduce((sum, d) => sum + d.Actual, 0);
  const expenseVariance = totalExpenseActual - totalExpenseBudget;
  const expenseVariancePercent = ((expenseVariance / totalExpenseBudget) * 100).toFixed(1);
  const expenseYoyGrowth = ((totalExpenseActual - expenseMonthlyData.reduce((sum, d) => sum + d.PY, 0)) / expenseMonthlyData.reduce((sum, d) => sum + d.PY, 0) * 100).toFixed(1);

  useEffect(() => {
    if (forecastData.length === 0) {
      setExpenseMonthlyData([
        { month: 'Jan', Budget: 320000, Actual: 315000, PY: 310000, hasActual: true },
        { month: 'Feb', Budget: 325000, Actual: 330000, PY: 315000, hasActual: true },
        { month: 'Mar', Budget: 330000, Actual: 325000, PY: 320000, hasActual: true },
        { month: 'Apr', Budget: 335000, Actual: 340000, PY: 325000, hasActual: true },
        { month: 'May', Budget: 340000, Actual: 335000, PY: 330000, hasActual: true },
        { month: 'Jun', Budget: 345000, Actual: 350000, PY: 335000, hasActual: true },
        { month: 'Jul', Budget: 350000, Actual: 345000, PY: 340000, hasActual: true },
        { month: 'Aug', Budget: 355000, Actual: 360000, PY: 345000, hasActual: true },
        { month: 'Sep', Budget: 360000, Actual: 355000, PY: 350000, hasActual: true },
        { month: 'Oct', Budget: 365000, Actual: 370000, PY: 355000, hasActual: true },
        { month: 'Nov', Budget: 370000, Actual: 365000, PY: 360000, hasActual: false },
        { month: 'Dec', Budget: 375000, Actual: 380000, PY: 365000, hasActual: false }
      ]);
      return;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: MonthlyData[] = months.map(month => {
      const totals = getMonthlyExpenseTotals(`${month} ${selectedYear}`);
      return {
        month,
        Budget: totals.budget,
        Actual: totals.actual,
        PY: totals.py,
        hasActual: totals.hasActual
      };
    });
    setExpenseMonthlyData(data);
  }, [forecastData, selectedYear, getMonthlyExpenseTotals]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <p className="text-xs text-gray-500 mt-1">Budget, Actual, and Prior Year Comparison</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: barColor }}></div>
              <span className="text-xs text-gray-600">Act</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: budgetLineColor }}></div>
              <span className="text-xs text-gray-600">Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: pyLineColor }}></div>
              <span className="text-xs text-gray-600">PY</span>
            </div>
            <div className="relative ml-2">
              <button
                onClick={() => setShowColorSettings(!showColorSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Customize colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {showColorSettings && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
                  <h4 className="text-xs font-semibold text-gray-900 mb-3">Chart Colors</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Actual Bar</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={`bar-${color.value}`}
                            onClick={() => setBarColor(color.value)}
                            className={`w-6 h-6 rounded-full transition-all ${
                              barColor === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-900'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Budget Line</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={`budget-${color.value}`}
                            onClick={() => setBudgetLineColor(color.value)}
                            className={`w-6 h-6 rounded-full transition-all ${
                              budgetLineColor === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-900'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Prior Year</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={`py-${color.value}`}
                            onClick={() => setPyLineColor(color.value)}
                            className={`w-6 h-6 rounded-full transition-all ${
                              pyLineColor === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-900'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Month-to-Date</h4>
              <div className="relative" ref={monthDropdownRef}>
                <button
                  onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                  className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
                >
                  <span>{selectedMonth}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {monthDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[100px]">
                    <div className="flex flex-col gap-1">
                      {months.map((month) => (
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
                          {month}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Actual</div>
                <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(mtdMetrics.actual)}</div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs Budget</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${mtdVsBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mtdVsBudget >= 0 ? '+' : ''}{formatCurrency(Math.abs(mtdVsBudget))}
                  </div>
                  <div className={`text-sm font-medium ${mtdVsBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mtdVsBudget >= 0 ? '+' : ''}{mtdVsBudgetPct}%
                  </div>
                </div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs PY</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${mtdVsPY >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mtdVsPY >= 0 ? '+' : ''}{formatCurrency(Math.abs(mtdVsPY))}
                  </div>
                  <div className={`text-sm font-medium ${mtdVsPY >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mtdVsPY >= 0 ? '+' : ''}{mtdVsPYPct}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Quarterly</h4>
              <div className="relative" ref={quarterDropdownRef}>
                <button
                  onClick={() => setQuarterDropdownOpen(!quarterDropdownOpen)}
                  className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
                >
                  <span>{selectedQuarter}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {quarterDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[100px]">
                    <div className="flex flex-col gap-1">
                      {quarters.map((quarter) => (
                        <button
                          key={quarter}
                          onClick={() => {
                            setSelectedQuarter(quarter);
                            setQuarterDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
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
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Actual</div>
                <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(quarterlyMetrics.actual)}</div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs Budget</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${qtrVsBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {qtrVsBudget >= 0 ? '+' : ''}{formatCurrency(Math.abs(qtrVsBudget))}
                  </div>
                  <div className={`text-sm font-medium ${qtrVsBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {qtrVsBudget >= 0 ? '+' : ''}{qtrVsBudgetPct}%
                  </div>
                </div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs PY</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${qtrVsPY >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {qtrVsPY >= 0 ? '+' : ''}{formatCurrency(Math.abs(qtrVsPY))}
                  </div>
                  <div className={`text-sm font-medium ${qtrVsPY >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {qtrVsPY >= 0 ? '+' : ''}{qtrVsPYPct}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Full Year</h4>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Actual</div>
                <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(totalActual)}</div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs Budget</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                  </div>
                  <div className={`text-sm font-medium ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variance >= 0 ? '+' : ''}{variancePercent}%
                  </div>
                </div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs PY</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${(totalActual - monthlyData.reduce((sum, d) => sum + d.PY, 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalActual - monthlyData.reduce((sum, d) => sum + d.PY, 0)) >= 0 ? '+' : ''}{formatCurrency(Math.abs(totalActual - monthlyData.reduce((sum, d) => sum + d.PY, 0)))}
                  </div>
                  <div className={`text-sm font-medium ${(totalActual - monthlyData.reduce((sum, d) => sum + d.PY, 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalActual - monthlyData.reduce((sum, d) => sum + d.PY, 0)) >= 0 ? '+' : ''}{yoyGrowth}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-8" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyData}
              margin={{ top: 20, right: 40, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                width={80}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                contentStyle={{ borderRadius: '10px' }}
              />

              <Bar
                dataKey="PY"
                name="Prior Year"
                fill={pyLineColor}
                radius={[6, 6, 0, 0]}
                barSize={35}
                isAnimationActive={true}
              />

              <Bar
                dataKey="Actual"
                name="Actual"
                fill={barColor}
                radius={[6, 6, 0, 0]}
                barSize={35}
                isAnimationActive={true}
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const fillColor = payload.hasActual ? barColor : '#9ca3af';
                  return (
                    <path
                      d={`
                        M ${x} ${y + height}
                        L ${x} ${y + 6}
                        Q ${x} ${y}, ${x + 6} ${y}
                        L ${x + width - 6} ${y}
                        Q ${x + width} ${y}, ${x + width} ${y + 6}
                        L ${x + width} ${y + height}
                        Z
                      `}
                      fill={fillColor}
                    />
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="Budget"
                name="Budget"
                stroke={budgetLineColor}
                strokeWidth={3}
                dot={{ r: 5, fill: budgetLineColor, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
              />

            </ComposedChart>
          </ResponsiveContainer>
        </div>


        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-12 gap-2 text-xs">
            {monthlyData.map((data, index) => {
              const variance = data.Actual - data.Budget;
              const variancePercent = ((variance / data.Budget) * 100).toFixed(1);
              const pyGrowth = ((data.Actual - data.PY) / data.PY * 100).toFixed(1);

              return (
                <div key={index} className="bg-gray-50 rounded p-2">
                  <div className="font-semibold text-gray-900 mb-1">{data.month}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium">{formatCurrency(data.Budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actual:</span>
                      <span className="font-medium text-green-600">{formatCurrency(data.Actual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PY:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(data.PY)}</span>
                    </div>
                    <div className="pt-1 border-t border-gray-200">
                      <div className={`flex items-center gap-1 ${parseFloat(variancePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(variancePercent) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="font-semibold">{variancePercent}%</span>
                      </div>
                      <div className="text-gray-400 text-[10px]">vs Budget</div>
                      <div className={`flex items-center gap-1 mt-1 ${parseFloat(pyGrowth) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {parseFloat(pyGrowth) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="font-semibold">{pyGrowth}%</span>
                      </div>
                      <div className="text-gray-400 text-[10px]">vs PY</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
            <p className="text-xs text-gray-500 mt-1">Budget, Actual, and Prior Year Comparison</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: expenseBarColor }}></div>
              <span className="text-xs text-gray-600">Act</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: expenseBudgetLineColor }}></div>
              <span className="text-xs text-gray-600">Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: expensePyLineColor }}></div>
              <span className="text-xs text-gray-600">PY</span>
            </div>
            <div className="relative ml-2">
              <button
                onClick={() => setShowExpenseColorSettings(!showExpenseColorSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Customize colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {showExpenseColorSettings && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
                  <h4 className="text-xs font-semibold text-gray-900 mb-3">Chart Colors</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Actual Bar</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={`expense-bar-${color.value}`}
                            onClick={() => setExpenseBarColor(color.value)}
                            className={`w-6 h-6 rounded-full transition-all ${
                              expenseBarColor === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-900'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Budget Line</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={`expense-budget-${color.value}`}
                            onClick={() => setExpenseBudgetLineColor(color.value)}
                            className={`w-6 h-6 rounded-full transition-all ${
                              expenseBudgetLineColor === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-900'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Prior Year</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={`expense-py-${color.value}`}
                            onClick={() => setExpensePyLineColor(color.value)}
                            className={`w-6 h-6 rounded-full transition-all ${
                              expensePyLineColor === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-900'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Month-to-Date</h4>
              <div className="relative" ref={expenseMonthDropdownRef}>
                <button
                  onClick={() => setExpenseMonthDropdownOpen(!expenseMonthDropdownOpen)}
                  className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
                >
                  <span>{selectedExpenseMonth}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {expenseMonthDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[100px]">
                    <div className="flex flex-col gap-1">
                      {months.map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            setSelectedExpenseMonth(month);
                            setExpenseMonthDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                            selectedExpenseMonth === month
                              ? 'bg-[#7B68EE] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Actual</div>
                <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(expenseMtdMetrics.actual)}</div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs Budget</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${expenseMtdVsBudget <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseMtdVsBudget >= 0 ? '+' : ''}{formatCurrency(Math.abs(expenseMtdVsBudget))}
                  </div>
                  <div className={`text-sm font-medium ${expenseMtdVsBudget <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseMtdVsBudget >= 0 ? '+' : ''}{expenseMtdVsBudgetPct}%
                  </div>
                </div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs PY</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${expenseMtdVsPY <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseMtdVsPY >= 0 ? '+' : ''}{formatCurrency(Math.abs(expenseMtdVsPY))}
                  </div>
                  <div className={`text-sm font-medium ${expenseMtdVsPY <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseMtdVsPY >= 0 ? '+' : ''}{expenseMtdVsPYPct}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Quarterly</h4>
              <div className="relative" ref={expenseQuarterDropdownRef}>
                <button
                  onClick={() => setExpenseQuarterDropdownOpen(!expenseQuarterDropdownOpen)}
                  className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
                >
                  <span>{selectedExpenseQuarter}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {expenseQuarterDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[100px]">
                    <div className="flex flex-col gap-1">
                      {quarters.map((quarter) => (
                        <button
                          key={quarter}
                          onClick={() => {
                            setSelectedExpenseQuarter(quarter);
                            setExpenseQuarterDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                            selectedExpenseQuarter === quarter
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
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Actual</div>
                <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(expenseQuarterlyMetrics.actual)}</div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs Budget</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${expenseQtrVsBudget <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseQtrVsBudget >= 0 ? '+' : ''}{formatCurrency(Math.abs(expenseQtrVsBudget))}
                  </div>
                  <div className={`text-sm font-medium ${expenseQtrVsBudget <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseQtrVsBudget >= 0 ? '+' : ''}{expenseQtrVsBudgetPct}%
                  </div>
                </div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs PY</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${expenseQtrVsPY <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseQtrVsPY >= 0 ? '+' : ''}{formatCurrency(Math.abs(expenseQtrVsPY))}
                  </div>
                  <div className={`text-sm font-medium ${expenseQtrVsPY <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseQtrVsPY >= 0 ? '+' : ''}{expenseQtrVsPYPct}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Full Year</h4>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Actual</div>
                <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(totalExpenseActual)}</div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs Budget</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${expenseVariance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseVariance >= 0 ? '+' : ''}{formatCurrency(Math.abs(expenseVariance))}
                  </div>
                  <div className={`text-sm font-medium ${expenseVariance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseVariance >= 0 ? '+' : ''}{expenseVariancePercent}%
                  </div>
                </div>
              </div>

              <div className="h-12 border-l border-gray-300"></div>

              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">vs PY</div>
                <div className="flex items-baseline gap-2">
                  <div className={`text-lg font-semibold ${(totalExpenseActual - expenseMonthlyData.reduce((sum, d) => sum + d.PY, 0)) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalExpenseActual - expenseMonthlyData.reduce((sum, d) => sum + d.PY, 0)) >= 0 ? '+' : ''}{formatCurrency(Math.abs(totalExpenseActual - expenseMonthlyData.reduce((sum, d) => sum + d.PY, 0)))}
                  </div>
                  <div className={`text-sm font-medium ${(totalExpenseActual - expenseMonthlyData.reduce((sum, d) => sum + d.PY, 0)) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalExpenseActual - expenseMonthlyData.reduce((sum, d) => sum + d.PY, 0)) >= 0 ? '+' : ''}{expenseYoyGrowth}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-8" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={expenseMonthlyData}
              margin={{ top: 20, right: 40, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                width={80}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                contentStyle={{ borderRadius: '10px' }}
              />

              <Bar
                dataKey="PY"
                name="Prior Year"
                fill={expensePyLineColor}
                radius={[6, 6, 0, 0]}
                barSize={35}
                isAnimationActive={true}
              />

              <Bar
                dataKey="Actual"
                name="Actual"
                fill={expenseBarColor}
                radius={[6, 6, 0, 0]}
                barSize={35}
                isAnimationActive={true}
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const fillColor = payload.hasActual ? expenseBarColor : '#9ca3af';
                  return (
                    <path
                      d={`
                        M ${x} ${y + height}
                        L ${x} ${y + 6}
                        Q ${x} ${y}, ${x + 6} ${y}
                        L ${x + width - 6} ${y}
                        Q ${x + width} ${y}, ${x + width} ${y + 6}
                        L ${x + width} ${y + height}
                        Z
                      `}
                      fill={fillColor}
                    />
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="Budget"
                name="Budget"
                stroke={expenseBudgetLineColor}
                strokeWidth={3}
                dot={{ r: 5, fill: expenseBudgetLineColor, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
              />

            </ComposedChart>
          </ResponsiveContainer>
        </div>


        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-12 gap-2 text-xs">
            {expenseMonthlyData.map((data, index) => {
              const variance = data.Actual - data.Budget;
              const variancePercent = ((variance / data.Budget) * 100).toFixed(1);
              const pyGrowth = ((data.Actual - data.PY) / data.PY * 100).toFixed(1);

              return (
                <div key={index} className="bg-gray-50 rounded p-2">
                  <div className="font-semibold text-gray-900 mb-1">{data.month}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium">{formatCurrency(data.Budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actual:</span>
                      <span className="font-medium text-red-600">{formatCurrency(data.Actual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PY:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(data.PY)}</span>
                    </div>
                    <div className="pt-1 border-t border-gray-200">
                      <div className={`flex items-center gap-1 ${parseFloat(variancePercent) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(variancePercent) <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        <span className="font-semibold">{variancePercent}%</span>
                      </div>
                      <div className="text-gray-400 text-[10px]">vs Budget</div>
                      <div className={`flex items-center gap-1 mt-1 ${parseFloat(pyGrowth) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(pyGrowth) <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        <span className="font-semibold">{pyGrowth}%</span>
                      </div>
                      <div className="text-gray-400 text-[10px]">vs PY</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPerformanceDashboard;
