import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';
import { DriverInstance, DriverResult } from '../../types/driverLibrary';
import { getDriverResults, getDriverInstances } from '../../services/driverLibraryService';
import { format, parseISO } from 'date-fns';

interface DriverResultsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  forecastVersionId?: string;
}

const DriverResultsPanel: React.FC<DriverResultsPanelProps> = ({
  isOpen,
  onClose,
  forecastVersionId,
}) => {
  const [instances, setInstances] = useState<DriverInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [results, setResults] = useState<DriverResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    if (isOpen) {
      loadInstances();
    }
  }, [isOpen, forecastVersionId]);

  useEffect(() => {
    if (selectedInstanceId) {
      loadResults(selectedInstanceId);
    }
  }, [selectedInstanceId]);

  const loadInstances = async () => {
    try {
      setLoading(true);
      const data = await getDriverInstances(forecastVersionId);
      setInstances(data);
      if (data.length > 0 && !selectedInstanceId) {
        setSelectedInstanceId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load driver instances:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (instanceId: string) => {
    try {
      setLoading(true);
      const data = await getDriverResults(instanceId);
      setResults(data);
    } catch (error) {
      console.error('Failed to load driver results:', error);
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTotalRevenue = () => {
    return results.reduce((sum, result) => sum + result.revenue, 0);
  };

  const selectedInstance = instances.find(i => i.id === selectedInstanceId);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Driver Results</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {instances.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No driver instances found</p>
                <p className="text-xs text-gray-500 mt-2">
                  Create a driver instance to see results
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Select Driver
                </label>
                <select
                  value={selectedInstanceId || ''}
                  onChange={(e) => setSelectedInstanceId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {instances.map(instance => (
                    <option key={instance.id} value={instance.id}>
                      {instance.name}
                    </option>
                  ))}
                </select>

                {selectedInstance && (
                  <>
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Type:</span> {selectedInstance.template?.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">Period:</span>{' '}
                        {selectedInstance.configuration.period_start} to{' '}
                        {selectedInstance.configuration.period_end}
                      </p>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Active Period</p>
                      <div className="grid grid-cols-12 gap-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                          const startDate = parseISO(selectedInstance.configuration.period_start);
                          const endDate = parseISO(selectedInstance.configuration.period_end);
                          const monthDate = new Date(startDate.getFullYear(), idx, 1);
                          const isActive = monthDate >= new Date(startDate.getFullYear(), startDate.getMonth(), 1) &&
                                          monthDate <= new Date(endDate.getFullYear(), endDate.getMonth(), 1);

                          return (
                            <div key={month} className="flex flex-col items-center">
                              <div
                                className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-medium transition-all ${
                                  isActive
                                    ? 'bg-green-500 text-white shadow-sm'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                                title={`${month} - ${isActive ? 'Active' : 'Inactive'}`}
                              >
                                {month.substring(0, 1)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No results calculated yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-600 font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">
                          {formatCurrency(getTotalRevenue())}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 font-medium">Periods</p>
                        <p className="text-2xl font-bold text-blue-700 mt-1">
                          {results.length}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Monthly Breakdown
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {results.map(result => (
                          <div
                            key={result.id}
                            className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-900">
                                {format(parseISO(result.period_date), 'MMM yyyy')}
                              </span>
                              <span className="text-xs font-bold text-gray-900">
                                {formatCurrency(result.revenue)}
                              </span>
                            </div>
                            {result.customers && (
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Customers</span>
                                <span>{formatNumber(result.customers)}</span>
                              </div>
                            )}
                            {result.units && (
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Units</span>
                                <span>{formatNumber(result.units)}</span>
                              </div>
                            )}
                            {result.calculated_values && Object.keys(result.calculated_values).length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <details className="text-xs">
                                  <summary className="text-gray-600 cursor-pointer hover:text-gray-900">
                                    View Details
                                  </summary>
                                  <div className="mt-2 space-y-1">
                                    {Object.entries(result.calculated_values).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-gray-600 capitalize">
                                          {key.replace(/_/g, ' ')}:
                                        </span>
                                        <span className="text-gray-900">
                                          {typeof value === 'number' ? formatNumber(value) : value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DriverResultsPanel;
