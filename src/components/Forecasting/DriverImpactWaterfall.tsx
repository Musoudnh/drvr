import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { CalculatedScenarioImpact } from '../../types/salesDriver';

interface DriverImpactWaterfallProps {
  impacts: CalculatedScenarioImpact[];
  selectedMonth?: string;
}

const DriverImpactWaterfall: React.FC<DriverImpactWaterfallProps> = ({ impacts, selectedMonth }) => {
  const displayMonth = selectedMonth || impacts[0]?.month || 'Jan';
  const monthData = impacts.find(i => i.month === displayMonth);

  if (!monthData || monthData.driverBreakdown.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Driver Impact Waterfall</h3>
        <div className="text-center py-12 text-gray-500">
          <p>No driver impacts for {displayMonth}</p>
        </div>
      </div>
    );
  }

  const sortedDrivers = [...monthData.driverBreakdown].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  const maxImpact = Math.max(...sortedDrivers.map(d => Math.abs(d.impact)));
  const baseHeight = 200;

  const getBarHeight = (impact: number) => {
    return (Math.abs(impact) / maxImpact) * baseHeight;
  };

  const getDriverColor = (driverType: string) => {
    const colors: { [key: string]: string } = {
      volume_price: '#3B82F6',
      cac: '#10B981',
      retention: '#8B5CF6',
      funnel: '#F59E0B',
      seasonality: '#EC4899',
      contract_terms: '#06B6D4',
      rep_productivity: '#14B8A6',
      discounting: '#F97316'
    };
    return colors[driverType] || '#6B7280';
  };

  let cumulativeY = baseHeight - getBarHeight(monthData.baseRevenue);
  const bars: { name: string; value: number; y: number; height: number; color: string; isPositive: boolean }[] = [];

  bars.push({
    name: 'Base',
    value: monthData.baseRevenue,
    y: cumulativeY,
    height: getBarHeight(monthData.baseRevenue),
    color: '#6B7280',
    isPositive: true
  });

  sortedDrivers.forEach((driver, index) => {
    const height = getBarHeight(driver.impact);
    const isPositive = driver.impact > 0;

    if (isPositive) {
      cumulativeY -= height;
    }

    bars.push({
      name: driver.driverName,
      value: driver.impact,
      y: cumulativeY,
      height: height,
      color: getDriverColor(driver.driverType),
      isPositive
    });

    if (!isPositive) {
      cumulativeY += height;
    }
  });

  bars.push({
    name: 'Final',
    value: monthData.finalRevenue,
    y: cumulativeY,
    height: baseHeight - cumulativeY,
    color: monthData.finalRevenue > monthData.baseRevenue ? '#10B981' : '#EF4444',
    isPositive: true
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900">Driver Impact Waterfall</h3>
          <p className="text-xs text-gray-600 mt-1">Impact breakdown for {displayMonth}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-xs text-gray-600">Positive Impact</span>
          </div>
          <div className="flex items-center">
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-xs text-gray-600">Negative Impact</span>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: baseHeight + 80 }}>
        <svg width="100%" height={baseHeight + 80} className="overflow-visible">
          {bars.map((bar, index) => {
            const barWidth = 60;
            const spacing = 20;
            const x = 40 + index * (barWidth + spacing);
            const isConnector = index < bars.length - 1;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={bar.y}
                  width={barWidth}
                  height={bar.height}
                  fill={bar.color}
                  opacity={0.9}
                  rx={4}
                  className="transition-all hover:opacity-100"
                />

                <text
                  x={x + barWidth / 2}
                  y={bar.y - 8}
                  textAnchor="middle"
                  className="text-xs font-bold fill-gray-900"
                >
                  ${(bar.value / 1000).toFixed(0)}K
                </text>

                <text
                  x={x + barWidth / 2}
                  y={baseHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  style={{ maxWidth: barWidth }}
                >
                  {bar.name.length > 8 ? bar.name.substring(0, 8) + '...' : bar.name}
                </text>

                {isConnector && (
                  <line
                    x1={x + barWidth}
                    y1={bar.y + (bar.isPositive ? 0 : bar.height)}
                    x2={x + barWidth + spacing}
                    y2={bars[index + 1].y + (bars[index + 1].isPositive ? 0 : bars[index + 1].height)}
                    stroke="#9CA3AF"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Base Revenue</p>
            <p className="text-lg font-bold text-gray-900">${monthData.baseRevenue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Impact</p>
            <p className={`text-lg font-bold ${monthData.totalImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthData.totalImpact >= 0 ? '+' : ''}${monthData.totalImpact.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Final Revenue</p>
            <p className="text-lg font-bold text-gray-900">${monthData.finalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-medium text-gray-700">Driver Breakdown</h4>
        {sortedDrivers.map((driver, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded mr-3"
                style={{ backgroundColor: getDriverColor(driver.driverType) }}
              />
              <span className="text-xs font-medium text-gray-900">{driver.driverName}</span>
            </div>
            <span className={`text-xs font-bold ${driver.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {driver.impact >= 0 ? '+' : ''}${driver.impact.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverImpactWaterfall;
