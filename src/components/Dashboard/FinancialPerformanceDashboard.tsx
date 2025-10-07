import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Settings } from 'lucide-react';
import { useForecastingData } from '../../context/ForecastingContext';
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
  Area,
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
  const { getMonthlyTotals, forecastData } = useForecastingData();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

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

  const predictiveData = [
    { month: 'Jan', historical: 485000, prediction: 485000, upper: 500000, lower: 470000 },
    { month: 'Feb', historical: 472000, prediction: 472000, upper: 487000, lower: 457000 },
    { month: 'Mar', historical: 495000, prediction: 495000, upper: 510000, lower: 480000 },
    { month: 'Apr', historical: 490000, prediction: 490000, upper: 505000, lower: 475000 },
    { month: 'May', historical: 505000, prediction: 505000, upper: 520000, lower: 490000 },
    { month: 'Jun', historical: 515000, prediction: 515000, upper: 530000, lower: 500000 },
    { month: 'Jul', historical: 525000, prediction: 530000, upper: 546000, lower: 514000 },
    { month: 'Aug', historical: null, prediction: 542000, upper: 564000, lower: 520000 },
    { month: 'Sep', historical: null, prediction: 555000, upper: 583000, lower: 527000 },
    { month: 'Oct', historical: null, prediction: 568000, upper: 602000, lower: 534000 },
    { month: 'Nov', historical: null, prediction: 580000, upper: 620000, lower: 540000 },
    { month: 'Dec', historical: null, prediction: 593000, upper: 638000, lower: 548000 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.Budget, d.Actual, d.PY)));
  const maxPredictiveValue = Math.max(...predictiveData.map(d => d.prediction || 0));
  const scale = 100 / maxValue;
  const predictiveScale = 100 / maxPredictiveValue;

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

  const getPredictivePathD = (): string => {
    const points = predictiveData.map((d, index) => {
      const x = (index / (predictiveData.length - 1)) * 100;
      const y = 100 - ((d.historical || d.prediction) * predictiveScale);
      return { x, y, isHistorical: d.historical !== null };
    });

    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;

      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  const predictionStartIndex = predictiveData.findIndex(d => d.historical === null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Budget vs. Actual Performance</h3>
            <p className="text-xs text-gray-500 mt-1">Budget, Actual, and Prior Year Comparison</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: barColor }}></div>
              <span className="text-xs text-gray-600">Actual (Bar)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: budgetLineColor }}></div>
              <span className="text-xs text-gray-600">Budget (Line)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: pyLineColor }}></div>
              <span className="text-xs text-gray-600">Prior Year (Bar)</span>
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

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Total Budget</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</div>
            <div className="text-xs text-gray-500 mt-1">{selectedYear} Annual Target</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 text-xs mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Total Actual</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(totalActual)}</div>
            <div className="text-xs text-green-600 mt-1">+{variancePercent}% vs Budget</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
              <Calendar className="w-4 h-4" />
              <span>Variance</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(Math.abs(variance))}</div>
            <div className="text-xs text-blue-600 mt-1">{variance >= 0 ? 'Over' : 'Under'} Budget</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 text-xs mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>YoY Growth</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">+{yoyGrowth}%</div>
            <div className="text-xs text-purple-600 mt-1">vs Prior Year</div>
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
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Performance with AI Predictions</h3>
            <p className="text-xs text-gray-500 mt-1">12-Month Forward-Looking Forecast</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg border border-green-200">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold">+{yoyGrowth}% YoY Growth</span>
          </div>
        </div>

        <div className="w-full mb-6" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={predictiveData}
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


              <Line
                type="monotone"
                dataKey="historical"
                name="Actuals"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                connectNulls={false}
                isAnimationActive={true}
              />

              <Line
                type="monotone"
                dataKey="upper"
                name="High Confidence"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />

              <Line
                type="monotone"
                dataKey="prediction"
                name="Base Prediction"
                stroke="#8B5CF6"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 5, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
              />

              <Line
                type="monotone"
                dataKey="lower"
                name="Low Confidence"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-700 font-medium">Historical</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(515000)}</div>
            <div className="text-xs text-gray-600 mt-1">Last Recorded Month</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-700 font-medium">High Confidence</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(638000)}</div>
            <div className="text-xs text-gray-600 mt-1">Best Case by Dec</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-700 font-medium">Base Prediction</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(593000)}</div>
            <div className="text-xs text-gray-600 mt-1">Expected by Dec</div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-700 font-medium">Low Confidence</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(548000)}</div>
            <div className="text-xs text-gray-600 mt-1">Worst Case by Dec</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPerformanceDashboard;
