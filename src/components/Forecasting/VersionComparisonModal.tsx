import { useState, useEffect } from 'react';
import { X, GitCompare, TrendingUp, TrendingDown } from 'lucide-react';
import { forecastService } from '../../services/forecastService';
import type { ForecastLineItem } from '../../types/forecast';
import Button from '../UI/Button';

interface VersionComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  version1Id: string;
  version2Id: string;
}

interface ComparisonData {
  glCode: string;
  glName: string;
  glType: 'revenue' | 'expense';
  version1Total: number;
  version2Total: number;
  difference: number;
  percentChange: number;
}

export function VersionComparisonModal({
  isOpen,
  onClose,
  version1Id,
  version2Id,
}: VersionComparisonModalProps) {
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  const months = [
    'All',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    if (isOpen && version1Id && version2Id) {
      loadComparison();
    }
  }, [isOpen, version1Id, version2Id, selectedMonth]);

  const loadComparison = async () => {
    setLoading(true);
    try {
      const { version1, version2 } = await forecastService.compareVersions(
        version1Id,
        version2Id
      );

      const filteredVersion1 =
        selectedMonth === 'All'
          ? version1
          : version1.filter(item => item.month === selectedMonth);
      const filteredVersion2 =
        selectedMonth === 'All'
          ? version2
          : version2.filter(item => item.month === selectedMonth);

      const glCodeMap = new Map<string, ComparisonData>();

      filteredVersion1.forEach(item => {
        if (!glCodeMap.has(item.gl_code)) {
          glCodeMap.set(item.gl_code, {
            glCode: item.gl_code,
            glName: item.gl_name,
            glType: item.gl_type,
            version1Total: 0,
            version2Total: 0,
            difference: 0,
            percentChange: 0,
          });
        }
        const data = glCodeMap.get(item.gl_code)!;
        data.version1Total += item.forecasted_amount;
      });

      filteredVersion2.forEach(item => {
        if (!glCodeMap.has(item.gl_code)) {
          glCodeMap.set(item.gl_code, {
            glCode: item.gl_code,
            glName: item.gl_name,
            glType: item.gl_type,
            version1Total: 0,
            version2Total: 0,
            difference: 0,
            percentChange: 0,
          });
        }
        const data = glCodeMap.get(item.gl_code)!;
        data.version2Total += item.forecasted_amount;
      });

      const comparison = Array.from(glCodeMap.values()).map(data => {
        const difference = data.version2Total - data.version1Total;
        const percentChange =
          data.version1Total !== 0
            ? (difference / Math.abs(data.version1Total)) * 100
            : 0;
        return {
          ...data,
          difference,
          percentChange,
        };
      });

      comparison.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
      setComparisonData(comparison);
    } catch (error) {
      console.error('Error loading comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (difference: number, glType: 'revenue' | 'expense') => {
    if (glType === 'revenue') {
      return difference >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]';
    } else {
      return difference <= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]';
    }
  };

  const getImpactIcon = (difference: number, glType: 'revenue' | 'expense') => {
    const isPositiveImpact =
      (glType === 'revenue' && difference >= 0) ||
      (glType === 'expense' && difference <= 0);
    return isPositiveImpact ? TrendingUp : TrendingDown;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <GitCompare className="w-6 h-6 text-[#3AB7BF]" />
            <h2 className="text-2xl font-semibold text-gray-900">Version Comparison</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <label className="text-xs font-medium text-gray-700">Filter by Month:</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AB7BF]"></div>
              <p className="mt-4 text-gray-600">Loading comparison...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">
                      GL Code
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">
                      Account Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700">
                      Version 1
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700">
                      Version 2
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700">
                      Difference
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700">
                      % Change
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map(item => {
                    const ImpactIcon = getImpactIcon(item.difference, item.glType);
                    const impactColor = getImpactColor(item.difference, item.glType);

                    return (
                      <tr key={item.glCode} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-xs font-medium text-gray-900">
                          {item.glCode}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">{item.glName}</td>
                        <td className="py-3 px-4 text-xs">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.glType === 'revenue'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {item.glType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-right text-gray-900">
                          ${item.version1Total.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-xs text-right text-gray-900 font-medium">
                          ${item.version2Total.toLocaleString()}
                        </td>
                        <td
                          className={`py-3 px-4 text-xs text-right font-medium ${impactColor}`}
                        >
                          {item.difference >= 0 ? '+' : ''}$
                          {item.difference.toLocaleString()}
                        </td>
                        <td
                          className={`py-3 px-4 text-xs text-right font-medium ${impactColor}`}
                        >
                          {item.percentChange >= 0 ? '+' : ''}
                          {item.percentChange.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <ImpactIcon className={`w-5 h-5 mx-auto ${impactColor}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-xs font-bold text-gray-900">
                      TOTAL
                    </td>
                    <td className="py-3 px-4 text-xs text-right font-bold text-gray-900">
                      $
                      {comparisonData
                        .reduce((sum, item) => sum + item.version1Total, 0)
                        .toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs text-right font-bold text-gray-900">
                      $
                      {comparisonData
                        .reduce((sum, item) => sum + item.version2Total, 0)
                        .toLocaleString()}
                    </td>
                    <td
                      className={`py-3 px-4 text-xs text-right font-bold ${
                        comparisonData.reduce((sum, item) => sum + item.difference, 0) >= 0
                          ? 'text-[#4ADE80]'
                          : 'text-[#F87171]'
                      }`}
                    >
                      {comparisonData.reduce((sum, item) => sum + item.difference, 0) >= 0
                        ? '+'
                        : ''}
                      $
                      {comparisonData
                        .reduce((sum, item) => sum + item.difference, 0)
                        .toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
