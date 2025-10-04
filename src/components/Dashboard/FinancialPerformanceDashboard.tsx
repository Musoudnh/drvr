import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface MonthlyData {
  month: string;
  budget: number;
  actual: number;
  priorYear: number;
}

const FinancialPerformanceDashboard: React.FC = () => {
  const [selectedYear] = useState(new Date().getFullYear());

  const monthlyData: MonthlyData[] = [
    { month: 'Jan', budget: 450000, actual: 485000, priorYear: 420000 },
    { month: 'Feb', budget: 460000, actual: 472000, priorYear: 435000 },
    { month: 'Mar', budget: 475000, actual: 495000, priorYear: 445000 },
    { month: 'Apr', budget: 480000, actual: 490000, priorYear: 455000 },
    { month: 'May', budget: 490000, actual: 505000, priorYear: 470000 },
    { month: 'Jun', budget: 500000, actual: 515000, priorYear: 480000 },
    { month: 'Jul', budget: 510000, actual: 525000, priorYear: 490000 },
    { month: 'Aug', budget: 520000, actual: 535000, priorYear: 500000 },
    { month: 'Sep', budget: 530000, actual: 545000, priorYear: 510000 },
    { month: 'Oct', budget: 540000, actual: 555000, priorYear: 520000 },
    { month: 'Nov', budget: 550000, actual: 565000, priorYear: 530000 },
    { month: 'Dec', budget: 560000, actual: 575000, priorYear: 540000 }
  ];

  const predictiveData = [
    { month: 'Jan', historical: 485000, prediction: 485000 },
    { month: 'Feb', historical: 472000, prediction: 472000 },
    { month: 'Mar', historical: 495000, prediction: 495000 },
    { month: 'Apr', historical: 490000, prediction: 490000 },
    { month: 'May', historical: 505000, prediction: 505000 },
    { month: 'Jun', historical: 515000, prediction: 515000 },
    { month: 'Jul', historical: 525000, prediction: 530000 },
    { month: 'Aug', historical: null, prediction: 542000 },
    { month: 'Sep', historical: null, prediction: 555000 },
    { month: 'Oct', historical: null, prediction: 568000 },
    { month: 'Nov', historical: null, prediction: 580000 },
    { month: 'Dec', historical: null, prediction: 593000 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.budget, d.actual, d.priorYear)));
  const maxPredictiveValue = Math.max(...predictiveData.map(d => d.prediction || 0));
  const scale = 100 / maxValue;
  const predictiveScale = 100 / maxPredictiveValue;

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const totalBudget = monthlyData.reduce((sum, d) => sum + d.budget, 0);
  const totalActual = monthlyData.reduce((sum, d) => sum + d.actual, 0);
  const variance = totalActual - totalBudget;
  const variancePercent = ((variance / totalBudget) * 100).toFixed(1);
  const yoyGrowth = ((totalActual - monthlyData.reduce((sum, d) => sum + d.priorYear, 0)) / monthlyData.reduce((sum, d) => sum + d.priorYear, 0) * 100).toFixed(1);

  const getPathD = (data: MonthlyData[]): string => {
    const points = data.map((d, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (d.priorYear * scale);
      return { x, y };
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
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Monthly Revenue Performance with AI Predictions</h3>
            <p className="text-sm text-gray-300 mt-1">12-Month Forward-Looking Forecast</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">+{yoyGrowth}% YoY Growth</span>
          </div>
        </div>

        <div className="relative h-64 mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="predictiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset={`${(predictionStartIndex / predictiveData.length) * 100}%`} stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset={`${(predictionStartIndex / predictiveData.length) * 100}%`} stopColor="#8B5CF6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <path
              d={`${getPredictivePathD()} L 100 100 L 0 100 Z`}
              fill="url(#predictiveGradient)"
              opacity="0.5"
            />

            <path
              d={getPredictivePathD()}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.5"
              strokeDasharray={`0 ${(predictionStartIndex / predictiveData.length) * 100} ${100 - (predictionStartIndex / predictiveData.length) * 100}`}
            />

            <path
              d={getPredictivePathD()}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="0.5"
              strokeDasharray={`${(predictionStartIndex / predictiveData.length) * 100} ${100 - (predictionStartIndex / predictiveData.length) * 100}`}
              strokeDashoffset={`-${(predictionStartIndex / predictiveData.length) * 100}`}
            />
          </svg>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-400">
            {predictiveData.map((d, i) => (
              <div key={i} className="text-center" style={{ width: `${100 / predictiveData.length}%` }}>
                {d.month}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-300">Historical</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(predictiveData.find(d => d.historical !== null)?.historical || 0)}</div>
            <div className="text-xs text-gray-400 mt-1">Last Recorded Month</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-300">AI Prediction (Next 6M)</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(predictiveData[predictiveData.length - 1].prediction)}</div>
            <div className="text-xs text-gray-400 mt-1">Predicted by {predictiveData[predictiveData.length - 1].month}</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-xs text-gray-300">Confidence Band</span>
            </div>
            <div className="text-2xl font-bold">±{variancePercent}%</div>
            <div className="text-xs text-gray-400 mt-1">Prediction accuracy</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Budget vs. Actual Performance</h3>
            <p className="text-sm text-gray-500 mt-1">Budget, Actual, and Prior Year Comparison</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#7B68EE] rounded"></div>
              <span className="text-sm text-gray-600">Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#4ADE80] rounded"></div>
              <span className="text-sm text-gray-600">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-[#3B82F6] rounded"></div>
              <span className="text-sm text-gray-600">Prior Year</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Total Budget</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</div>
            <div className="text-xs text-gray-500 mt-1">{selectedYear} Annual Target</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Total Actual</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(totalActual)}</div>
            <div className="text-xs text-green-600 mt-1">+{variancePercent}% vs Budget</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span>Variance</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(Math.abs(variance))}</div>
            <div className="text-xs text-blue-600 mt-1">{variance >= 0 ? 'Over' : 'Under'} Budget</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>YoY Growth</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">+{yoyGrowth}%</div>
            <div className="text-xs text-purple-600 mt-1">vs Prior Year</div>
          </div>
        </div>

        <div className="relative" style={{ height: '400px' }}>
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>{formatCurrency(maxValue)}</span>
            <span>{formatCurrency(maxValue * 0.75)}</span>
            <span>{formatCurrency(maxValue * 0.5)}</span>
            <span>{formatCurrency(maxValue * 0.25)}</span>
            <span>$0</span>
          </div>

          <div className="absolute left-12 right-0 top-0 bottom-0">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-end justify-between pb-8 gap-1">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end gap-1 group">
                    <div className="w-full flex gap-1 items-end">
                      <div
                        className="flex-1 bg-[#7B68EE] rounded-t transition-all duration-300 group-hover:bg-[#6B58DE] relative"
                        style={{ height: `${data.budget * scale}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {formatCurrency(data.budget)}
                        </div>
                      </div>
                      <div
                        className="flex-1 bg-[#4ADE80] rounded-t transition-all duration-300 group-hover:bg-[#3ACE70] relative"
                        style={{ height: `${data.actual * scale}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {formatCurrency(data.actual)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <svg className="absolute inset-0 pointer-events-none" style={{ paddingBottom: '32px' }}>
                <path
                  d={getPathD(monthlyData)}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
                {monthlyData.map((data, index) => {
                  const x = (index / (monthlyData.length - 1)) * 100;
                  const y = 100 - (data.priorYear * scale);
                  return (
                    <circle
                      key={index}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill="#3B82F6"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6 transition-all"
                    >
                      <title>{data.month}: {formatCurrency(data.priorYear)}</title>
                    </circle>
                  );
                })}
              </svg>

              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 font-medium">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 text-center">
                    {data.month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-12 gap-2 text-xs">
            {monthlyData.map((data, index) => {
              const variance = data.actual - data.budget;
              const variancePercent = ((variance / data.budget) * 100).toFixed(1);
              const pyGrowth = ((data.actual - data.priorYear) / data.priorYear * 100).toFixed(1);

              return (
                <div key={index} className="bg-gray-50 rounded p-2">
                  <div className="font-semibold text-gray-900 mb-1">{data.month}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium">{formatCurrency(data.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actual:</span>
                      <span className="font-medium text-green-600">{formatCurrency(data.actual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PY:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(data.priorYear)}</span>
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
