import { useState, useEffect } from 'react';
import { X, History, Calendar, User, Check, Eye, GitCompare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { forecastService } from '../../services/forecastService';
import type { ForecastVersion } from '../../types/forecast';
import Button from '../UI/Button';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  onLoadVersion: (versionId: string) => void;
  onCompareVersions: (version1Id: string, version2Id: string) => void;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  year,
  onLoadVersion,
  onCompareVersions,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<ForecastVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, year]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const data = await forecastService.getVersionHistory(year);
      setVersions(data);
    } catch (error) {
      console.error('Error loading version history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (versionId: string) => {
    try {
      await forecastService.setActiveVersion(versionId, year);
      await loadVersions();
    } catch (error) {
      console.error('Error setting active version:', error);
    }
  };

  const handleDelete = async (versionId: string) => {
    if (!confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
      return;
    }
    try {
      await forecastService.deleteVersion(versionId);
      await loadVersions();
    } catch (error) {
      console.error('Error deleting version:', error);
    }
  };

  const toggleComparisonSelection = (versionId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      }
      if (prev.length >= 2) {
        return [prev[1], versionId];
      }
      return [...prev, versionId];
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      onCompareVersions(selectedForComparison[0], selectedForComparison[1]);
      setSelectedForComparison([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-[#3AB7BF]" />
            <h2 className="text-2xl font-semibold text-gray-900">Version History - {year}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {selectedForComparison.length === 2 && (
          <div className="px-6 py-3 bg-[#EEF2FF] border-b border-[#C7D2FE] flex items-center justify-between">
            <span className="text-xs text-[#4338CA] font-medium">
              2 versions selected for comparison
            </span>
            <Button onClick={handleCompare} variant="primary" size="sm">
              <GitCompare className="w-4 h-4 mr-2" />
              Compare Versions
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AB7BF]"></div>
              <p className="mt-4 text-gray-600">Loading versions...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No saved versions yet</p>
              <p className="text-gray-400 text-xs mt-2">
                Save your first forecast to start tracking version history
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-5 transition-all ${
                    selectedForComparison.includes(version.id)
                      ? 'border-[#4F46E5] bg-[#EEF2FF]/80 backdrop-blur-sm'
                      : 'border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {version.name}
                        </h3>
                        {version.is_active && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          v{version.version_number}
                        </span>
                      </div>

                      {version.description && (
                        <p className="text-gray-600 text-xs mb-3">{version.description}</p>
                      )}

                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(version.created_at), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Total Forecast:</span>
                          <span className="text-gray-900 font-semibold">
                            ${version.total_forecasted_amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleComparisonSelection(version.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedForComparison.includes(version.id)
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Select for comparison"
                      >
                        <GitCompare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onLoadVersion(version.id)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {!version.is_active && (
                        <>
                          <button
                            onClick={() => handleSetActive(version.id)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Set as active version"
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(version.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete version"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
