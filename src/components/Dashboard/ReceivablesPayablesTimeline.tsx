import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../UI/Card';
import { cashFlowService } from '../../services/cashFlowService';
import type { TimelineDataPoint } from '../../types/cashFlow';

interface ReceivablesPayablesTimelineProps {
  className?: string;
}

const ReceivablesPayablesTimeline: React.FC<ReceivablesPayablesTimelineProps> = ({ className = '' }) => {
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30' | '60' | '90'>('30');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    loadTimelineData();
  }, [timeRange]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const data = await cashFlowService.getTimelineData(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setTimelineData(data);
    } catch (error) {
      console.error('Error loading timeline data:', error);
    } finally {
      setLoading(false);
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
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalReceivables = timelineData.reduce((sum, d) => sum + d.receivables, 0);
  const totalPayables = timelineData.reduce((sum, d) => sum + d.payables, 0);
  const netPosition = timelineData.length > 0 ? timelineData[timelineData.length - 1].netCash : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{formatDate(label)}</p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Receivables vs. Payables Timeline</h2>
          <p className="text-sm text-gray-500 mt-1">Cash flow trends over time</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '30' | '60' | '90')}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Receivables</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalReceivables)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Payables</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{formatCurrency(totalPayables)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className={`${netPosition >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${netPosition >= 0 ? 'text-blue-600' : 'text-orange-600'} font-medium`}>
                Net Cash Position
              </p>
              <p className={`text-2xl font-bold ${netPosition >= 0 ? 'text-blue-900' : 'text-orange-900'} mt-1`}>
                {formatCurrency(netPosition)}
              </p>
            </div>
            {netPosition >= 0 ? (
              <TrendingUp className="w-8 h-8 text-blue-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-orange-600" />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      ) : timelineData.length === 0 ? (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No cash flow data available</p>
            <p className="text-sm text-gray-400 mt-1">Add receivables and payables to see trends</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'line' ? (
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="receivables"
                name="Receivables"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="payables"
                name="Payables"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="netCash"
                name="Net Cash"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar dataKey="receivables" name="Receivables" fill="#10b981" />
              <Bar dataKey="payables" name="Payables" fill="#ef4444" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default ReceivablesPayablesTimeline;
