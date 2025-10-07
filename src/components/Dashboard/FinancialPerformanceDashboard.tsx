import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Settings, ChevronDown } from 'lucide-react';
import { useForecastingData } from '../../context/ForecastingContext';
import { useSettings } from '../../context/SettingsContext';
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
  const [selectedMonth, setSelectedMonth] = useState('Jul');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3');
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [quarterDropdownOpen, setQuarterDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const quarterDropdownRef = useRef<HTMLDivElement>(null);
  const { getMonthlyTotals, forecastData } = useForecastingData();
  const { fontSize } = useSettings();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

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

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


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
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
                  <h4 className="text-xs font-semibold text-gray-900 mb-2">Colors</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Actual Bar</label>
                      <input
                        type="color"
                        value={barColor}
                        onChange={(e) => setBarColor(e.target.value)}
                        className="w-full h-8 rounded-xl cursor-pointer border-0"
                        style={{ background: 'none' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Budget Line</label>
                      <input
                        type="color"
                        value={budgetLineColor}
                        onChange={(e) => setBudgetLineColor(e.target.value)}
                        className="w-full h-8 rounded-xl cursor-pointer border-0"
                        style={{ background: 'none' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Prior Year</label>
                      <input
                        type="color"
                        value={pyLineColor}
                        onChange={(e) => setPyLineColor(e.target.value)}
                        className="w-full h-8 rounded-xl cursor-pointer border-0"
                        style={{ background: 'none' }}
                      />
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

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Actual</div>
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(mtdMetrics.actual)}</div>
                </div>
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
              </div>

              <div className="border-t border-gray-300"></div>

              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Prior Year</div>
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(mtdMetrics.py)}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">vs Budget</div>
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

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Actual</div>
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(quarterlyMetrics.actual)}</div>
                </div>
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
              </div>

              <div className="border-t border-gray-300"></div>

              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Prior Year</div>
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(quarterlyMetrics.py)}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">vs Budget</div>
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
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Full Year</h4>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Actual</div>
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(totalActual)}</div>
                </div>
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
              </div>

              <div className="border-t border-gray-300"></div>

              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Prior Year</div>
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSize}px` }}>{formatCurrency(monthlyData.reduce((sum, d) => sum + d.PY, 0))}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">vs Budget</div>
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
    </div>
  );
};

export default FinancialPerformanceDashboard;
