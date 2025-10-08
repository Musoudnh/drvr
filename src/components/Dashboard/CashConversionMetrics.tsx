import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Clock } from 'lucide-react';
import Card from '../UI/Card';
import { cashFlowService } from '../../services/cashFlowService';
import type { CashConversionMetrics as MetricsType } from '../../types/cashFlow';

interface CashConversionMetricsProps {
  className?: string;
}

const CashConversionMetrics: React.FC<CashConversionMetricsProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<MetricsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await cashFlowService.getCashConversionMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean) => {
    if (trend === 'stable') return 'text-gray-500';
    const isGood = isPositive ? trend === 'down' : trend === 'up';
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const getBenchmarkStatus = (value: number, optimal: number, acceptable: number) => {
    if (value <= optimal) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (value <= acceptable) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { status: 'Needs Attention', color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading metrics...</p>
        </div>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No metrics data available</p>
          <p className="text-sm text-gray-400 mt-1">Add transactions to calculate metrics</p>
        </div>
      </Card>
    );
  }

  const dsoStatus = getBenchmarkStatus(metrics.dso, 30, 45);
  const dpoStatus = getBenchmarkStatus(metrics.dpo, 45, 60);
  const cccStatus = getBenchmarkStatus(Math.abs(metrics.ccc), 30, 60);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Cash Conversion Cycle Metrics</h2>
        <p className="text-sm text-gray-500 mt-1">Key performance indicators for cash flow efficiency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className={`${dsoStatus.bg} rounded-lg p-4 border border-gray-200`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Days Sales Outstanding</p>
              <p className="text-xs text-gray-500 mt-0.5">Time to collect receivables</p>
            </div>
            <div className={getTrendColor(metrics.trends.dso, true)}>
              {getTrendIcon(metrics.trends.dso)}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{metrics.dso.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${dsoStatus.bg} ${dsoStatus.color}`}>
              {dsoStatus.status}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Benchmark:</span> {'<'}30 days excellent, {'<'}45 good
            </p>
          </div>
        </div>

        <div className={`${dpoStatus.bg} rounded-lg p-4 border border-gray-200`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Days Payable Outstanding</p>
              <p className="text-xs text-gray-500 mt-0.5">Time to pay vendors</p>
            </div>
            <div className={getTrendColor(metrics.trends.dpo, false)}>
              {getTrendIcon(metrics.trends.dpo)}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{metrics.dpo.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${dpoStatus.bg} ${dpoStatus.color}`}>
              {dpoStatus.status}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Benchmark:</span> 30-60 days optimal
            </p>
          </div>
        </div>

        <div className={`${cccStatus.bg} rounded-lg p-4 border border-gray-200`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Cash Conversion Cycle</p>
              <p className="text-xs text-gray-500 mt-0.5">Overall cash efficiency</p>
            </div>
            <div className={getTrendColor(metrics.trends.ccc, true)}>
              {getTrendIcon(metrics.trends.ccc)}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{metrics.ccc.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${cccStatus.bg} ${cccStatus.color}`}>
              {cccStatus.status}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Target:</span> Lower is better ({'<'}30 excellent)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Formula Breakdown</h3>
        <div className="flex items-center justify-center gap-3 text-sm">
          <div className="text-center">
            <p className="font-medium text-gray-700">DSO</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.dso.toFixed(0)}</p>
          </div>
          <span className="text-gray-400">+</span>
          <div className="text-center">
            <p className="font-medium text-gray-700">DIO</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.dio.toFixed(0)}</p>
          </div>
          <span className="text-gray-400">−</span>
          <div className="text-center">
            <p className="font-medium text-gray-700">DPO</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.dpo.toFixed(0)}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className="text-center">
            <p className="font-medium text-gray-700">CCC</p>
            <p className="text-2xl font-bold text-blue-900">{metrics.ccc.toFixed(0)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Improve DSO</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Invoice promptly</li>
            <li>• Offer early payment discounts</li>
            <li>• Send automated reminders</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Optimize DIO</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Reduce excess inventory</li>
            <li>• Implement just-in-time</li>
            <li>• Improve demand forecasting</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Manage DPO</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Negotiate better terms</li>
            <li>• Pay on time (not early)</li>
            <li>• Maintain vendor relationships</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default CashConversionMetrics;
